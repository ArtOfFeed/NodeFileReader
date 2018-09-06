var config = require('./config');
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var spritesmith = require('gulp.spritesmith');
var del = require('del');

// pages
var pages = config.assets;

// Not all tasks need to use streams
// A gulpfile is just another node program and you can use any package available on npm
gulp.task('clean', ()=> {
  // You can use multiple globbing patterns as you would with `gulp.src`
  return del.sync(['build']);
});

gulp.task('scripts', ()=> {
  // Minify and copy all JavaScript (except vendor scripts)
  // with sourcemaps all the way down
  Object.keys(pages).forEach((page)=> {
    if (pages[page].js) {
      gulp.src(pages[page].js)
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(concat(`${page}.js`))
      .pipe(rename({suffix: '.min'}))
      .pipe(sourcemaps.write('.', {includeContent: false}))
      .pipe(gulp.dest('build/js'));
    }
  });
});

gulp.task('styles', ()=> {
  Object.keys(pages).forEach((page)=> {
    if (pages[page].css) {
      gulp.src(pages[page].css)
      .pipe(sourcemaps.init())
      .pipe(cleanCSS()) // minify
      .pipe(concat(`${page}.css`)) // concat
      .pipe(rename({suffix: '.min'}))
      .pipe(sourcemaps.write('.', {includeContent: false}))
      .pipe(gulp.dest('build/css'));
    }
  });
});

gulp.task('sprite', function() {
    var spriteData = 
        gulp.src('./img/*.*') // input path of pic
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: 'sprite.css',
            }));

    spriteData.img.pipe(gulp.dest('./build/images/')); // output path of pic
    spriteData.css.pipe(gulp.dest('./build/css/')); // output path of styles
});

// Rerun the task when a file changes
gulp.task('watch', ()=> {
  gulp.watch(config.watchers.scripts, ['scripts']);
  gulp.watch(config.watchers.styles, ['styles']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['clean', 'watch', 'scripts', 'styles', 'sprite']);
