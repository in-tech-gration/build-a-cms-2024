const head = require('./head');
const footerHtml = require('./footer');

function turnUnsafeStringIntoSafe(unsafeStr:string){
  const safeStr = unsafeStr.replace("<script>",""); // <= We should do something here to secure the string
  return safeStr;
}

function user(id:string, unsafeUsername:string, email:string, role:string ) {

  const safeUsername = turnUnsafeStringIntoSafe(unsafeUsername);

  return `
    ${head('User')}
      <p>Id: ${id}</p>
      <p>Username: ${safeUsername}</p>
      <p>Email: ${email}</p>
      <p>Role: ${role}</p>
    ${footerHtml()}
  `;
}

module.exports = user;