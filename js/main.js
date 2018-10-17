function setup (){
}
function draw (){
}

$(function(){
  var inic = {
    _nivelActual: 1,
    _fotosFrontales: 0,
    _fotosDePerfil: 0,
    _modelo: '',
    cargar: function(){
      inic.loader.mostrarLoader();
      inic.modelo.cargar();

      $('.primerTexto .btnSiguiente, .segundoTexto .btnSiguiente').click(function(){
        inic.navegacion();
      });
    },
    loader: {
      mostrarLoader: function(){
        $('.textoLoading').addClass('mostrarLoader');
      },
      ocultarLoader: function(){
        $('.textoLoading').removeClass('mostrarLoader');
      }
    },
    navegacion: function(){
      if(inic._fotosFrontales>=5 && inic._nivelActual==1){
        $('.primerTexto, .segundoTexto, .tercerTexto, .cuartoTexto').animate({'top': inic._nivelActual * -210 + 'px'},400);
        inic._nivelActual += 1;
      }else if(inic._fotosFrontales<5 && inic._nivelActual==1){
        alert('You need take at least 5 frontal pictures');
      }else if(inic._fotosDePerfil>=5 && inic._nivelActual==2){
        $('.primerTexto, .segundoTexto, .tercerTexto, .cuartoTexto').animate({'top': inic._nivelActual * -210 + 'px'},400);
        inic._nivelActual += 1;
      }else if(inic._fotosDePerfil<5 && inic._nivelActual==2){
        alert('You need take at least 5 profile pictures');
      }else if(inic._nivelActual==3){
        $('.primerTexto, .segundoTexto, .tercerTexto, .cuartoTexto').animate({'top': inic._nivelActual * -210 + 'px'},400);
        inic._nivelActual += 1;
      };
    },
    modelo: {
      cargar: function(){
        inic._modelo = ml5.featureExtractor('MobileNet',  function(){
          console.log('Model is ready');
          $('.textoLoading .loadingAzul').html('WAITING WEBCAM TO LOAD...');
          $('.textoLoading .loadingGris').html('WAITING WEBCAM TO LOAD...');
          setTimeout(function(){
            inic.video.cargar();
          },2000);
        });


        $('.btnTomarFoto').click(function(){
          if(inic._nivelActual==1){
            inic.modelo.tomarFotoFrontal();
          }else if(inic._nivelActual==2){
            inic.modelo.tomarFotoDePerfil();
          };
        });

        $('.tercerTexto .btnSiguiente').click(function(){
          if(inic._nivelActual==3){
            inic.modelo.entrenar();
          };
        });
      },
      tomarFotoFrontal: function(){
        if(inic._fotosFrontales<4){
          inic._fotosFrontales++;
          $('.primerTexto .fotosTomadas').append(inic._fotosFrontales + ', ');
          inic._modelo.addImage('Front');
        }else if(inic._fotosFrontales==4){
          inic._fotosFrontales++;
          $('.primerTexto .fotosTomadas').append(inic._fotosFrontales + ' - Done');
          inic._modelo.addImage('Front');
        }else if(inic._fotosFrontales>4){
          inic._fotosFrontales++;
          inic._modelo.addImage('Front');
        };
      },
      tomarFotoDePerfil: function(){
        if(inic._fotosDePerfil<4){
          inic._fotosDePerfil++;
          $('.segundoTexto .fotosTomadas').append(inic._fotosDePerfil + ', ');
          inic._modelo.addImage('Profile');
        }else if(inic._fotosDePerfil==4){
          inic._fotosDePerfil++;
          $('.segundoTexto .fotosTomadas').append(inic._fotosDePerfil + ' - Done');
          inic._modelo.addImage('Profile');
        }else if(inic._fotosDePerfil>4){
          inic._fotosDePerfil++;
          inic._modelo.addImage('Profile');
        };
      },
      entrenar: function(){
        $('.textoLoading .loadingAzul').html('TRAINING THE MODEL...');
        $('.textoLoading .loadingGris').html('TRAINING THE MODEL...');
        inic.loader.mostrarLoader();
        inic._modelo.train(training);

        function training(loss){
            if(loss === null){
              $('.textoLoading .loadingAzul').html('FINISHED TRAINING...');
              $('.textoLoading .loadingGris').html('FINISHED TRAINING...');
              setTimeout(function(){
                inic.loader.ocultarLoader();
                inic._modelo.classify(gotResults);
                console.log('Finished training');
              },2000);
            }else{
              $('.tercerTexto .fotosTomadas').html('Working loss: '+loss);
                //console.log('Loss: '+loss);
            };
        };

        function gotResults(error, result){
            if(error){
              $('.textoLoading .loadingAzul').html('ERROR JUST HAPPEND...');
              $('.textoLoading .loadingGris').html('ERROR JUST HAPPEND...');
              inic.loader.mostrarLoader();
              console.error(error);
            }else{
              inic.navegacion();
              $('#camara .redultado').html(result);
              inic._modelo.classify(gotResults);
            }
        };

      }
    },
    video: {
      _clasificador: '',
      cargar: function(){
        var ancho =$('#camara').width();
        var alto = $('#camara').height();
        var video;
        var canvas;

        var modulo = function(p) {
          p.setup = function() {
            canvas = p.createCanvas(ancho,alto);
            video = createCapture(VIDEO);
            video.hide();
            inic.video._clasificador = inic._modelo.classification(video, videoListo);
          };
          p.draw = function() {
            p.background(0);
            p.image(video, 0, 0, ancho, alto);
          };
        };
        var myp5 = new p5(modulo, 'camara');

        function videoListo(){
          $('.avatarCont').animate({'opacity':'0'},2000,function(){
            $(this).css({'display':'none'});
            $('#camara').animate({'opacity':'1'},400);
            $('.textoExplicativo').animate({'opacity': '1'});
            inic.loader.ocultarLoader();
            console.log('Video ready');
          });
        }

      }
    }
  }

inic.cargar();

});
