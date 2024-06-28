// import * as http from "http";
import http, { IncomingMessage, ServerResponse } from "node:http"; // In production, switch to https
import url from "node:url";
import { Database } from "sqlite3";
const userController = require("../controllers/userController")
const formController = require("../controllers/formController.ts")
const postController = require("../controllers/postController")
const createPostController = require("../controllers/createPostController")
const errorController = require("../controllers/errorController")
const homeController = require("../controllers/homeController")
import qs from "node:querystring";
// import { User } from "../types/types";


function userId(url: string) {
  const searchParams = new URLSearchParams(url);
  let user_id = ""
  for (const param of searchParams) {
    user_id = param[1]
  }
  return user_id
}

// Express.js: the power of abstraction and patterns
// app.get("/", (req,res)=>{})
// app.get("/client", clientController)
// app.post("/client", clientController)
// app.post("/login", loginController)

export default function webInit(db: Database) {
  // ✅ 🚧

  function handleRequest(req: IncomingMessage, res: ServerResponse) {

    // ✅ PUBLIC
    if (req.url === "/favicon.ico") {
      return res.end();
    }
    console.log(`Got a ${req.method} request:`, req.url);

    // ✅ PUBLIC
    if (typeof req.url === "undefined") {
      return (errorController(res));
    }

    const { pathname } = url.parse(req.url);

    // ✅ HANDLE / ROUTE (PUBLIC)
    if (pathname === "/") {
      return homeController(res);
    }

    // ✅ HANDLE /posts/:id ROUTE 
    if (typeof pathname === "string" && pathname.startsWith("/posts" )){
      return postController(pathname,res,db);
    }
    
    // 🚧 HANDLE /user/:id ROUTE (PROTECTED) [GET+POST]
    if (typeof pathname === "string" && pathname.startsWith(`/user`) ){
      // "admin" : "1234"
      // HANDLE GET:
      if ( req.method === "GET" ){

        // Display a login page, email+password
        res.writeHead(200,{
          "Content-Type": "text/html"
        })
        res.end(`
          <style>html { color-scheme: dark; }</style>
          <form method="POST">
            <input name="email" placeholder="Enter email">
            <input name="password" placeholder="Enter password" type="text">
            <button>Login</button>
          </form>
        `);

        return;

      }
      // HANDLE POST:
      let data = "";
      req.on("data", chunk =>{
        // console.log({ chunk });
        data += chunk;
      });
      req.on("end", ()=>{
        // console.log({ data }); // "admin=whatever&password=whatever"
        const parsedData = qs.parse(data);
        // console.log({ parsedData });
        // console.log( parsedData.email, parsedData.password );
        // TODO: Checking user email + password, against our DB
        // 1) db.get() => SELECT password FROM Users WHERE email=parsedData.email
        // 2) Database will give us "charles_made_me_do_this"
        // 3) Compare parsedData.password == "charles_made_me_do_this"
        // 4) Get the user's data from the Database (email, username, role, etc.)
        // charles_made_me_do_this
        // ! CAUTION: We should replace this highly unsafe SQL statement with a Prepared Statement (db.prepare)
        const sql = `SELECT * FROM Users WHERE email="${parsedData.email}"`;
        // console.log("Let's xray the SQL:", sql); 
        db.get(sql, (err:Error,row:any)=>{
          if ( err || !row ){
            console.log(err);
            // CHALLENGE: Replace this with a more informative HTML page
            // Send 200 code and a full valid HTML page using a helper function, e.g. a template helper getPage("user")
            return res.end("Something went wrong");
          }
          // console.log({ row });
          if ( parsedData.email === row.email && parsedData.password === row.password ){
            // Display the user data
            return res.end(`Logged in as ${row.username} (role:${row.role})`);
          }
          res.end("Wrong credentials");
        });

      });
      
      // email+password => Is the user authenticated?
      // Yes => redirect to the page (userController)
      // No => No accesss
      
      return; 
      // return userController(pathname,res);
    }

    // 🚧 HANDLE /create ROUTE (Displaying the form) (PROTECTED)
    if (typeof pathname === "string" && pathname.startsWith("/create" )){
      return res.end("PROTECTED");

      // HANDLE POST /create
      if ( req.method === "POST"){
        return createPostController(req,res,db);
      }
      // HANDLE GET /create
      return formController(res);
    }

    // ✅ ERROR 404 (PUBLIC)
    return errorController(res);
  }
  const server = http.createServer(handleRequest);

  server.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
  })

}