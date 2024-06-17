const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("src/db/cms.db", onDBInit);


function onDBInit(error:Error){
  if ( error ){
    return console.log("Problem while opening the DB:", error);
  }
  console.log("All good with the DB initialization");
}

export default () => {
  try {
    return db;
  } catch (e) {
    console.error(`Database initalization ${e}`)
  }
}