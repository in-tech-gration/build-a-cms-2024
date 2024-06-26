const fs = require("node:fs")
const path = require("node:path")

import { ServerResponse } from "node:http";

function homeController(res: ServerResponse) {
  const errorPath = path.join(__dirname, "..", "frontend", "home.html");
  const errorPage = fs.readFileSync(errorPath, "utf-8");

  res.writeHead(200, { 'Content-Type': 'text/html' });
  return res.end(errorPage);
}

module.exports = homeController;