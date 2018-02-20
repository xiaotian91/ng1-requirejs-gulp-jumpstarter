var Mock = require('mockjs');

exports.data = function() {
	return [{
		route: '/employees/getAll',
		handle: function(req, res, next) {
			res.writeHead(200, {
				'Content-type': 'application/json;charset=UTF-8'
			});
			var rtype = req.method.toLowerCase(); //获取请求类型
			switch (rtype) {
				case 'get':
					var Random = Mock.Random;
					Random.integer();
					Random.string('lower', 4);
					var data = Mock.mock({
						"route": "/employees/getAll",
						"list|10": [{
							'name': '@string()',
							'id': '@integer(0,10)'
						}]
					});
					res.write(JSON.stringify(data));
					res.end();
					break;
				case 'post':
					res.write(JSON.stringify('post'));
					res.end();
					break;
				default:
			}
		}
	}, {
		route: '/employees/delete',
		handle: function(req, res, next) {
			var body = "";
			var result = {
				"route": "/employees/delete"
			};
			res.writeHead(200, {
				'Content-type': 'application/json;charset=UTF-8'
			});
		    req.on('data', function (chunk) { //每当接收到请求体数据，累加到post中
		        body += chunk;  //一定要使用+=，如果body=chunk，因为请求favicon.ico，body会等于{}
		    });

		    //在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
		    req.on('end', function () {
		        // 解析参数
		        body = JSON.parse(body);  //将一个字符串反序列化为一个对象
		        result.data = '向后台传递了参数: id=' + body.id;
		        res.write(JSON.stringify(result));
		        res.end();
		    });
		}
	},
	{
		route: '/getXoMenus',
		handle: function(req, res, next) {
			res.writeHead(200, {
				'Content-type': 'application/json;charset=UTF-8'
			});
			var data = [{
				name: 'xoStrings',
				url: 'utilsDemo.strings'
			}, {
				name: 'xoDates',
				url: 'utilsDemo.dates'
			}, {
				name: 'xoColors',
				url: 'utilsDemo.colors'
			}];
			res.write(JSON.stringify(data));
			res.end();
		}
	}]
}