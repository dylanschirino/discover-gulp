
// Définition des dépendances dont on a besoin pour executer les taches
var
gulp = require( 'gulp' ),
imagesMin = require( 'gulp-imagemin' ),
newer = require( 'gulp-newer' ),
size = require ( 'gulp-size' ),
del = require ( 'del' ),
cleanDest = require ( 'gulp-dest-clean'),
imacss = require ( 'gulp-imacss' ),
sass = require ( 'gulp-sass' ),
htmlPreprocess = require ( 'gulp-preprocess' ),
htmlclean = require ('gulp-htmlclean'),
pkg = require ('./package.json'); // comme ca on a le scope de l'object package.json du coup on peut recuperer le nom de l'auteur par exemple.


// Définition de quelques variables générales
var
devBuild = ( (process.env.NODE_ENV || 'development').trim().toLowerCase() !== 'production'),
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
    outputStyle: 'expended',
    precision: 3,
    errLogToConsole:true
  }
},
html = {
  in: source + '*.html',
  watch: [source + '*.html', source + 'template/**/*'],
  out: dest,
  context: {
    devBuild: devBuild,
    author: pkg.author,
    version: pkg.version
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

gulp.task('html', function(){

  var page =  gulp.src(html.in)
  .pipe(htmlPreprocess({context:html.context}));
  if(!devBuild){
    page = page
    .pipe(size({title:'HTML avant nettoyage:'}))
    .pipe(htmlclean())
    .pipe(size({title:'HTML après nettoyage:'}))
  }
  return page.pipe(gulp.dest(html.out));
});


// Tache par défault exécuté lorsqu'on tape gulp dans le terminal
gulp.task('default',['html','images','sass'], function(){
  gulp.watch(html.watch, ['html']);
  gulp.watch(imagesOpts.watch, ['images']);
  gulp.watch(css.watch, ['sass']);

});
