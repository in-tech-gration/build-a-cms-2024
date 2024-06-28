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
      // Check if a cookie is set
      // If not, show the Login form
      // Otherwise server relevant data to the authenticated user
      const { cookie } = req.headers;
      if ( cookie ){
        const cookieObj = qs.parse(cookie);
        console.log("Cookie:", cookieObj.user_email);
        if ( cookieObj.user_email ){
          // Send the user's data
          const sql = `SELECT * FROM Users WHERE email="${cookieObj.user_email}"`;
          db.get(sql, (err:Error,row:any)=>{
            if ( err || !row ){
              return res.end("Something went wrong");
            }
            res.writeHead(200, {
              "Content-Type": "text/html",
            })
            return res.end(`
              <p>
                Logged in as ${row.username} (role:${row.role})
              </p>
            `);
          });
          return;
        }
      }

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
        const parsedData = qs.parse(data);
        // ! CAUTION: We should replace this highly unsafe SQL statement with a Prepared Statement (db.prepare)
        const sql = `SELECT * FROM Users WHERE email="${parsedData.email}"`;
        db.get(sql, (err:Error,row:any)=>{
          if ( err || !row ){
            // CHALLENGE: 
              // Replace this with a more informative HTML page
              // Send 200 code and a full valid HTML page using a helper function, e.g. a template helper getPage("user")
            return res.end("Something went wrong");
          }
          if ( parsedData.email === row.email && parsedData.password === row.password ){
            // Create a cookie that contains the authentication data
            const cookie = `user_email=${row.email}; HttpOnly; Path=/`;
            // Send cookie to the user:
            res.writeHead(200, {
              "Content-Type": "text/html",
              // Setting the cookie headers
              "x-custom-header": "Hello from intechgration.io",
              // Cookie: data; options;
              // data: user_email=ada@lovelace.com
              "Set-Cookie": cookie
            })
            return res.end(`
              <p>
                Logged in as ${row.username} (role:${row.role})
              </p>
            `);
          }
          // CHALLENGE: See which correct status code to set here? e.g. 401
          res.end("Wrong credentials");
        });

      });
      
      return; 
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