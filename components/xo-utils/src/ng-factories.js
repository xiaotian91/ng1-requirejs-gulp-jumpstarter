(function(root, module_name, factory) {
  if (typeof define === 'function' && define.amd) { // Angular-based AMD Support
    define(['./functions/string', './functions/date', './functions/color'], factory);
  } else { // Browser Support
    if (!root[module_name]) {
      root[module_name] = factory(xoStrings, xoDates, xoColors);
    }
  }
}(this, 'xoFactories', function(StringsFactory, DatesFactory, ColorsFactory) {
  var app = angular.module('xo.factories', [])
    .factory('xoStrings', StringsFactory)
    .factory('xoDates', DatesFactory)
    .factory('xoColors', ColorsFactory);

}));