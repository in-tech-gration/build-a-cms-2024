// Responsibility of the "connector":
// 1) Load all the appropriate modules
import webInit from "./web/web"
import dbInit from "./db/db";
// 2) Start them up in the appropriate order
// Start DB first, make sure that it's up and running, then connect DB to the web server and then start listening
dbInit( webInit );