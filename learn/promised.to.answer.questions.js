// UNEDITED:
// Promise constructor => new Promise() => Promise {}
const promise = new Promise(function(res,rej){
  res(42); // Q: No try/catch here... // Q: No return. undefined or 42? 
}); // Q: Why rej() is missing?
promise.then().catch().finally(function(){ // Q: Why then()?
  console.log("Promise fulfilled"); // fulfilled === res() || rej()
});
function somePromise(){
  return new Promise(function(res,rej){
    res(42);
  });
}
somePromise().then().catch().finally()
// Q: What's the deal with async? Is this different/same? In what way different/same?
// Q: When we want to call an async function from within a Promise?
async function someAsync(){
  return new Promise(function(res,rej){
    await fetch();
    res(42);
  });
}


// Promise.all() => static methods are directly called through the constructor/class Object

// Array => new Array()
// Array.isArray([]) => true, Array.isArray("") => false