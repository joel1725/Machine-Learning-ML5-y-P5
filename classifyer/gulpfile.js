const gulp = require('gulp')
const bs = require('browser-sync').create()
const auto = require('gulp-autoprefixer')
const sass = require('gulp-sass')
const js = require('gulp-minify')
const pug = require('gulp-pug')

gulp.task('compCSS', function (){
    gulp.src('./css/*.scss')
        .pipe(auto({
            version: ['last 4 browsers']
        }))
        .pipe(sass({
            outputStyle: '',
        }))
        .pipe(gulp.dest('./css'))
})

gulp.task('compJS', function (){
    gulp.src('./js/main.js')
        .pipe(js())
        .pipe(gulp.dest('./js'))
})

gulp.task('compHTML', function (){
    gulp.src('./pug/index.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('./'))
})
    
gulp.task('default',function(){
    bs.init({
        server: './'
    });
    gulp.watch('./css/*.scss',['compCSS'])
    gulp.watch('./js/main.js',['compJS'])
    gulp.watch('./pug/**/*.pug',['compHTML'])
    gulp.watch('./css/*.scss').on('change', bs.reload)
    gulp.watch('./js/*.js').on('change', bs.reload)
    gulp.watch('./*.html').on('change', bs.reload)
})


