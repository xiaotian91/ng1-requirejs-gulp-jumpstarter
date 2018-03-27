module.exports = (function() {
	return {
		devSrc: {
			css: [ // 开发时插入的css文件
			'./plugins/**/*.css',
			'./styles/css/theme-byl/theme-byl.css',
			'./components/angular-table-select/styles.css'
			//'./components/**/*.css'
			],
			js: ['main.js', 'https://cdn.bootcss.com/require.js/2.3.5/require.min.js']
		},
		deploySrc: {
			css: [ // 打包时需要的集合css文件
                './styles/index.css',
				'./styles/css/theme-byl/theme-byl.css'
			],
			js: ['app.min.js', 'https://cdn.bootcss.com/require.js/2.3.5/require.min.js']
		},
		watchFiles: [ // 开发时需要监听变化的文件
			'./*.js', 
			'modules/**/*.js', 
			'modules/*.js', 
			'modules/**/*.html', 
			'components/**/*.js',
			'components/*.js',
			'components/**/*.html'
		],
		cleanFiles: ['tmp', 'dist', 'rev', 'styles/css', '.sass-cache', 'npm-debug.log'], // 清除文件
		sassFiles: ['./styles/themes/**/*.scss'] // 需要编译的sass/scss文件
	};
}());
