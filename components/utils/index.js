'use strict';
(function(root, module_name, factory) {
  if (typeof define === 'function' && define.amd) { // Angular-based AMD Support
    define(['./functions/string'], factory);
  } else { // Browser Support
    if (!root[module_name]) {
      root[module_name] = factory(xoStrings);
    }
  }
}(this, 'xoUtils', function(StringsFactory) {
  var app = angular.module('xo.utils', [])
    .factory('stringsUtils', StringsFactory)
    .directive('onFinishRender', onFinishRenderCtrl)
    .directive('mouseOverLeave', mouseOverLeaveCtrl)
    .directive('xoInputCurrency', xoInputCurrencyCtrl)
    .filter('to_trusted', trustAsHtmlFilter);

  function onFinishRenderCtrl($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        if (scope.$last === true) {
          $timeout(function() {
            scope.$emit('ngRepeatFinished');
          });
        }
      }
    };
  }

  function mouseOverLeaveCtrl() {
    return {
      restrict: 'EA',
      scope: {
        hover: "="
      },
      link: function(scope, elem, attr) {
        elem.bind('mouseover', function() {
          elem.css("cursor", "pointer");
          scope.$apply(function() {
            scope.hover = true;
          });
        });
        elem.bind('mouseleave', function() {
          scope.$apply(function() {
            scope.hover = false;
          });
        });
      }
    };
  }

  function xoInputCurrencyCtrl($filter, $locale, $parse) {
        //#region helper methods
        function getCaretPosition(inputField) {
            // Initialize
            var position = 0;
            // IE Support
            if (document.selection) {
                inputField.focus();
                // To get cursor position, get empty selection range
                var emptySelection = document.selection.createRange();
                // Move selection start to 0 position
                emptySelection.moveStart('character', -inputField.value.length);
                // The caret position is selection length
                position = emptySelection.text.length;
            } else if (inputField.selectionStart || inputField.selectionStart == 0) {
                position = inputField.selectionStart;
            }
            return position;
        }

        function setCaretPosition(inputElement, position) {
            if (inputElement.createTextRange) {
                var range = inputElement.createTextRange();
                range.move('character', position);
                range.select();
            } else {
                if (inputElement.selectionStart) {
                    inputElement.focus();
                    inputElement.setSelectionRange(position, position);
                } else {
                    inputElement.focus();
                }
            }
        }

        function countNonNumericChars(value) {
            return (value.match(/[^a-z0-9]/gi) || []).length;
        }

        function format(value) {
            var array = [];
            array = value.split(".");
            var re = /(-?\d+)(\d{3})/;
            while (re.test(array[0])) {
                array[0] = array[0].replace(re, "$1,$2")
            }
            var returnV = array[0];
            for (var i = 1; i < array.length; i++) {
                returnV += "." + array[i];
            }
            return returnV;
        }

        return {
            require: 'ngModel',
            restrict: "A",
            link: function(scope, element, attrs, ngModel) {
                var fractionSize = parseInt(attrs['fractionSize']) || 0;
                var numberFilter = $filter('number');
                ngModel.$parsers.push(function(value) {
                    var isValid = isNaN(value) == false;
                    var caretPosition = getCaretPosition(element[0]), // 当前光标位置
                        nonNumericCount = countNonNumericChars(value); // 格式化前逗号数量 
                    var trimmedValue = value.trim().replace(/[^0-9.]/g, ""); // 只允许输入数字和小数点
                    //If numericValue contains more decimal places than is allowed by fractionSize, then numberFilter would round the value up
                    //Thus 123.109 would become 123.11
                    //We do not want that, therefore I strip the extra decimal numbers
                    var separator = $locale.NUMBER_FORMATS.DECIMAL_SEP;
                    var arr = trimmedValue.split(separator);
                    var decimalPlaces = arr[1];
                    if (decimalPlaces != null && decimalPlaces.length > fractionSize) {
                        //Trim extra decimal places
                        decimalPlaces = decimalPlaces.substring(0, fractionSize);
                        trimmedValue = arr[0] + separator + decimalPlaces;
                    }
                    var numericValue = parseFloat(trimmedValue);
                    var newViewValue = format(trimmedValue); // 自定义的千位分隔
                    //var newViewValue = numberFilter(numericValue, fractionSize); //angular定义的千位分隔
                    element[0].value = newViewValue; // 给用户显示有逗号的格式

                    var newNonNumbericCount = countNonNumericChars(newViewValue); // 格式化后逗号数量
                    var diff = newNonNumbericCount - nonNumericCount;
                    var newCaretPosition = caretPosition + diff; // 去掉逗号数量后正确的光标位置
                    setCaretPosition(element[0], newCaretPosition);
                    return trimmedValue; // 返回给ng-model格式化前的数据
                });
            }
        };
    }

  function trustAsHtmlFilter($sce) {
    return function(text) {
      return $sce.trustAsHtml(text);
    };
  }

}));