var gulp = require('gulp');
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var autowatch = require('gulp-autowatch');
var gls = require('gulp-live-server');

// jade
gulp.task('templates', function() {
  var YOUR_LOCALS = {};
 
  gulp.src('./src/jade/**/*.jade')
    .pipe(jade({
      locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('./public/html/'))
});

// Get one .styl file and render 
gulp.task('stylus', function () {
  gulp.src('./src/stylus/main.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./public/css/'));
});

// autoprefixer
gulp.task('autoprefix', function () {
    return gulp.src('./public/css/')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./public/css/'));
});

// compress 
gulp.task('compress', function () {
  gulp.src('./src/stylus/main.styl')
    .pipe(stylus({
      compress: true
    }))
    .pipe(gulp.dest('./public/css/'));
});

//imagemin

gulp.task('imagemin', function () {
    return gulp.src('./public/img/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./public/img'));
});

// key = task name to run 
// value = glob or array of globs to watch 
var paths = {
  stylus: 'src/**/*.styl',
  jade: 'src/**/*.jade',
  js: 'public/**/*.js',
};

gulp.task('watch', function() {
  autowatch(gulp, paths);
});

//Live-server
gulp.task('serve', function() {
    //1. serve with default settings 
    var server = gls.static('public', 3000); //equals to gls.static('public', 3000); 
    server.start();
   //watch
    gulp.watch(['./public/**/*.css', './public/**/*.html'], function () {
        server.notify.apply(server, arguments);
    });
});

gulp.task('default', ['templates', 'stylus', 'autoprefix', 'compress', 'imagemin','watch', 'serve']);