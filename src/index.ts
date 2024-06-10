// import * as http from "http";
import http from "node:http"; // In production, switch to https
import url from "node:url";
import { IncomingMessage, ServerResponse } from "node:http";

function handleRequest( req:IncomingMessage, res:ServerResponse ){
  // Handle requests: handle the / (home) and the /admin (domain.com, domain.com/admin/)
  if ( typeof req.url === "undefined" ){
    return res.end("Something...");
  }
  const { pathname } = url.parse(req.url);
  if ( pathname === "/" ){
    return res.end("Home");
  }
  return res.end("Login");
} 
const server = http.createServer(handleRequest);

server.listen(process.env.PORT, ()=>{
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
})