var Mock = require('mockjs');

exports.data = function() {
	return [
		{
			route: '/employees/getAll',
			handle: function(req, res, next) {
				res.writeHead(200, {
					'Content-type': 'application/json;charset=UTF-8'
				});
				var Random = Mock.Random;
				Random.integer();
				Random.string('lower', 4);
				var data = Mock.mock({
					"route": "/employees/getAll",
					"list|3":[{
                        'name':'@string()',
                        'id': '@integer(0,10)'
                    }]
				});
				res.write(JSON.stringify(data));
				res.end();
			}
		},
		{
			route: '/getXoMenus',
			handle: function(req, res, next) {
				res.writeHead(200, {
					'Content-type': 'application/json;charset=UTF-8'
				});
				var data = [
		            {
		                name: 'xoStrings',
		                url: 'utilsDemo.strings'
		            },
		            {
		                name: 'xoDates',
		                url: 'utilsDemo.dates'
		            },
		            {
		                name: 'xoColors',
		                url: 'utilsDemo.colors'
		            }
		        ];
				res.write(JSON.stringify(data));
				res.end();
			}
		}
	]
}