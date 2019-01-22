var express = require("express");
var app = express();
var opossum = require("opossum");
var axios = require("axios");

function asyncFunctionThatCouldFail() {
  return new Promise((resolve, reject) => {
    // Do something, maybe on the network or a disk
    axios
      .get("https://jsonplaceholder.typicode.com/todos/1/2")
      .then(p => resolve(p))
      .catch(e => reject(e));
  });
}

const options = {
  timeout: 10000, // If our function takes longer than 3 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000 // After 30 seconds, try again.
};
const breaker = opossum(asyncFunctionThatCouldFail, options);

app.route("/test").get((req, res, next) => {
  breaker
    .fire()
    .then(res.send("basıntı"))
    .catch(e => console.log(e.message));
});

breaker.fallback(() => "Sorry, out of service right now");
breaker.on("fallback", result => console.log(result));
breaker.on("success", result => {
  // res.send(result);
  //   result.send("test");
  console.log("result");
});
app.listen(1453);
console.log(`Server running at localhost:${1453}`);
