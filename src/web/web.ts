// import * as http from "http";
import http from "node:http"; // In production, switch to https
import url from "node:url";
import { IncomingMessage, ServerResponse } from "node:http";
import { Database } from "sqlite3";
const user = require("../../frontend/user")
const home = require("../../frontend/home")
import { User } from "../types/types";

function onResponse(res: ServerResponse, markup: HTMLAllCollection) {
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

export default function webInit(db: Database) {

  function handleRequest(req: IncomingMessage, res: ServerResponse) {
    if (req.url === "/favicon.ico") {
      return res.end();
    }
    console.log("Got a request:", req.url);
    // Handle requests: handle the / (home) and the /admin (domain.com, domain.com/admin/)
    if (typeof req.url === "undefined") {
      return res.end("Something...");
    }

    const { pathname } = url.parse(req.url);

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
    return res.end("Login");
  }
  const server = http.createServer(handleRequest);

  server.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
  })

}