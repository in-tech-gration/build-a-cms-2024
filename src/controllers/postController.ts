import { ServerResponse } from "node:http";
import { Database } from "sqlite3";


function postController(pathname: string, res: ServerResponse, db: Database) {
  // Grab the post id
  const id = pathname.split("/posts/")[1];
  console.log({ id }); // <= We need to handle edge cases, e.g. undefined, etc.

  if (typeof id === "undefined" || id === "") {
    // Get the last 3 posts
    // Mnemonic: Sweaty Feet Will Give Horrible Odours => Sweaty/SELECT, Feet/FROM, Odours/ORDER
    const sql = `SELECT post_id,title,content,created FROM Posts ORDER BY created desc LIMIT 3`
    // console.log(sql)
    return db.all(sql, (err: Error, row: any) => {
      if (err) {
        console.log(err);
        return res.end("Ops!");
      }
      // console.log({ row });
      // Display them
      let html = `
        <html>
        <head>
          <style>html { color-scheme: dark; }</style>
        </head>
        <body>
      `;
      html += `<h1>Our latest 3 posts</h1>`;
      html += `<ul>`;
      row.forEach((entry: any) => {
        html += `<li>
          <a href="/posts/${entry.post_id}">
            ${entry.title} created on ${new Date(entry.created).toLocaleDateString("el-EL")}
          </a>
        </li>`
      })
      html += `</ul></body></html>`;
      return res.end(html);
      // CHALLENGE: Create a show more Posts button
      // CHALLENGE (ADVANCED): Provide a Search for the posts
    });
  }

  // Get data from Post table
  const sql = `SELECT title, content, created FROM Posts WHERE post_id=${id}`;
  // console.log(sql);
  db.get(sql, (err: Error, row: any) => {
    if (err || !row) {
      console.log({ err });
      return res.end("Not found");
    }
    console.log({ row });
    // CHALLENGE: Create a Template function: getPostHTML(row);
    res.end(`
      <html>
        <head>
        <style>html { color-scheme: dark; }</style>
        </head>
        <body>
          <h1>${row.title}</h1>
          <h3>Created at ${new Date(row.created).toLocaleDateString("el-EL")}</h3>
          <p>${row.content}</p>
        </body>
      </html>
    `);
  });
}

module.exports = postController;