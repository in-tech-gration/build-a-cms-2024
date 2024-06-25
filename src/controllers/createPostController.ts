import { IncomingMessage, ServerResponse } from "node:http";
import qs from "node:querystring";
import { Database, RunResult } from "sqlite3";



function createPostController(req: IncomingMessage, res: ServerResponse, db: Database) {
  let data = "";
  req.on("data", chunkOfData => {
    data += chunkOfData.toString();
  });
  req.on("end", () => {

    // console.log("Original data:", data);
    const unsafeParsedData = qs.parse(data);
    // console.log("Parsed data:", unsafeParsedData);
    // console.log(unsafeParsedData.title, unsafeParsedData.content);
    db.run(`INSERT OR IGNORE INTO Posts (
      user_id,
      title,
      content,
      created
    ) VALUES (
     100,
     "${unsafeParsedData.title}",
     "${unsafeParsedData.content}",
     ${new Date().getTime()}
    )`, function (this:RunResult ,err: Error) {
      if (err) {
        console.log("Error creating post", err);
        return res.end("Problem!");
      }
      console.log(this.lastID); // <= The dynamic unique primary key that was just created by SQLite. You MUST use a function definition. Arrow functions will NOT work.
      res.writeHead(201, { 'Content-Type': 'text/html' })
      // Create a special HTML, load it via fs.readFile and serve it to the user.
      return res.end(`
        <h3>Post with title ${unsafeParsedData.title} created successfully</h3>
        <p>
          <a href="/posts/${this.lastID}">Click here to see the post</a> or <a href="/create">click here to create another post.</p>
        </p>
      `);
    });

  });

}

module.exports = createPostController;