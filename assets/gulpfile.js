// ============================= REQUIRES =====================================
var gulp = require('gulp'), //Gulp
    concat = require('gulp-concat'), //Creating output file
    connect = require('gulp-connect'), //Server for livereload
    merge = require('merge-stream'), //Merge data
    replace = require('gulp-replace'), //Replacing data
    templateCache = require('gulp-angular-templatecache'), //Creating teplatecache
    typescript = require('gulp-typescript'); //typescript

// ============================== CONFIG ======================================	
var //Typescript otions
    tsOptions = typescript.createProject({
		declarationFiles: false,
		target: 'ES5'
	}),
    //Template options
    tplOptions = {standalone: true},
    //Paths to typescript files
    tsClassesPaths = ['src/typings/**/*.d.ts', 'src/**/*.ts'],
    //Paths to template files
    tsTemplatesPaths = ['src/**/*.html'],
    //Target file name
    targetFileName = 'app.js',
    //Target location
    targetLocationPath = 'dist/scripts';
    
// =============================== TASKS ======================================
/*
    * default - Do nothing
    * build - Build complete frontend
    * dev - Development task, run 'server' and 'watch'.
    * watch - File change listener. Run build on any change.
    * server - Run server with livereload for easy developing
*/
// ============================================================================     
gulp.task('default', function() {
	console.log('\nTask default is empty. See gulpfile.js\n');
});


gulp.task('build', function() {
    //Compile typescript classes
	var ts = gulp.src(tsClassesPaths)
			     .pipe(typescript(tsOptions));

    //Compile typescript templates                    
	var tpl = gulp.src(tsTemplatesPaths)
			      .pipe(templateCache(tplOptions));

    //Merge all files into one and return it
	return merge(ts, tpl)
		.pipe(replace(/var ([a-zA-Z0-0_]*);/, 'var $1 = $1 || {};'))
		.pipe(concat(targetFileName))
		.pipe(gulp.dest(targetLocationPath))
		.pipe(connect.reload());
});    


gulp.task('dev', ['server', 'watch'], function() {

});


gulp.task('watch', function () {
	gulp.watch(tsClassesPaths, ['build']);
	gulp.watch(tsTemplatesPaths, ['build']);
});

gulp.task('server', function() {
	connect.server({
    root: ['dist'],
    livereload: true
  });
});    