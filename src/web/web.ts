// import * as http from "http";
import http from "node:http"; // In production, switch to https
import url from "node:url";
import fs from "node:fs";
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
function postController(pathname:string, res:ServerResponse){
  // Grab the post id
  // Get data from Post table
  // Display to the client
  return res.end("Post");
}
function createController(pathname:string, res:ServerResponse){
  // const createPagePath = path.join(process.cwd(), "src", "frontend", "create.html");
  const createPagePath = path.join(__dirname, "..", "frontend", "create.html" );
  console.log(__dirname);
  console.log(process.cwd());
  console.log(createPagePath);
  const createPage = fs.readFileSync(createPagePath,"utf-8");
  return res.end(createPage);
}

export default function webInit(db: Database) {

  function handleRequest(req: IncomingMessage, res: ServerResponse) {

    if (req.url === "/favicon.ico") {
      return res.end();
    }
    console.log("Got a request:", req.url);

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
    if (typeof pathname === "string" && pathname.startsWith("/post" )){
      return postController(pathname,res);
    }

    // HANDLE /create ROUTE (Create new Blog Posts)
    if (typeof pathname === "string" && pathname.startsWith("/create" )){
      return createController(pathname,res);
    }

    return res.end("Login");
  }
  const server = http.createServer(handleRequest);

  server.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
  })

}