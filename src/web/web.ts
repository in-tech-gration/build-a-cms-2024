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

    // 🚧 HANDLE /user/:id ROUTE (PROTECTED)
    if (typeof pathname === "string" && pathname.startsWith(`/user`) ){
      return res.end("PROTECTED");
      return userController(pathname,res);
    }

    // ✅ HANDLE /posts/:id ROUTE 
    if (typeof pathname === "string" && pathname.startsWith("/posts" )){
      return postController(pathname,res,db);
    }

    // 🚧 HANDLE /create ROUTE (Displaying the form) (PROTECTED)
    if (typeof pathname === "string" && pathname.startsWith("/create" )){

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