'use strict';
var gulp = require('gulp'),
    minify = require('gulp-minify-css'),
    uglify = require('gulp-uglify');
//CSS
gulp.task('cpcss', function () {
    return gulp.src('./css/*.css')
        .pipe(minify())
        .pipe(gulp.dest('./dist/css'));
});
gulp.task('cpcsshome', function () {
    return gulp.src('./home/home.css')
        .pipe(minify())
        .pipe(gulp.dest('./dist/home'));
});
gulp.task('cpcssskill', function () {
    return gulp.src('./skill/skill.css')
        .pipe(minify())
        .pipe(gulp.dest('./dist/skill'));
});
gulp.task('cpcsdocument', function () {
    return gulp.src('./document/document.css')
        .pipe(minify())
        .pipe(gulp.dest('./dist/document'));
});
gulp.task('cpcsscommunion', function () {
    return gulp.src('./communion/communion.css')
        .pipe(minify())
        .pipe(gulp.dest('./dist/communion'));
});
gulp.task('cpcssabout', function () {
    return gulp.src('./about/about.css')
        .pipe(minify())
        .pipe(gulp.dest('./dist/about'));
});
gulp.task('cpcssdemo', function () {
    return gulp.src('./demo/**/*.css', {
            base: '.'
        })
        .pipe(minify())
        .pipe(gulp.dest('dist'));
});

//js
gulp.task('cpjs', function () {
    gulp.src('js/*.js')
        .pipe(uglify()) //压缩
        .pipe(gulp.dest('dist/js')); //输出
});
gulp.task('cpjshome', function () {
    gulp.src('home/home.js')
        .pipe(uglify()) //压缩
        .pipe(gulp.dest('dist/home')); //输出
});
gulp.task('cpjsskill', function () {
    gulp.src('skill/skill.js')
        .pipe(uglify()) //压缩
        .pipe(gulp.dest('dist/skill')); //输出
});
gulp.task('cpjsdocument', function () {
    gulp.src('document/document.js')
        .pipe(uglify()) //压缩
        .pipe(gulp.dest('dist/document')); //输出
});
gulp.task('cpjscommunion', function () {
    gulp.src('communion/communion.js')
        .pipe(uglify()) //压缩
        .pipe(gulp.dest('dist/communion')); //输出
});
gulp.task('cpjsabout', function () {
    gulp.src('about/about.js')
        .pipe(uglify()) //压缩
        .pipe(gulp.dest('dist/about')); //输出
});
gulp.task('cpjsdemo', function () {
    gulp.src('./demo/**/*.js', {
            base: '.'
        })
        .pipe(uglify()) //压缩
        .pipe(gulp.dest('dist')); //输出
});
//html
gulp.task('copyhtml', function () {
    return gulp.src('./**/*.html', {
            base: '.'
        })
        .pipe(gulp.dest('dist'))
});

gulp.task('all', ['cpcss', 'cpcsshome', 'cpcssskill', 'cpcsdocument', 'cpcsscommunion', 'cpcssabout','cpcssdemo', 'cpjs', 'cpjshome', 'cpjsskill', 'cpjsdocument', 'cpjscommunion', 'cpjsabout','cpjsdemo','copyhtml']);