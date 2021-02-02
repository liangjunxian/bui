const gulp = require('gulp');
const connect = require('gulp-connect');
const concat = require('gulp-concat');
const copy = require('gulp-copy');
const less = require('gulp-less');
const watch = require('gulp-watch');
const notify = require('gulp-notify');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const cleanCss = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');

const lessFile = 'bin/less/bui.less';
const lessOutFile =  'dist/css';
const jsFile = 'bin/components/*.js';
const jsOutFile = 'dist/js';

gulp.task('compLess',function(done){
  gulp.src(lessFile)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(rename({suffix:'-components'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(lessOutFile))
    .pipe(rename({suffix:'.min'}))
    .pipe(cleanCss())
    .pipe(gulp.dest(lessOutFile))
    .pipe(notify({ message: 'css编译完成' }));
    done();
});

gulp.task('compJs',function(done){
  gulp.src(jsFile)
    .pipe(concat('bui-components.js'))
    .pipe(gulp.dest(jsOutFile))
    .pipe(rename({suffix:'.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(jsOutFile))
    .pipe(notify({ message: 'js编译完成' }));
    done();
});

gulp.task('examplesLess',function(done){
  gulp.src('examples/less/examples.less')
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('examples/css'))
    .pipe(rename({suffix:'.min'}))
    .pipe(cleanCss())
    .pipe(gulp.dest('examples/css'))
    .pipe(notify({ message: 'css编译完成' }));
    done();
});

gulp.task('serve', function(done){
	connect.server({
		port: 8700,
		host: '0.0.0.0',
		livereload: true
	});
  done();
});
//启动服务器

gulp.task('html', function(){
	gulp.src(['*.html','**/*.html'])
		.pipe(connect.reload());
});
//监测html页面变换并刷新页面


gulp.task('watch', function(){
  gulp.watch('bin/less/*.less', gulp.series('compLess', 'html'));
	gulp.watch('bin/components/*.js', gulp.series('compJs', 'html'));
	gulp.watch('examples/less/*.less', gulp.series('examplesLess', 'html'));
  gulp.watch(['*.html','**/*.js'],gulp.series('html'));
});
//全局监测less及html变化实时刷新


gulp.task('default', gulp.parallel('serve','watch'));