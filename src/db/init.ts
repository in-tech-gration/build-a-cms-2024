// FIX THIS: 
// Perhaps add a 2nd parameter?
export function createTable(db:any){
  db.run("CREATE TABLE lorem (info TEXT)"); // Check the docs for db.*
}