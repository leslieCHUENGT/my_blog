function memorize(f) {
    var cache = {};
    return function(){
        var key = arguments.length + Array.prototype.join.call(arguments, ",");
        if (key in cache) {
            return cache[key]
        }
        else return cache[key] = f.apply(this, arguments)
    }
}

var add = function(a, b, c) {
    return a + b + c
  }
  
  var memoizedAdd = memorize(add)
  
  console.time('use memorize')
  for(var i = 0; i < 100000; i++) {
      memoizedAdd(1, 2, 3)
  }
  console.timeEnd('use memorize')
  
  console.time('not use memorize')
  for(var i = 0; i < 100000; i++) {
      add(1, 2, 3)
  }
  console.timeEnd('not use memorize')

