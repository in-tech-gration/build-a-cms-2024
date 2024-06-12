const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("src/db/cms.db", onDBInit);

// Parameter 'error' implicitly has an 'any' type.ts(7006)
// @ts-ignore
function onDBInit(error){
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