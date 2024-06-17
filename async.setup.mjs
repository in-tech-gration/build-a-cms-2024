import webInit from "./web.mjs";
import dbInit from "./db.mjs";
dbInit( webInit ); 

// db.mjs:
export default function dbInit(cb){
  console.log("Database server initialized!");
  setTimeout(()=>{
    console.log("Table ready!");
    cb({ table: "Users" });
  },500);
}

// web.mjs:
export default function webInit(db){
  console.log("Web server initialized!");
  function listen(){
    console.log("Table:", db);
  }
  listen();
}

