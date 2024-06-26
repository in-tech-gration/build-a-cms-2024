const headHtml = require('./head');
const footer = require('./footer');

function home(){
console.log("home");

  return (`
     ${headHtml('Home')}
      <h1>Home</h1>
      <form>
        <input type="text" name="name">
        <input type="number" name="id">
      </form>
      ${footerHtml()}
    `)
}



module.exports = home;