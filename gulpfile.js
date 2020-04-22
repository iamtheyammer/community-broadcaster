const gulp = require('gulp');
const stylus = require('gulp-stylus');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const nodemon = require('gulp-nodemon')
const del = require('del');
const isDev = process.env.NODE_ENV === 'development'

gulp.task('clean', () => del('./bin/**/*'))

gulp.task('stylus', () => {
  return gulp.src('./src/static/css/**/*.styl')
    .pipe(stylus({ compress: true }))
    .pipe(gulp.dest('./bin/css'))
})

gulp.task('babel', () => {
    return gulp.src('./src/static/js/**/*.js')
        .pipe(babel({
            presets: ['@babel/env', 'minify']
        }))
        .pipe(gulp.dest('./bin/js'))
})

gulp.task('img', () => {
    return gulp.src('./src/static/img/**/*')
        .pipe(gulp.dest('./bin/img'))
})

exports.static = gulp.series([ 'clean', gulp.parallel([ 'stylus', 'babel', 'img']) ]);

gulp.task('watch', (done) => {
    gulp.watch(['./src/static/**/*.*'], gulp.series(['static']));
    nodemon({
        script: './src/app.js',
        watch: ['./src/routes/**/*.js', './src/app.js', './src/models/**/*.js', './src/config/**/*.js'],
        env: process.env,
        done
    })
});
