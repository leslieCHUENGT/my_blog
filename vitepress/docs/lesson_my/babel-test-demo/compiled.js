"use strict";

require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.promise.js");//自动引入

//工程化？把stylus es6+ tj 全部引入项目之中使用
var a = 1;
var b = 2;
var c = a + b;
var func = function func() {
  return a + b + c;
};
new Promise(function (resolve, reject) {
  resolve(true);
}); //
