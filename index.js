var express = require("express");
var app = express();
var opossum = require("opossum");
var axios = require("axios");

function asyncFunctionThatCouldFail(count = 3, timeOut = 3000) {
  return new Promise((resolve, reject) => {
    function run() {
      axios.get("https://jsonplaceholder.typicode.com/todos/1/2").then(
        p => {
          console.log("p", p.data);
          resolve(p.data);
        },
        p => {
          if (count >= 1) {
            console.log(count, " deneme kaldı.");
            count--;
            setTimeout(run, timeOut);
          } else {
            reject(new Error(p));
          }
        }
      );
    }
    run();
  });
}

app.route("/test2").get(async (req, res, next) => {
  try {
    const data = await asyncFunctionThatCouldFail(2, 500);
    console.log(data);
    res.send(data);
  } catch (error) {
    console.log("Hata:", error.stack);
    res.send(404, error.message);
  }
});

app.listen(1453);
console.log(`Server running at localhost:${1453}`);
