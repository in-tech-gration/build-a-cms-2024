// import * as http from "http";
import http from "node:http"; // In production, switch to https
import url from "node:url";
import { IncomingMessage, ServerResponse } from "node:http";

interface Row {
  username: string
  email: string
  role: string
}

export default function webInit(db:any){

  function handleRequest( req:IncomingMessage, res:ServerResponse ){
    if ( req.url === "/favicon.ico" ){
      return res.end();      
    }
    console.log("Got a request:", req.url);
    // Handle requests: handle the / (home) and the /admin (domain.com, domain.com/admin/)
    if ( typeof req.url === "undefined" ){
      return res.end("Something...");
    }
    const { pathname } = url.parse(req.url);
    if ( pathname === "/" ){
      const id = req.url.split("?")[1].split("=")[1];
      console.log("id",id);
      // Get some data from the DB and display it:
      return db.get(`SELECT username,email,role FROM Users WHERE user_id=${id}`,
        (err:Error, row:undefined|Row)=>{
          if (err || !row ){
            console.log("Not found");
            return res.end("Not found");
          }
          const { username, email, role } = row;
          // console.log(row.username, row.email, row.role);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html');
          return res.end(`
            <html>
              <head><title>Home</title></head>
              <body>
                <h1>Home</h1>
                <p>Id: ${id}</p>
                <p>Username: ${username}</p>
                <p>Email: ${email}</p>
                <p>Role: ${role}</p>
              </body>
            </html>
          `);
        }
      )
    }
    return res.end("Login");
  } 
  const server = http.createServer(handleRequest);
  
  server.listen(process.env.PORT, ()=>{
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
  })

}