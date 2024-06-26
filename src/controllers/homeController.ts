const fs = require("node:fs")
const path = require("node:path")

import { ServerResponse } from "node:http";

// CHALLENGE: Replace with Promise version of readFile()
// https://nodejs.org/en/learn/manipulating-files/reading-files-with-nodejs
function homeController(res: ServerResponse) {

  const homePath = path.join(__dirname, "..", "frontend", "home.html");
  // CHALLENGE: Replace all 'any' types with the appropriate ones:
  fs.readFile(homePath, "utf-8", (err:Error, data:any)=>{
    if ( err ){
      console.log("Home Controller error:", err);
      // res.writeHead( ? STATUS CODE ?)
      return res.end("Home:Error: something went wrong...");
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(data);
  });

}

module.exports = homeController;

// CHALLENGE: try both promise syntax versions
// Prefer the promise version of fs.*
async function homeControllerAsync(res: ServerResponse){

  const fsPromise = require('node:fs/promises');

  // A)
  fsPromise.readFile("test.txt","utf-8")
  .then((data:any) => res.end(data) )
  .catch((error:Error) => error )

  // B)
  try {
    const data = await fsPromise.readFile('test.txt', 'utf-8');
    console.log({ data });
    res.end(data);
  } catch(e){
    console.log(e);
  }

}