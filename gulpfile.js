var gulp = require('gulp')
  , browserify  = require('gulp-browserify')
  , browserifyShim  = require('browserify-shim')
  , concat   = require('gulp-concat')
  , uglify   = require('gulp-uglify')
  , jshint   = require('gulp-jshint')
  , gulpif   = require('gulp-if')
  , rename   = require('gulp-rename')
  , connect  = require('gulp-connect')
  , notify   = require("gulp-notify");

// Tiny Livereload
var lr = require('tiny-lr')
    , server = lr()
    , refresh = require('gulp-livereload')
    , modRewrite = require('connect-modrewrite');

// Setup the paths
var paths = {
    scripts : ['app/**' ,'assets/common/**','!build/**'],
};

var shimsObject = {
  serializeObject : {
    path : './assets/plugins/serializeObject/serializeObject.js',
    exports : 'serializeObject'
  },
  dcjqaccordion : {
    path : './assets/plugins/accordion-menu/jquery.dcjqaccordion.2.7.js',
    exports : 'dcjqaccordion'
  },
  backboneLayoutmanager : {
    path : './assets/plugins/backbone.layoutmanager.js',
    exports : 'backboneLayoutmanager'
  },
  dataTables : {
    path : './assets/plugins/data-tables/jquery.dataTables.js',
    exports : 'dataTables'
  },
  DT_bootstrap : {
    path : './assets/plugins/data-tables/DT_bootstrap.js',
    exports : 'DT_bootstrap'
  },
  bootstrapDatePicker : {
    path : './assets/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
    exports : 'bootstrapDatePicker'
  },
  select2 : {
    path : './assets/plugins/select2-master/select2.min.js',
    exports : 'select2'
  },
  jquery_ui : {
    path : './assets/plugins/jquery-ui/jquery-ui-1.10.1.custom.min.js',
    exports : 'jquery_ui'
  },
  wysihtml5 : {
    path : './assets/plugins/bootstrap-wysihtml5/wysihtml5-0.3.0.js',
    exports : 'wysihtml5'
  },
  bootstrapwysihtml5 : {
    path : './assets/plugins/bootstrap-wysihtml5/bootstrap-wysihtml5.js',
    exports : 'bootstrapwysihtml5',
    depends: {
      wysihtml5: 'wysihtml5'
    }
  },
  upload : {
    path : './assets/plugins/upload/jquery.upload.js',
    exports : 'upload'
  },
  steps : {
    path : './assets/plugins/jquery-steps-master/build/jquery.steps.min.js',
    exports : 'steps'
  },
  nestable : {
    path : './assets/plugins/nestable/jquery.nestable.js',
    exports : 'nestable'
  },
  backboneDragNDrop : {
    path : './assets/plugins/drag-n-drop/backbone.sortable.js',
    exports : 'backboneDragNDrop',
    depends : {
      backbone : 'backbone'
    }
  }
};

gulp.task('connect', function() {
  connect.server({
    port: 2000,
    middleware: function() {
      return [
        modRewrite([
          // TODO: Not working yet
          // '!\\.html|\\images|\\.js|\\.css|\\.png|\\.jpg|\\.woff|\\.ttf|\\.svg / [L]'
        ])
      ];
    }
  });
});

// Setp the Gulp Default Task. Use this to start the
// connect server, then tell the server to listen for
// reload events on port 35729. Each time th watch
// find a change it will force the 'scripts' task
// to run which calls a server reload event.

gulp.task('default', [ 'scripts', 'connect' ], function() {
  server.listen(35729, function ( err ) {
    if ( err )
      return console.log(err);

    // gulp.watch(paths.scripts, [ 'scripts' ]);
    gulp.watch('app/**/*.js', [ 'scripts' ]);
    gulp.watch('app/**/*.handlebars', [ 'scripts' ]);
    gulp.watch('./index.html', [ 'scripts' ]);
  });
});

gulp.task('deploy', [ 'scripts' ], function() {
  console.log('Build ready to deploy in the gh-pages branch.');
});

gulp.task('scripts',function() {
  gulp.src('app/app.js',{ read: false })
    .pipe(browserify({
      shim: shimsObject,
      transform: ['hbsfy'],
      debug: true
    })
    .on('error',function(err) {
      if(err) console.log('' + err);
    }))
    .pipe(gulp.dest('build'))
    .pipe(refresh(server));
});
