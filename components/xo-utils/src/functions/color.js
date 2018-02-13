/*
 * color.js
 * 功能模块
 * 将RGB值转换为16进制Hex值/将16进制Hex值转换为RGB值
 *
 * Xiaotian Li - http://xiaotian91.github.io/blog/
 */

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

;(function(root, module_name, factory) {
  if (typeof define === 'function' && define['amd']) { // AMD Support
    define([], factory);
  } else if (typeof require === 'function' && typeof module !== 'undefined' && typeof exports === 'object') { // CommonJS Support
    module.exports = factory();
  } else { // Browser Support
    if (!root[module_name]) {
      root[module_name] = factory(root);
    }
  }
}(this, 'xoColors', function() {

  function ColorsFactory() {
    var factory = {};

    /* Color Rgb Hex Conversion */
    factory.rgbHexConversion = function() {
      var args = arguments;
      var Color = function() {
        if (!(this instanceof Color)) {
          var color = new Color();
          color._init.apply(color, args);
          return color;
        }
        if (args.length) {
          this._init.apply(this, args);
        }
      };
      //设置get, set, toString方法
      var methods = ["red", "green", "blue", "colorValue"];
      var defineSetGetMethod = function(fn, methods) {
        for (var i = 0; i < methods.length; i++) {
          var methodName = methods[i].charAt(0).toLocaleUpperCase() + methods[i].substring(1); // -> 'Red','Green'...
          fn.prototype['set' + methodName] = new Function("value", "this." + methods[i] + "= value;");
          fn.prototype['get' + methodName] = new Function("return this." + methods[i] + ";");
          fn.prototype['toString'] = new Function('return "rgb("+this.red+","+this.green+","+this.blue+")";');
        }
      };
      defineSetGetMethod(Color, methods);

      //扩展函数的实例方法
      var extend = function(fn, options) {
        for (var prop in options) {
          fn.prototype[prop] = options[prop];
        }
      };
      extend(Color, {
        _init: function() {
          if (arguments.length == 3) { // rgb转hex
            this.red = arguments[0];
            this.green = arguments[1];
            this.blue = arguments[2];
            this.getColorValue();
          } else { // hex转rgb
            var colorValue = arguments[0].replace(/^\#{1}/, "");
            if (colorValue.length == 3) {
              colorValue = colorValue.replace(/(.)/g, '$1$1');
            }
            this.red = parseInt('0x' + colorValue.substring(0, 2), 16);
            this.green = parseInt('0x' + colorValue.substring(2, 4), 16);
            this.blue = parseInt('0x' + colorValue.substring(4), 16);
            this.colorValue = "#" + colorValue;
          }
        },
        getColorValue: function() {
          if (this.colorValue) {
            return this.colorValue;
          }
          var hR = this.red.toString(16);
          var hG = this.green.toString(16);
          var hB = this.blue.toString(16);
          return this.colorValue = "#" + (this.red < 16 ? ("0" + hR) : hR) + (this.green < 16 ? ("0" + hG) : hG) + (this.blue < 16 ? ("0" + hB) : hB);
        }
      });
      return Color();
    };

    return factory;

  }

  return ColorsFactory;
}));