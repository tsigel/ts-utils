///<reference path="typings/tsd.d.ts"/>

import gulp = require('gulp');
import uglify = require('gulp-uglify');
import childProcess = require('child_process');
import rename = require('gulp-rename');
import fs = require('fs');

gulp.task('minify', () => {
    
    return gulp.src('./dist/utils.js')
        .pipe(uglify())
        .pipe(rename('utils.min.js'))
        .pipe(gulp.dest('./dist/'));
    
});

gulp.task('addCoverageIgnore', () => {
    
    let utils: string = fs.readFileSync('./dist/utils.js', 'utf8');
    
    utils = utils.replace(/(\((\w+)?(\s\|\|)\s\(\w+\s=\s\{\}\)\))/g, '/* istanbul ignore next */$1');
    utils = utils.replace(/(\(\w+\s=\s\w+\.\w+\s\|\|\s\(\w+\.\w+\s\=\s\{\}\)\))/g, '/* istanbul ignore next */$1');
    
    fs.writeFileSync('./dist/utils.coverage.js', utils);
    
});
