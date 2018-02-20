var gulp = require('gulp');
var rjs = require('requirejs');
var minimist = require('minimist');
var gulpif = require('gulp-if');
var htmlreplace = require('gulp-html-replace');
var concat = require('gulp-concat');
var cssimport = require("gulp-cssimport");
var assetRev = require('gulp-asset-rev');
var runSequence = require('run-sequence');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var htmlmin = require('gulp-htmlmin');
var ngHtml2js = require('gulp-ng-html2js');
var minifyjs = require('gulp-minify');
var rename = require('gulp-rename');
var inject = require('gulp-inject');
var gzip = require('gulp-gzip');
var del = require('del');
var sass = require('gulp-ruby-sass');
var filter = require('gulp-filter');
var browserSync = require('browser-sync').create();
var mock = require('./mock');
var config = require('./gulp-config');

var cssSrc = './dist/styles/index.css'; // 打包生成的css文件
var jsSrc = './dist/*.js'; // 打包生成的js文件

var knownOptions = {
    string: 'env',
    default: {
        env: process.env.NODE_ENV || 'production'
    }
};
var options = minimist(process.argv.slice(2), knownOptions);


//合并html模板命令--gulp template
gulp.task('template', function() {
    return gulp.src(['modules/**/*.html', 'components/**/*.html'])
        .pipe(htmlmin())
        .pipe(ngHtml2js({
            moduleName: 'template-app'

        }))
        .pipe(concat('template.tpl.js'))
        .pipe(gulp.dest('tmp'));
});

//为css中引入的图片/字体等添加hash编码
gulp.task('assetRev', function() {
    return gulp.src(cssSrc) //该任务针对的文件
        .pipe(assetRev()) //该任务调用的模块
        .pipe(gulp.dest('styles')); //编译后的路径
});

//CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revCss', function() {
    return gulp.src(cssSrc)
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/css'));

});

//js生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revJs', function() {
    return gulp.src(jsSrc)
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/js'));
});

gulp.task('inject', function() {
    
    var sourcesIndex;
    if (options.env == 'production') {
        sourcesIndex = gulp.src(config.deploySrc, {read: false});
    } else if (options.env == 'development') {
        sourcesIndex = gulp.src(config.devSrc, {read: false});
    }
    
    return gulp.src('./index.html')
        .pipe(inject(sourcesIndex, {starttag: '<!-- inject:index:{{ext}} -->', relative: true}))
        .pipe(gulpif(options.env == 'development', htmlreplace({
          replacejs: {
            src: [['main.js', 'https://cdn.bootcss.com/require.js/2.3.5/require.min.js']],
            tpl: '<script data-main="%s" src="%s"></script>'
          }
        })))
        .pipe(gulpif(options.env == 'development', rename('index-dev.html')))
        .pipe(gulpif(options.env == 'production', htmlreplace({
          replacejs: {
            src: [['app.min.js', 'https://cdn.bootcss.com/require.js/2.3.5/require.min.js']],
            tpl: '<script data-main="%s" src="%s"></script>'
          }
        })))
        .pipe(gulpif(options.env == 'development', gulp.dest('./')))
        .pipe(gulpif(options.env == 'production', gulp.dest('./tmp')));

});

//Html替换css、js文件版本
gulp.task('revHtml', function() {
    return gulp.src(['rev/**/*.json', 'tmp/index.html'])
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('ngModules', function(cb) {
    rjs.optimize({
        baseUrl: "./",
        mainConfigFile: "./main.js",
        name: 'main',
        uglify: {
            mangle: false // 不混淆变量名, 否则打包后angular会报错, 暂时没有更好的方案
        },
        out: './tmp/ngModules.js'
    }, function(buildResponse) {
        console.log('build response', buildResponse);
        cb();
    }, cb);
});

gulp.task('js', function() {
    return gulp.src('tmp/*.js')
        .pipe(concat('app.js'))
        .pipe(minifyjs({
            ext: {
                src: '.js',
                min: '.min.js'
            },
            noSource: false,
            mangle: false
        }))
        .pipe(gulp.dest('dist'))
        .pipe(gzip())
        .pipe(gulp.dest('dist'));
});

gulp.task('css', function() {
    return gulp.src('./styles/index.css') // 只需要集合css文件
        .pipe(cssimport())
        .pipe(gulp.dest('dist/styles'));
});

gulp.task('clean', function() {
    del(config.cleanFiles, function(paths) {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    })
});

gulp.task('watch', ['sass'], function() {
    var src = config.watchFiles;
    browserSync.init({
        server: {
            baseDir: './',
            index: 'index-dev.html',
            port: 3000,
            middleware: mock.data()
        }
    });
    var watcher = gulp.watch(src, {cwd: './'}, ['clean', 'template']);
    watcher.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        browserSync.reload();
    });

    gulp.watch('./styles/sass/*.scss', ['sass']);
});

gulp.task('sass', function() {
    return sass(['./styles/sass/**/*.scss'], {sourcemap: true})
        .pipe(gulp.dest('./styles/css'))
        .pipe(filter('./styles/**/*.css'))
        .pipe(browserSync.reload({stream: true}));
});

//开发构建
gulp.task('default', function(done) {
    if (options.env == 'production') {
        condition = false;
        runSequence( //需要说明的是，用gulp.run也可以实现以上所有任务的执行，只是gulp.run是最大限度的并行执行这些任务，而在添加版本号时需要串行执行（顺序执行）这些任务，故使用了runSequence.
            ['clean'],
            //['assetRev'],
            ['template'], 
            ['ngModules'], 
            ['js'], 
            ['css'], 
            ['revCss'], 
            ['revJs'], 
            ['inject'],
            ['revHtml'],
            done);
    } else if ( options.env == 'development') {
        gulp.run(['clean', 'template', 'inject', 'watch']);
    }
});