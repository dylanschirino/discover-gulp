
// Définition des dépendances dont on a besoin pour executer les taches
var
gulp = require( 'gulp' ),
imagesMin = require( 'gulp-imagemin' ),
newer = require( 'gulp-newer' ),
size = require ( 'gulp-size' ),
del = require ( 'del' ),
cleanDest = require ( 'gulp-dest-clean'),
imacss = require ( 'gulp-imacss' ),
sass = require ( 'gulp-sass' );


// Définition de quelques variables générales
var
source = 'source/',
dest = 'build/';


// Définition de quelques variables liées à nos taches ( options de taches)
var
imagesOpts = {
  in: source + 'images/*.*',
  out: dest + 'images/',
  watch: source + 'images/*.*'

},
imageUriOpts = {
  in: source + 'images/inline/*.*',
  out: source + 'scss/images/',
  filename: '_datauri.scss',
  namespace:'uri'
},
css = {
  in: source + 'scss/main.scss',
  watch: [source + 'scss/**/*'],
  out: dest + 'css/',
  sassOpts: {
    outputStyle: 'compressed',
    precision: 3,
    errLogToConsole:true
  }
};


gulp.task('clean', function(){
  del( [dest + '*'] );
});


// Définition des taches
gulp.task('images', function(){
  return gulp.src( imagesOpts.in )
  .pipe(cleanDest( imagesOpts.out)) //pour supprimer les images dans build si on les supprime dans sources.
  .pipe(newer( imagesOpts.out ) )
  .pipe(size({title: 'Images size before compression:', showFiles: true}))
  .pipe( imagesMin() )
  .pipe(size({title: 'Images size after compression:', showFiles: true}))
  .pipe( gulp.dest( imagesOpts.out ) )
  // fonction dans laquelle on mets la commande qu'on veut executé
});

gulp.task('imageuri', function(){

  return gulp.src(imageUriOpts.in)
  .pipe(imagesMin())
  .pipe(imacss(imageUriOpts.filename, imageUriOpts.namespace))
  .pipe(gulp.dest(imageUriOpts.out));

});

gulp.task('sass', function(){

  return gulp.src(css.in)
    .pipe(sass(css.sassOpts))
    .pipe(gulp.dest(css.out));
});


// Tache par défault exécuté lorsqu'on tape gulp dans le terminal
gulp.task('default',['images'], function(){

  gulp.watch(imagesOpts.watch, ['images']);

});
