CLIENT:email+password => AUTHENTICATING => SERVER => CHECKS DB FOR email+password

SERVER => Cookie:admin@gmail.com+admin => CLIENT

CLIENT:Cookie => SERVER => CHECKS => SERVES DATA

PROBLEM: Cookies can be mofified, Cookie:admin@gmail.com => Cookie:superadmin@gmail.com

CLIENT:Cookie:superadmin@gmail.com => SERVER => CHECKS => SERVES DATA

---

A better approach:

CLIENT email+password => SERVER CREATES: Cookie:email

CLIENT Cookie:email  => Correct or not? Correct
CLIENT Cookie:email2 => Correct or not? Incorrect

# Hashes look a lot like this: 7245afb284e111540e0e8ac515032aef0ab2b73e

One-way hash functions: A => 9999
No way back: 9999 => A
For every single value passed in, we get a unique number back.
There will never (almost) be something like this:
a => 9999
A => g45d
B => 4444

CLIENT email+password => SERVER CREATES: => hash(email+secret_server_key) => 9999 => Cookie:email+hash => Cookie:email+9999

CLIENT Cookie:email+9999 => SERVER => hash(email+secret_server_key) => 9999 === 9999

CLIENT Cookie:emai1+9999 => SERVER => hash(emai1+secret_server_key) => 87d4 === 9999

CLIENT Cookie:emai1+87d4 => ?

## Sample code

```js
// ENCODE: When creating the cookie after auth:
const { createHash } = require('node:crypto');
const secret = "SHOULD_BE_SECURE_RANDOM_AND_LONG_ENOUGH"; // <= This is NOT secure!
const user = "admin" + secret;
const hash = createHash('sha256').update(user).digest('hex');
console.log({ hash }); // 087388f9ab9818e7749d38e947175ca4f7b8285963b833bf32a29fecc7e2fd5b
// Cookie: user_email=admin&hash=087388f9ab9818e7749d38e947175ca4f7b8285963b833bf32a29fecc7e2fd5b

// DECODE: When receiving a cookie:
const userCookie = "user=admin&hash=087388f9ab9818e7749d38e947175ca4f7b8285963b833bf32a29fecc7e2fd5b"
// Split the cookie and get the 'admin' value and the 'hash' value;
const userEmail = "admin";
const userHash = "087388f9ab9818e7749d38e947175ca4f7b8285963b833bf32a29fecc7e2fd5b";
const hashNew = createHash('sha256').update(userEmail+secret).digest('hex');
console.log( hash === hashNew);
```
