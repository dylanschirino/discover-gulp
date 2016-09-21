
// Définition des dépendances dont on a besoin pour executer les taches
var
   gulp = require( 'gulp' ),
   imagesMin = require( 'gulp-imagemin' );


// Définition de quelques variables générales
var
   source = 'source/',
   dest = 'build/';


// Définition de quelques variables liées à nos taches ( options de taches)
var
    imagesOpts = {


};


// Définition des taches
gulp.task('images', function(){
    gulp.src()
});


// Tache par défault exécuté lorsqu'on tape gulp dans le terminal
gulp.task('default', function(){
  console.log('test');
});
