////////////////////////
//
// Axis Gulpfile
// Author: Gideon Heilbron
// Site: https://gideonheilbron.nl
//
////////////////////////

var 	gulp = require('gulp'),
			del = require('del'),
			gutil = require('gulp-util'),
			gulpLoadPlugins = require('gulp-load-plugins');

// Load plugins
var plugins = gulpLoadPlugins({
	pattern: [
		'gulp-*',
		'gulp.*',
		'browser-sync',
		'main-bower-files'
	]
});

// Source and destination paths for tasks
var path = {
	src:   'source',
	dest:  'public',
	npm:   'node_modules',
	bower: 'bower_components'
};

/**
	* $ gulp
	*
	* - compile, autoprefix, and minify Sass
	* - bundle Javascript
	* - optimise images (including SVGs)
	* - create custom Modernizr build
	*/
gulp.task('default', [
	'images',
	'styles',
	'scripts',
	'classes',
	'templates'
]);

/**
	* $ gulp watch:tasks
	*
	* - watch for updates to scripts, styles, and Gulpfile
	* - process files appropriately on change
	*/
gulp.task('watch:tasks', ['default'], function(){

	// Gulpfile.js
	gulp.watch('Gulpfile.js', [
		'jshint'
	]);

	// Scripts
	gulp.watch(path.src + '/scripts/**/*.js', [
		'js-watch'
	]);

	// Styles
	gulp.watch(path.src + '/styles/**/*.scss', [
		'styles'
	]);

	// Images
	gulp.watch(path.src + '/images/{,*/}*.{gif,jpg,png,svg}', [
		'images'
	]);

	// Templates
	gulp.watch(path.src + '/**/*.html', [
		'templates'
	]);

});

/**
	* $ gulp watch
	*
	* - calls 'gulp watch:tasks'
	*/
gulp.task('watch', ['watch:tasks'], function(done) {
	// Do a full page reload when any templates are updated:
	plugins.browserSync.init({
		server: {
			baseDir: "public",
			index: "index.html"
		}
	});

	gulp.watch([
		'./public/*.html',
	])
	.on('change', plugins.browserSync.reload);
	done();
});

/**
	* $ gulp images
	*
	* - Optimise images (new and updated images only)
	*/
gulp.task('images', function(){
	var src  = path.src  + '/images/**/*.{gif,jpg,png,svg}';
	var dest = path.dest + '/images';

	return gulp.src(src)
		// Only process new / updated images:
		.pipe(plugins.newer(src))
		// Minify images:
		.pipe(plugins.imagemin([
			plugins.imagemin.gifsicle({interlaced: true}),
			plugins.imagemin.jpegtran({progressive: true}),
			plugins.imagemin.optipng({optimizationLevel: 5}),
			plugins.imagemin.svgo({plugins: [{
				removeDoctype: false, // Keeps IE happy
				convertPathData: true,
				moveGroupAttrsToElems: true,
				cleanupIDs: false
			}]})
		]))
		.pipe(gulp.dest(dest))
		.pipe(plugins.size())
		.on('error', gutil.log);
});

gulp.task('sass-image', function() {
	return gulp.src(path.dest + '/images/**/*.+(jpeg|jpg|png|gif|svg)')
		.pipe(plugins.sassImage({
			targetFile: '_imagehelper.scss',
			images_path: path.dest + '/images',
			css_path: path.dest + '/styles'
		}))
		.pipe(gulp.dest(path.src + '/styles/generated'))
		.pipe(plugins.size());
});

/**
	* $ gulp styles
	*
	* - Compile Sass --> CSS, autoprefix, and minify
	*/
gulp.task('styles', function(){
	return gulp.src(path.src + '/styles/application.scss')
		.pipe(plugins.plumber())
		.pipe(plugins.sassGlob())
		.pipe(plugins.sourcemaps.init())
		// Compile Sass:
		.pipe(plugins.sass.sync({
				outputStyle: 'expanded',
				includePaths: [
					path.npm + '/node.normalize.scss'
				]
			})
			.on('error', gutil.log)
		)
		// Autoprefix:
		.pipe(plugins.autoprefixer({
			browsers: [
				'last 2 versions',
				'ie 10'
			]
		}))
		.pipe(plugins.sourcemaps.write('.', {
					includeContent: false,
		}))
		// Report file size:
		.pipe(plugins.size({ showFiles: true }))
		.pipe(gulp.dest(path.dest + '/styles'))
		.pipe(plugins.browserSync.stream());
});

gulp.task('styles-minify', ['styles'], function(){
	return gulp.src(path.dest + '/styles/application.css')
		.pipe(plugins.cssmin())
		.pipe(plugins.rename({suffix: '.min'}))
		.pipe(plugins.size({ showFiles: true }))
		.pipe(gulp.dest(path.dest + '/styles'))
		.pipe(plugins.browserSync.stream())
		.on('error', gutil.log);
});

/**
	* $ gulp scripts
	*
	*/

gulp.task('scripts', function(){
	return gulp.src(path.src + '/scripts/application.js')
		.pipe(plugins.concat('application.js'))
		.pipe(gulp.dest(path.dest + '/scripts'))
		.pipe(plugins.size({ showFiles: true }))
		.on('error', gutil.log);
});

gulp.task('classes', function(){
	return gulp.src(path.src + '/scripts/classes/*.js')
		.pipe(plugins.concat('classes.js'))
		.pipe(gulp.dest(path.dest + '/scripts'))
		.pipe(plugins.size({ showFiles: true }))
		.on('error', gutil.log);
});

gulp.task('js-watch', ['scripts', 'classes'], function(done) {
	plugins.browserSync.reload();
	done();
});

gulp.task('js-minify', ['scripts', 'classes'], function(){
	return gulp.src([
			path.dest + '/scripts/application.js',
			path.dest + '/scripts/classes.js',
		])
		.pipe(plugins.concat('application.min.js'))
		.pipe(plugins.uglify())
		.pipe(gulp.dest(path.dest + '/scripts'))
		.pipe(plugins.size({ showFiles: true }))
		.on('error', gutil.log);
});


/*
	* $ gulp jshint
	* Lint Javascript files and gulpfile.js
*/

gulp.task('jshint', function(){
	var src  = [
		'Gulpfile.js',
		path.src  + '/scripts/{,*/}*.js'
	];

	gulp.src(src)
		.pipe(plugins.jshint())
		.pipe(plugins.jshint.reporter(require('jshint-stylish')));
});


/*
	* $ gulp modernizr
	* Create a custom Modernizr build based on tests used
	* in bundle.js and application.css
*/

gulp.task('modernizr', ['styles', 'scripts', 'classes'], function(){
	var src = [
		path.dest + '/scripts/application.js',
		path.dest + '/styles/application.css'
	];

	gulp.src(src)
		.pipe(plugins.modernizr('modernizr.min.js', {
			options: [
				'setClasses'
			],
			classPrefix: 'supports-'
		}))
		.pipe(plugins.uglify())
		.pipe(gulp.dest(path.dest + '/scripts'))
		.pipe(plugins.size({ showFiles: true }))
		.on('error', gutil.log);
});


/*
	* $ gulp htmlmin
	* Minify HTML files
*/

gulp.task('templates', function(){
	var src  = path.src  + '/**/*.html';
	var dest = path.dest;

	return gulp.src(src)
		.pipe(plugins.newer(src))
		.pipe(plugins.htmlmin({
			collapseWhitespace: true
		}))
		.pipe(gulp.dest(dest))
		.pipe(plugins.size())
		.on('error', gutil.log);
});
