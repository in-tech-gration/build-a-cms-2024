import { ServerResponse } from "node:http";

function userController(pathname: string, res: ServerResponse) {
  // Handle /user/:id => /user/100, /user/101, etc.
  // Check user id only when we are in /user
  // pathname === "/user" ONLY when "/user"
  // pathname.startWith("/user") => /user, /user/100, user/whatever
  console.log({ pathname });
  // CHALLENGE: Parse the id number part (100, 101, etc.) and pass this to a database call to get the user data and then render it to the client.
  // /user
  // /user/
  // /user/100
  // /user/101
  // /user/101/somethingelse?
  return res.end(`User`);
}

module.exports = userController;
