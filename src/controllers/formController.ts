import {  ServerResponse } from "node:http";
const fs = require("node:fs")
const path = require("node:path")

function loadContent(page:string){
  let output = null;
  // Code here...
  // This function can be-reused
  // It should be imported
  return output;
}

function formController( res: ServerResponse) {

  // Example:
  // const output = loadContent("create");
  // res.end(output);

  // const createPagePath = path.join(process.cwd(), "src", "frontend", "create.html");
  const createPagePath = path.join(__dirname, "..", "frontend", "create.html");
  // console.log(__dirname);
  // console.log(process.cwd());
  // console.log(createPagePath);
  const createPage = fs.readFileSync(createPagePath, "utf-8");
  res.writeHead(200, { 'Content-Type': 'text/html' });
  return res.end(createPage);
}

module.exports = formController;