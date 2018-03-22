var gulp = require('gulp');
var rjs = require('requirejs');
var minimist = require('minimist');
var gulpif = require('gulp-if');
var htmlreplace = require('gulp-html-replace');
var concat = require('gulp-concat');
var cssimport = require("gulp-cssimport");
var cleancss = require('gulp-clean-css');
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
var sass = require('gulp-sass');
var base64 = require('gulp-base64');
var base64html = require('gulp-img64');
var filter = require('gulp-filter');
var browserSync = require('browser-sync').create();
var mock = require('./mock');
var config = require('./gulp-config');

var cssSrc = ['./dist/styles/*.css', './dist/styles/**/*.css']; // 打包生成的css文件
var jsSrc = './dist/*.js'; // 打包生成的js文件

var knownOptions = {
    string: 'env',
    default: {
        env: process.env.NODE_ENV || 'production'
    }
};
var options = minimist(process.argv.slice(2), knownOptions);

// 将html里的图片转换为base64编码
gulp.task('base64html', function() {
    return gulp.src(['./modules/**/*.html'])
        .pipe(base64html())
        .pipe(gulp.dest('tmp'));
});

//合并html模板命令--gulp template
gulp.task('template', ['base64html'], function() {
    return gulp.src(['./tmp/**/*.html', './components/**/*.html'])
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
        sourcesIndex = gulp.src(config.deploySrc.css, {read: false});
    } else if (options.env == 'development') {
        sourcesIndex = gulp.src(config.devSrc.css, {read: false});
    }
    
    return gulp.src('./index.html')
        .pipe(inject(sourcesIndex, {starttag: '<!-- inject:index:{{ext}} -->', relative: true}))
        .pipe(gulpif(options.env == 'development', htmlreplace({
          replacejs: {
            src: [config.devSrc.js],
            tpl: '<script data-main="%s" src="%s"></script>'
          }
        })))
        .pipe(gulpif(options.env == 'development', rename('index-dev.html')))
        .pipe(gulpif(options.env == 'production', htmlreplace({
          replacejs: {
            src: [config.deploySrc.js],
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
    return gulp.src(config.deploySrc.css, {base: './styles'})
        .pipe(cssimport())
        .pipe(cleancss({compatibility: 'ie8'}))
        .pipe(gulp.dest('dist/styles'));
});

gulp.task('clean', function() {
    del(config.cleanFiles, function(paths) {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });
});

gulp.task('watch', function() {
    browserSync.init({
        server: {
            baseDir: './',
            index: 'index-dev.html',
            port: 3000,
            middleware: mock.data()
        }
    });
    var watcher = gulp.watch(config.watchFiles, {cwd: './'}, ['template']);
    watcher.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        browserSync.reload();
    });
    gulp.watch(config.sassFiles, ['sass']);
});

gulp.task('sass', function() {
    return gulp.src(config.sassFiles)
        .pipe(sass())
        .pipe(base64({
            maxImageSize: 0
        }))
        .pipe(gulp.dest('./styles/css'))
        .pipe(filter('./styles/**/*.css'))
        .pipe(browserSync.reload({stream: true}));
});

//开发构建
gulp.task('default', function(done) {
    if (options.env == 'production') {
        runSequence( //需要说明的是，用gulp.run也可以实现以上所有任务的执行，只是gulp.run是最大限度的并行执行这些任务，而在添加版本号时需要串行执行（顺序执行）这些任务，故使用了runSequence.
            ['clean'],
            //['assetRev'],
            //['base64html'],
            ['template'], 
            ['ngModules'], 
            ['js'],
            ['sass'],
            ['css'], 
            ['revCss'], 
            ['revJs'], 
            ['inject'],
            ['revHtml'],
            done);
    } else if ( options.env == 'development') {
        runSequence(
            ['clean'],
            ['template'],
            ['sass'],
            ['inject'],
            ['watch'],
        done);
    }
});