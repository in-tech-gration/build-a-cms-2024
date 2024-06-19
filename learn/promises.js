// 1) The Promise constructor
const promise1 = new Promise(()=>{});
// promise1 is already in pending
console.log(promise1);
// Promise {} <pending>
// WARNING: This one will be constantly in <pending>. This will NEVER resolve or reject
// WATCH OUT FOR: missing resolve()/reject()
// Remember this example contains WRONG code.

// 2) A better promise...
const promise2a = new Promise(()=>{});
const promise2b = new Promise(function(){});
const promise2c = new Promise(function named(){});
function named(){}
const promise2d = new Promise(named);
// All these functions above can be using the `async` keyword.
const promise2e = new Promise(async ()=>{});
// WARNING: These promises above are still wrong, because they never resolve() or reject()


// 3) Another Promise
// The new Promise() requires a callback function argument:
// The callback signature is: function(resolve,reject)
// Best practice: always provide and use both of them.
const promise3 = new Promise(function(resolve,reject){
  resolve(42);
});
// resolve() can be handled via then(callback)
promise3.then(function(){
  console.log("resolved!")
});
// This promise3 will ALWAY resolve to 42. There's no other scenario happening in this case.

// 4) The error case:
const promise4 = new Promise(function(resolve,reject){
  reject(22);
})
promise4
// .then(function(){ console.log("Resolved?")})
.catch(function(){
  console.log("Rejected");
})
// This promise4 will ALWAYS reject



// 5) Pass some value from resolve/reject to then/catch
const promise5 = new Promise(function(resolve,reject){
  resolve(200);
  reject(404); // This will get ignored. Try to switch the order of these 2 and check the result.
});
promise5
.then(function(resolveArg /* 200 */){
  console.log(resolveArg);
})
.catch(function(rejectArg /* 404 */){
  console.log(rejectArg)
});
// Caution: This code is WRONG. resolve/reject are unconditionally called.

// 6) A proper promise...
const promise6 = new Promise(function(res,rej){
  setTimeout(function(){
    if ( Math.random() > 0.5 ){
      return res("Tail");
    } 
    rej("Heads");
  },2000);
});
promise6 // No control over when this is going to happen. Immediately starts in pending mode.
.then(function(data){ // fulfilled
  console.log("then()", data);
})
.catch(function(error){ // rejected
  console.log("catch()", error);
})
.finally(function(){ // settled
  console.log("Promise Settled");
});



// 7) A proper promise... with control
const promise7fn = ()=> {
  return new Promise(function(res,rej){
    setTimeout(function(){
      if ( Math.random() > 0.5 ){
        return res("Tail");
      } 
      rej("Heads");
    },2000);
  });
}
promise7fn() 
.then(function(data){ // fulfilled
  console.log("then()", data);
})
.catch(function(error){ // rejected
  console.log("catch()", error);
})
.finally(function(){ // settled
  console.log("Promise Settled");
});


// 8) 
// - try/catch is used with synchronouse code
// - errors thrown inside a promise will automatically reject
const promise8 = ()=> {
  return new Promise(function(res,rej){
    res(42 + a); // This will throw an Error
    // and the promise will AUTO reject
    // ReferenceError => rej(Error) (Implicitly called)
  })
}
promise8()
.then(function(data){
  // data === 42
})
.catch(function(error){

})

// 9) Handle synchronous errors inside the promise
const promise9 = ()=> {
  return new Promise(function(res,rej){
    try {
      res(42 + a); 
    } catch(e){
      rej("Exploded inside. All good. Just a simple error");
    }
    console.log("Finished OK");
  })
}
promise9()
.then(function(data){
  // data === 42
})
.catch(function(error){
  console.log(error);
})

// 10) Chaining promises
const promise10a = ()=>{
  return new Promise((res,rej) =>{
    res("A");
  })
}
const promise10b = ()=>{
  return new Promise((res,rej) =>{
    res("B");
  })
}
// One way... similar to pyramid of Doom/callback hell
promise10a()
.then( pA =>{
  console.log(pA);
  promise10b()
  .then( pB =>{
    console.log( pB );
    promise10a()
    .then( pA => {
      console.log(pA);
      promise10b()
      .then( pB =>{
        console.log(pB);
      })
    })
  })
})

// ...a better way
promise10a()
.then( pA =>{
  console.log(pA);
  return pA; // => Turned into a Promise*:
  // return new Promise( res => res(pA) )
  // "A" => Promise {} <resolved> "A"
})
.then( resultOfPreviousPromise =>{
  console.log(resultOfPreviousPromise);
  return resultOfPreviousPromise.toUpperCase()
})
.then( data => console.log(data) );
// *Same thing will happen inside a catch()
// ...with a slight twist

// Usually we see this in production code:
grabUserData()
.then( fetchUserPost )
.then( fetchPostComments ) // If an error gets thrown here or the promise rejects, the next levels (then()) will be skipped and we'll get straight to the catch()
.then( fetchLikes )
.then( renderToPage )
.catch( errorHappeningAnywhereOnTheChain =>{
  // Handle any chain error here
})

// 11) Explore 
const promise11 = ()=>{
  return new Promise((res,rej)=>{
    rej(22);
  })
}
promise11()
.catch( error =>{
  return error; // <= What happens here?
})
// What can we use here? .then(), .catch()?
// What's the difference?

// 12) Promise.all()
const promise12a = ()=>{
  return new Promise(res =>{
    res("A")
  })
}
const promise12b = ()=>{
  return new Promise(res =>{
    setTimeout(()=>{
      res("B")
    },2000);
  })
}
const promise12c = ()=>{
  return new Promise(res =>{
    res("C")
  })
}
// Promise.all([ Promise, Promise, Promise ])
const promises = [ 
  promise12a(), // 0
  promise12b(), // 1 // What if this rejects?
  promise12c()  // 2
];
const all = Promise.all(promises);
all.then( aggregatedData =>{
  console.log(aggregatedData);
  // aggregatedData is an Array of EXACTLY the
  // same length as the Promises Array
  aggredatedData.length === promises.length;
  // The aggredatedData will ALWAYS contain the
  // results of each promise in the original order
  // Result of promise12a ALWAYS in aggregatedData[0]
  // Result of promise12b ALWAYS in aggregatedData[1]
  // Result of promise12c ALWAYS in aggregatedData[2]
}).catch();