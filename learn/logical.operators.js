// The || and the && Operator:
// - Remember that there are also are | and & (Bitwise operators)

// When the first part evaluates to true, its value is returned and the second part is skipped:
// A(true)  || B(true)  => A(true): 42 || false, Math.random() > 0.5 || 42, Math.random() > 0.5 || 4+4
// If the first part evaluates to false, the second value is evaluated and returned:
// A(false) || B(true)  => B(true)

// Tips: Make sure to break both parts of the expression into smaller steps and log their result:
Math.random() > 0.5 || 4+4;
const random = Math.random();
console.log(random);
const checkIfReducedPriceIsAvailable = random > 0.5;
console.log(checkIfReducedPriceIsAvailable);
const totalCost = 4+4;
checkIfReducedPriceIsAvailable || totalCost; // <= The second part operation is always evaluated in the line above
checkIfReducedPriceIsAvailable || 4+4; // <= The second part operation will be skipped 
true || totalCost // <= How can we skip the second evaluation in case the first part is true 
// true ? "do this" : totalCost; // <= We still get totalCost evaluated
const totalPrice = ()=> 4+4
true || totalPrice()
 
// A(true)  && B(true)  => B(true)
// A(false) && B(true)  => A(false)

5*45>300 || 5+5;
const f = 5*45*300;
console.log(f);
console.log(Boolean(f))
