const gulp = require("gulp");
const webpack = require("webpack-stream");
const sass = require('gulp-sass')(require('sass'));

const pathes = {
  scss: {
    src: "./src/scss/*.scss",
    dest: "./dist/css",
  },
  img: {
    src: "./src/img/*",
    dest: "./dist/img",
  },
  js: {
    src: "./src/js/*.js",
    dest: "./dist/js",
  },
  html: {
    src: "./src/*.html",
    dest: "./dist",
  },
};

gulp.task("js", function () {
  return gulp
    .src(pathes.js.src)
    .pipe(
      webpack({
        mode: 'development',
        output: {
          filename: 'app.js',
        },
        module: {
          rules: [
            {
              test: /\.css$/,
              exclude: /node_modules/,
              use: {
                loader: "babel-loader",
                options: {
                  presets: ["@babel/preset-env"],
                },
              },
            },
          ],
        },
      })
    )
    .pipe(gulp.dest(pathes.js.dest));
});

gulp.task('scss', function() {
  return gulp
    .src(pathes.scss.src)
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest(pathes.scss.dest))
})

gulp.task('html', function() {
  return gulp
    .src(pathes.html.src)
    .pipe(gulp.dest(pathes.html.dest))
})

gulp.task('img', function() {
  return gulp
    .src(pathes.img.src)
    .pipe(gulp.dest(pathes.img.dest))
})

gulp.task('watch', function() {
  gulp.watch(pathes.js.src, gulp.parallel('js'))
  gulp.watch(pathes.scss.src, gulp.parallel('scss'))
  gulp.watch(pathes.html.src, gulp.parallel('html'))
})

gulp.task('default', gulp.parallel('watch', 'js', 'scss', 'img', 'html'))