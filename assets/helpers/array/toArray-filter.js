
var app = angular.module('flowChart');

app.filter('toArray', function(){

 /**
  * Split string into an array.
  * Each element in the array will be trimmed.
  *
  * @param {String} str
  * @param {String} delimiter
  * @return {Array}
  */

  return function(str, delimiter){
    if (typeof str == 'undefined') return null;
    delimiter = delimiter || ',';
    var arr = str.split(delimiter);
    arr = arr.map(function(item){
      item = item
        .replace(/^[\s]*/, '')
        .replace(/[\s]*$/, '');
      return item;
    });
    return arr.length ? arr : null;
  }

});

