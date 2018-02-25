(function(root, module_name, factory) {
  if (typeof define === 'function' && define.amd) { // Angular-based AMD Support
    define(['./functions/string', './functions/date', './functions/color', './functions/browser'], factory);
  } else { // Browser Support
    if (!root[module_name]) {
      root[module_name] = factory(xoStrings, xoDates, xoColors, xoBrowser);
    }
  }
}(this, 'xoFactories', function(StringsFactory, DatesFactory, ColorsFactory, BrowserFactory) {
  var app = angular.module('xo.factories', [])
    .factory('xoStrings', StringsFactory)
    .factory('xoDates', DatesFactory)
    .factory('xoColors', ColorsFactory)
    .factory('xoBrowser', BrowserFactory);

}));