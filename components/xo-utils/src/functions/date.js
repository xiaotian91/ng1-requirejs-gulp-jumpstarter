'use strict';;
(function(root, module_name, factory) {
    if (typeof define === 'function' && define.amd) { // AMD Support
        define([], factory);
    } else if (typeof require === 'function' && typeof module !== 'undefined' && typeof exports === 'object') { // CommonJS Support
        module.exports = factory();
    } else { // Browser Support
        if (!root[module_name]) {
            root[module_name] = factory(root);
        }
    }
}(this, 'xoDates', function() {
    function DatesFactory() {

        var factory = {};

        /**************************************时间格式化处理************************************/
        function dateFtt(date, fmt) { //author: meizz   
            var o = {
                "M+": date.getMonth() + 1, //月份   
                "d+": date.getDate(), //日   
                "h+": date.getHours(), //小时   
                "m+": date.getMinutes(), //分   
                "s+": date.getSeconds(), //秒   
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
                "S": date.getMilliseconds() //毫秒   
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }


        factory.dateFormat = function(date, fmt) { // 日期格式化
            return dateFtt(date, fmt);
        };

        factory.getQuarter = function() { // 获取当前季度
            var nowMonth = new Date().getMonth();
            var result = 1;
            if (nowMonth < 3) {
                result = 1;
            }
            if (2 < nowMonth && nowMonth < 6) {
                result = 2;
            }
            if (5 < nowMonth && nowMonth < 9) {
                result = 3;
            }
            if (nowMonth > 8) {
                result = 4;
            }
            return result;
        };

        factory.getMonthDays = function(myMonth) { // 获取某月份天数
            var now = new Date();
            var nowYear = now.getYear();
            var monthStartDate = new Date(nowYear, myMonth, 1);
            var monthEndDate = new Date(nowYear, myMonth + 1, 1);
            var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
            return days;
        };

        factory.getQuarterStartMonth = function() { // 当前季度的开始月
            var nowMonth = new Date().getMonth(); //当前月
            var quarterStartMonth = 0;
            if (nowMonth < 3) {
                quarterStartMonth = 0;
            }
            if (2 < nowMonth && nowMonth < 6) {
                quarterStartMonth = 3;
            }
            if (5 < nowMonth && nowMonth < 9) {
                quarterStartMonth = 6;
            }
            if (nowMonth > 8) {
                quarterStartMonth = 9;
            }
            return quarterStartMonth;

        };

        factory.getWeekStartDate = function(fmt) {  //获得本周的开端日期
            var now = new Date(); //当前日期
            var nowDayOfWeek = now.getDay(); //今天本周的第几天
            var nowDay = now.getDate(); //当前日
            var nowMonth = now.getMonth(); //当前月
            var nowYear = now.getFullYear(); //当前年
            var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
            return this.dateFormat(weekStartDate, fmt);
        };

        factory.getWeekEndDate = function(fmt) { //获得本周的停止日期
            var now = new Date(); //当前日期
            var nowDayOfWeek = now.getDay(); //今天本周的第几天
            var nowDay = now.getDate(); //当前日
            var nowMonth = now.getMonth(); //当前月
            var nowYear = now.getFullYear(); //当前年
            var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
            return this.dateFormat(weekEndDate, fmt);
        };

        factory.getMonthStartDate = function(fmt) { //获得本月的开端日期
            var now = new Date(); //当前日期
            var nowMonth = now.getMonth(); //当前月
            var nowYear = now.getFullYear(); //当前年
            var monthStartDate = new Date(nowYear, nowMonth, 1);
            return this.dateFormat(monthStartDate, fmt);
        };

        factory.getMonthEndDate = function(fmt) { //获得本月的停止日期
            var now = new Date(); //当前日期
            var nowMonth = now.getMonth(); //当前月
            var nowYear = now.getFullYear(); //当前年
            var monthEndDate = new Date(nowYear, nowMonth, this.getMonthDays(nowMonth));
            return this.dateFormat(monthEndDate, fmt);
        };

        factory.getLastMonthStartDate = function(fmt) { //获得上月开端日期
            var now = new Date(); //当前日期
            var nowYear = now.getFullYear(); //当前年

            var lastMonthDate = new Date(); //上月日期
            lastMonthDate.setDate(1);
            lastMonthDate.setMonth(lastMonthDate.getMonth()-1);
            var lastMonth = lastMonthDate.getMonth();
            var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
            return this.dateFormat(lastMonthStartDate, fmt);
        };

        
        factory.getLastMonthEndDate = function(fmt) { //获得上月停止日期
            var now = new Date(); //当前日期
            var nowYear = now.getFullYear(); //当前年

            var lastMonthDate = new Date(); //上月日期
            lastMonthDate.setDate(1);
            lastMonthDate.setMonth(lastMonthDate.getMonth()-1);
            var lastMonth = lastMonthDate.getMonth();
            var lastMonthEndDate = new Date(nowYear, lastMonth, this.getMonthDays(lastMonth));
            return this.dateFormat(lastMonthEndDate, fmt);
        };

        
        factory.getQuarterStartDate = function(fmt) { //获得本季度的开端日期
            var now = new Date(); //当前日期
            var nowYear = now.getFullYear(); //当前年
            var quarterStartDate = new Date(nowYear, this.getQuarterStartMonth(), 1);
            return this.dateFormat(quarterStartDate, fmt);
        };

        
        factory.getQuarterEndDate = function(fmt) { //或的本季度的停止日期
            var now = new Date(); //当前日期
            var nowYear = now.getFullYear(); //当前年
            var quarterEndMonth = this.getQuarterStartMonth() + 2;
            var quarterStartDate = new Date(nowYear, quarterEndMonth, this.getMonthDays(quarterEndMonth));
            return this.dateFormat(quarterStartDate, fmt);
        };

        return factory;
    }

    return DatesFactory;
}));