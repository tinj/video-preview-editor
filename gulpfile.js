var gulp             = require('gulp');
// var jade             = require('gulp-jade');
// var karma            = require('gulp-karma');
var plumber          = require('gulp-plumber');
var rename           = require('gulp-rename');
var clean            = require('gulp-rimraf');
var uglify           = require('gulp-uglify');
var util             = require('gulp-util');
var watch            = require('gulp-watch');
var _                = require('lodash');
var path             = require('path');
var webpack          = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
// var livereload       = require('gulp-livereload');
// var less             = require('gulp-less');
var watch            = require('gulp-watch');

var config = {
    // consts: {
    //     defaults: {
    //     }
    // },
    clean: {
        defaults: {
            input: path.join(__dirname, '/build/*')
        }
    },
    // examples: {
    //     defaults: {
    //         input: path.join(__dirname, '/examples/src/**/*.html.jade'),
    //         jade: {
    //             pretty: true
    //         },
    //         output: path.join(__dirname, '/examples')
    //     }
    // },
    // test: {
    //     defaults:  {
    //         input: path.join(__dirname, '/test/**/*.spec.js')
    //     }
    // },
    uglify: {
        defaults: {
            input: path.join(__dirname, '/build/*.js'),
            output: path.join(__dirname, '/build'),
            options: {}
        }
    },
    webpack: require('./webpack.conf.js')
    // webpackDevServer: {
    //     defaults: {
    //         // contentBase: path.join(__dirname, '/examples'),
    //         // hot: true,
    //         noInfo: true,
    //         stats: {
    //             colors: true
    //         }
    //     }
    // }
};

gulp.task('build', [
    'uglify'
]);

// gulp.task('ci', function() {
//     var opts = _.clone(config.test.defaults);
//     return gulp.src(opts.input)
//         .pipe(karma({
//             action: 'watch',
//             configFile: 'karma.conf.js'
//         }))
//         .on('error', function(err) {
//             // Make sure failed tests cause gulp to exit with a non-zero status
//             throw err;
//         });
// });


//converts from jade to html - runs it once, not dynamically
// gulp.task('templates', function(){
//     // gulp.src('templates/*.jade');
//     // .pipe(watch())
//     // .pipe(jade())
//     // .pipe(gulp.dest("build"));
//     // .pipe(livereload());
// });

//converts from less to css - runs it once, not dynamically
// gulp.task('less', function(){
//     gulp.src('styles/*.less')
//     .pipe(watch())
//     .pipe(less())
//     .pipe(gulp.dest("build/css"));
//     // .pipe(livereload());
// });

gulp.task('clean', function() {
    var opts = _.clone(config.clean.defaults);
    return gulp.src(opts.input, {read: false})
        .pipe(clean());
});

gulp.task('watch', function(){
    livereload.listen();
    gulp.watch('build/**').on('change', livereload.changed);
});

gulp.task('default', ['webpack', 'uglify']);

gulp.task('examples', function() {
    var opts = _.clone(config.examples.defaults);
    watch({glob: opts.input}, function(files) {
        return files
            .pipe(plumber())
            .pipe(rename({extname: ''}))
            .pipe(jade(opts.jade))
            .pipe(gulp.dest(opts.output));
    });
});

// gulp.task('test', function() {
//     var opts = _.clone(config.test.defaults);
//     return gulp.src(opts.input)
//         .pipe(karma({
//             action: 'run',
//             configFile: 'karma.conf.js'
//         }))
//         .on('error', function(err) {
//             // Make sure failed tests cause gulp to exit with a non-zero status
//             throw err;
//         });
// });

gulp.task('uglify', ['clean','webpack'], function() {
    var opts = _.clone(config.uglify.defaults);
    return gulp.src(opts.input)
        .pipe(uglify(opts.options))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(opts.output));
});

gulp.task('webpack-dev-server', function() {
    var opts = _.merge(config.webpack.standalone, config.webpack.defaults, _.defaults);
    var serverOpts = _.clone(config.webpackDevServer.defaults);
    opts.cache = true;
    opts.devtool = 'eval';
    opts.debug = true;
    opts.output.pathinfo = true;
    opts.watch = true;
    opts.entry = [
        'webpack-dev-server/client?http://localhost:3232',
        // 'webpack/hot/dev-server',
        opts.entry
    ];
    // opts.profile = true;

    opts.plugins = opts.plugins.concat(
        new webpack.DefinePlugin(config.consts.defaults)
    );

    var compiler = webpack(opts);
    new WebpackDevServer(compiler, serverOpts).listen(3232, 'localhost', function(err) {
        if (err) throw new util.PluginError('webpack-dev-server', err);
        util.log('[webpack-dev-server]', 'Development server is running.');
        util.log('[webpack-dev-server]', 'View examples at http://localhost:3232/examples/');
    });
});

gulp.task('webpack', ['clean'], function(cb) {
    var opts = _.clone(config.webpack);

    webpack(opts, function(err, stats) {
        if (err) throw new util.PluginError('webpack', err);
        util.log('[webpack]', stats.toString());
        cb(err);
    });
});
