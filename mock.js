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
					"list|5":[{
                        'name':'@string()',
                        'id': '@integer(0,10)'
                    }]
				});
				res.write(JSON.stringify(data));
				res.end();
			}
		}
	]
}