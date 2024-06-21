// user_id, username, email
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("src/db/cms.db");

export default function dbInit( cb:any ){

  db.serialize(() => {

      db.run(`
        CREATE TABLE 
        IF NOT EXISTS Users 
        (
          user_id INTEGER PRIMARY KEY,
          username TEXT,
          email TEXT,
          password TEXT,
          role TEXT
        )
      `)

      db.run(`
        INSERT OR IGNORE INTO Users (
          user_id,
          username,
          email,
          password,
          role
        ) VALUES (
         102,
         "Claude Shannon",
         "claude@net.com",
         "I like to juggle",
         "admin"
        )
      `)
  
      db.run(`
        CREATE TABLE 
        IF NOT EXISTS Posts 
        (
          post_id INTEGER PRIMARY KEY,
          user_id INTEGER,
          title TEXT,
          content TEXT,
          created DATE,
          updated DATE,
          FOREIGN KEY (user_id) REFERENCES Users(user_id)
        )
      `, (error:Error) =>{
        if ( error ){
          console.log("DB Error. Web server init stopped.", error);
          return db.close(); 
        }
        cb(db);
      })

      // How to populate the DB once?
      // const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
      // for (let i = 0; i < 3; i++) {
      //     stmt.run("Ipsum " + i);
      // }
      // stmt.finalize();
  
  });
  
  // db.close();

}
