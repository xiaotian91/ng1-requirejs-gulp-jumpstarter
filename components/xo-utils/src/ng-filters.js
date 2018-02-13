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
    .filter('to_trusted', trustAsHtmlFilter);

  function trustAsHtmlFilter($sce) {
    return function(text) {
      return $sce.trustAsHtml(text);
    };
  }

}));