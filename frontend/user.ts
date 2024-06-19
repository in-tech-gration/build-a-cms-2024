const head = require('./head');
const footerHtml = require('./footer');

function user(id:string, username:string, email:string, role:string ) {
  return `
    ${head('User')}
      <p>Id: ${id}</p>
      <p>Username: ${username}</p>
      <p>Email: ${email}</p>
      <p>Role: ${role}</p>
    ${footerHtml()}
  `;
}

module.exports = user;