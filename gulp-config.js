module.exports = (function() {
	return {
		devSrc: [ // 开发时插入的css文件
			'./plugins/**/*.css', 
			//'./components/**/*.css'
		], 
		deploySrc: [ // 打包时需要的集合css文件
			'./styles/index.css'
		],
		watchFiles: [ // 开发时需要监听变化的文件
			'./*.js', 
			'modules/**/*.js', 
			'modules/*.js', 
			'modules/**/*.html', 
			'components/**/*.js',
			'components/*.js',
			'components/**/*.html'
		]
	};
}());
