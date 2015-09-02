var path = require('path'),
		util = require('util'),
		del = require('del'),
		gulp = require('gulp'),
		exec = require('exec-wait'),
		Promise = require('bluebird'),
		$ = require('gulp-load-plugins')(),
		runSequence = require('run-sequence'),
        gulpNSP = require('gulp-nsp'),
        mocha = require('gulp-mocha'),
        install = require('gulp-install'),
        lambda = require('gulp-awslambda'),
		zip    = require('gulp-zip'),
		lambdaenv = require('./lambdaenv.json'),
		package = require('./package.json');


/* Configurations. Note that most of the configuration is stored in
the task context. These are mainly for repeating configuration items */

var buildname = package.name + '_' + package.version;
	buildname = buildname.replace(/[^A-Za-z0-9_-]/g,'_');

/* Bump version number for package.json */
// TODO Provide means for appending a patch id based on git commit id or md5 hash
gulp.task('bump', function() {
	// Fetch whether we're bumping major, minor or patch; default to minor
	var env = $.util.env,
			type = (env.major) ? 'major' : (env.patch) ? 'patch' : 'minor';

	gulp.src(['./package.json'])
		.pipe($.bump({ type: type }))
		.pipe(gulp.dest('./node_modules'));
});

gulp.task('build-cleantmp', function() {
	return del('temp');
});

gulp.task('build-copysrcfiles', function() {
	return gulp.src(['src/*.js'])
	.pipe(gulp.dest('temp'))
});

gulp.task('build-copynodemodules', function() {
	return gulp.src('./package.json')
		.pipe(gulp.dest('temp'))
		.pipe(install({production: true}));
//	return gulp.src(['node_modules/**/*'])
//	.pipe(gulp.dest('temp/node_modules'))
});

gulp.task('build-ziptemp', function() {
	return gulp.src('temp/**/*')
	.pipe(zip(buildname + '.zip'))
	.pipe(gulp.dest('.'));
});

gulp.task('buildzip', function() {
	return runSequence('build-copysrcfiles', 'build-copynodemodules', 'build-ziptemp');
});

gulp.task('deployzip', function() {
	var lambdaparams = {
		'FunctionName' : buildname,
		'Description' : package.description,
		'Role' : lambdaenv.Role
	} 
	var lambdaoptions = {
		'region': lambdaenv.Region
	};
	return gulp.src(buildname + '.zip')
		   .pipe(lambda(lambdaparams, lambdaoptions));
});

gulp.task('deploy', function() {
	return runSequence('build-copysrcfiles', 'build-copynodemodules', 'build-ziptemp', 'deployzip', 'build-cleantmp');
});

gulp.task('test-run', function() {
	process.env.NODE_ENV = 'test';

	$.util.log('Running tests (mocha)');
	gulp.src(['tests/test*.js'])
		.pipe(mocha());
});

//To check your package.json
gulp.task('test-nsp', function (cb) {
	gulpNSP('./package.json', cb);
});

gulp.task('clean', function(cb) {
  return del([
    'dist',
    // here we use a globbing pattern to match everything inside the `mobile` folder
    'temp'
  ], cb);
});

// NOTE: Running also build to avoid running against old code
gulp.task('test', function() {
	return runSequence('check', 'test-nsp');
});

// NOTE: Running also build to avoid running against old code
gulp.task('check', function() {
	return runSequence('test-run');
});

gulp.task('default', ['build', 'test']);
