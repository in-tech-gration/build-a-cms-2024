import createDB from "./config";
import { createTable } from "./init";

const db = createDB();

function populateTable(){
  const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
  for (let i = 0; i < 5; i++) {
    const text = "Ipsum " + i;
    stmt.run(text);
  }
  stmt.finalize(); 
}
function readTable(){
    // TODO: Replace any with appropriate types:
  // Parameter 'err' implicitly has an 'any' type.ts(7006)
  function runForEachRow(err:any,row:any){
    if ( err ){
      return console.log("Something wrong happened: ", err);
    }
    console.log("| " + row.id + " | " + row.info + " |"); 
  }
  const sqlSelect = "SELECT rowid AS id, info FROM lorem";

  db.each(sqlSelect, runForEachRow);
}
function runSerialized(){

  // SELECT Table => Exists?
  // db.run("SELECT * FROM TableX"); // => SQLITE_ERROR: no such table: TableX
  
  db.run("CREATE TABLE lorem (info TEXT)", (error:any) =>{
    if ( error ){
      return console.log("SQL error", error.message);
    }
    console.log("All good!");
  }); 

  // createTable(db);
  // populateTable();
  // readTable();
}

db.serialize(runSerialized);
db.close(); 

// Think how this module is going to be connecting with the web server module (src/index.ts)