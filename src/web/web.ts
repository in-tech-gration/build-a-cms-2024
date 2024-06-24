// import * as http from "http";
import http from "node:http"; // In production, switch to https
import url from "node:url";
import fs from "node:fs";
import qs from "node:querystring";
import path from "node:path";
import { IncomingMessage, ServerResponse } from "node:http";
import { Database } from "sqlite3";
const user = require("../../frontend/user")
const home = require("../../frontend/home")
import { User } from "../types/types";

function onResponse(res: ServerResponse, markup: string) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  return res.end(markup);
}
function userId(url: string) {
  const searchParams = new URLSearchParams(url);
  let user_id = ""
  for (const param of searchParams) {
    user_id = param[1]
  }
  return user_id
}
function userController(pathname:string, res: ServerResponse){
  // Handle /user/:id => /user/100, /user/101, etc.
  // Check user id only when we are in /user
  // pathname === "/user" ONLY when "/user"
  // pathname.startWith("/user") => /user, /user/100, user/whatever
  console.log({ pathname });
  // CHALLENGE: Parse the id number part (100, 101, etc.) and pass this to a database call to get the user data and then render it to the client.
  // /user
  // /user/
  // /user/100
  // /user/101
  // /user/101/somethingelse?
  return res.end(`User`);
}
function postController(pathname:string, res:ServerResponse, db:Database){
  // Grab the post id
  const id = pathname.split("/posts/")[1];
  console.log({id}); // <= We need to handle edge cases, e.g. undefined, etc.

  if ( typeof id === "undefined" || id === "" ){
    // Get the last 3 posts
    // Mnemonic: Sweaty Feet Will Give Horrible Odours => Sweaty/SELECT, Feet/FROM, Odours/ORDER
    const sql = `SELECT post_id,title,content,created FROM Posts ORDER BY created desc LIMIT 3`
    // console.log(sql)
    return db.all(sql, (err:Error, row:any)=>{
      if ( err ){
        console.log(err);
        return res.end("Ops!");
      }
      // console.log({ row });
      // Display them
      let html = "";
      html += `<h1>Our latest 3 posts</h1>`;
      html += `<ul>`;
      row.forEach((entry:any) =>{
        html += `<li>
          <a href="/posts/${entry.post_id}">
            ${entry.title} created on ${new Date(entry.created).toLocaleDateString("el-EL")}
          </a>
        </li>`
      })
      html += `</ul>`;
      return res.end(html);
      // CHALLENGE: Create a show more Posts button
      // CHALLENGE (ADVANCED): Provide a Search for the posts
    });
  }

  // Get data from Post table
  const sql = `SELECT title, content, created FROM Posts WHERE post_id=${id}`;
  // console.log(sql);
  db.get(sql, (err:Error, row:any)=>{
    if ( err || !row ){
      console.log({ err });
      return res.end("Not found");
    }
    console.log({ row });
    // CHALLENGE: Create a Template function: getPostHTML(row);
    res.end(`
      <h1>${row.title}</h1>
      <h3>Created at ${new Date(row.created).toLocaleDateString("el-EL")}</h3>
      <p>${row.content}</p>
    `);
  });
}
function formController(pathname:string, res:ServerResponse){
  // const createPagePath = path.join(process.cwd(), "src", "frontend", "create.html");
  const createPagePath = path.join(__dirname, "..", "frontend", "create.html" );
  // console.log(__dirname);
  // console.log(process.cwd());
  // console.log(createPagePath);
  const createPage = fs.readFileSync(createPagePath,"utf-8");
  res.writeHead(200, { 'Content-Type': 'text/html' });
  return res.end(createPage);
}
function createPostController(req:IncomingMessage, res:ServerResponse, db:Database){
  let data = "";
  req.on("data", chunkOfData =>{
    data += chunkOfData.toString();
  });
  req.on("end", ()=>{

    // console.log("Original data:", data);
    const unsafeParsedData = qs.parse(data);
    // console.log("Parsed data:", unsafeParsedData);
    // console.log(unsafeParsedData.title, unsafeParsedData.content);
    db.run(`INSERT OR IGNORE INTO Posts (
      user_id,
      title,
      content,
      created
    ) VALUES (
     100,
     "${unsafeParsedData.title}",
     "${unsafeParsedData.content}",
     ${new Date().getTime()}
    )`, function(err:Error){
      if ( err ){
        console.log("Error creating post", err);
        return res.end("Problem!");
      }
      console.log(this.lastID); // <= The dynamic unique primary key that was just created by SQLite. You MUST use a function definition. Arrow functions will NOT work.
      res.writeHead(201,{ 'Content-Type': 'text/html' })
      // Create a special HTML, load it via fs.readFile and serve it to the user.
      return res.end(`
        <h3>Post with title ${unsafeParsedData.title} created successfully</h3>
        <p>
          <a href="/posts/${this.lastID}">Click here to see the post</a> or <a href="/create">click here to create another post.</p>
        </p>
      `);
    });
    
  });

}

export default function webInit(db: Database) {

  function handleRequest(req: IncomingMessage, res: ServerResponse) {

    if (req.url === "/favicon.ico") {
      return res.end();
    }
    console.log(`Got a ${req.method} request:`, req.url);

    if (typeof req.url === "undefined") {
      return res.end("Something...");
    }

    const { pathname } = url.parse(req.url);

    // HANDLE / ROUTE
    if (pathname === "/") {
      const id = userId(req.url)
      // Get some data from the DB and display it:
      return db.get(`SELECT username,email,role FROM Users WHERE user_id=${id}`,
        (err: Error, row: undefined | User) => {
          if (err || !row) {
            console.log("Not found");
            return res.end("Not found");
          }
          const { username, email, role } = row;
          console.log(id, username, email, role);

          const userHtml = user(id, username, email, role)
          onResponse(res, userHtml)
        }
      )
    }

    // HANDLE /user/:id ROUTE
    if (typeof pathname === "string" && pathname.startsWith(`/user`) ){
      return userController(pathname,res);
    }

    // HANDLE /post/:id ROUTE
    if (typeof pathname === "string" && pathname.startsWith("/posts" )){
      return postController(pathname,res,db);
    }

    // HANDLE /create ROUTE (Displaying the form)
    if (typeof pathname === "string" && pathname.startsWith("/create" )){
      // HANDLE POST /create
      if ( req.method === "POST"){
        return createPostController(req,res,db);
      }
      // HANDLE GET /create
      return formController(pathname,res);
    }

    return res.end("Login");
  }
  const server = http.createServer(handleRequest);

  server.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
  })

}