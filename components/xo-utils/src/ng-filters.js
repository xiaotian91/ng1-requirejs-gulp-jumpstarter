(function(root, module_name, factory) {
  if (typeof define === 'function' && define.amd) { // Angular-based AMD Support
    define([], factory);
  } else { // Browser Support
    if (!root[module_name]) {
      root[module_name] = factory();
    }
  }
}(this, 'xoFilters', function() {
  var app = angular.module('xo.filters', [])
    .filter('to_trusted', trustAsHtmlFilter)
    .filter('whichFormat', whichFormatCtrl)
    .filter('replaceStr', replaceStrCtrl)
    .filter('getStrFromBracket', getStrFromBracketCtrl)
    .filter('getRidOf', getRidOfCtrl);

  function trustAsHtmlFilter($sce) {
    return function(text) {
      return $sce.trustAsHtml(text);
    };
  }
    function whichFormatCtrl() {
        return function(input, pattern){
            var p = (typeof pattern == 'string')?eval(pattern):pattern;
            return p.test(input);
        }
    }

    function replaceStrCtrl() {
        return function(input, pattern, replacedStr){
            var rStr = (!replacedStr)?'':replacedStr;
            var p = (typeof pattern == 'string')?eval(pattern):pattern;
            var result = input.replace(p, rStr);
            return result;
        }
    }

    function getStrFromBracketCtrl() {
        return function(input, bracket){
            var lb = bracket[0];
            var rb = bracket[1];
            var result = input.substring(input.indexOf(lb)+1,input.indexOf(rb));
            return result;
        }
    }

    function getRidOfCtrl() {
        return function(input, str){
            var result = "";
            var strArray = input.split(str);
            for (var i = 0; i < strArray.length; i++) {
                result += strArray[i];
            }
            return result;
        }
    }

}));