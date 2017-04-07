$( document ).ready(function() {
    console.log( "ready!" );

    function doIt() {
      $('.js-image').css('height', 'auto');
      $('.js-image').css('width', '100%');

      var imgWidth = $('.js-image').width();
      var imgHeight = $('.js-image').height();
      var containerWidth = $('.js-image-cotainer').width();
      var containerHeight = $('.js-image-cotainer').height();

      var zoom2 = (containerWidth - imgWidth) / imgWidth;


      var zoneWidth = 0.05 * imgWidth;
      var zoneHeight = 0.07 * imgHeight;
      var positionLeft = 0.577 * imgWidth;
      var positionTop = 0.20 * imgHeight;

      

    


      if (containerHeight > imgHeight) {
        var zoom = (containerHeight - imgHeight) / imgHeight;
        var newZoneWidth = (1 + zoom) * zoneWidth;
        var newZoneHeight = (1 + zoom) * zoneHeight;
        var newPositionLeft = (1 + zoom) * positionLeft;
        var newPositionTop = (1 + zoom) * positionTop;

        // On agrandi la largeur
        $('.js-image').css('height', containerHeight + 'px');
        $('.js-image').css('width', 'auto');

        var idealLeft = (containerWidth / 3 - newPositionLeft);
        var maxLeft = containerWidth - $('.js-image').width() ;
        $('.js-image').css('left',  Math.max(idealLeft, maxLeft) + 'px');
        

      } else {
        var zoom = (containerWidth - imgWidth) / imgWidth;

        var newZoneWidth = (1 + zoom) * zoneWidth;
        var newZoneHeight = (1 + zoom) * zoneHeight;
        var newPositionLeft = (1 + zoom) * positionLeft;
        var newPositionTop = (1 + zoom) * positionTop - zoneHeight;
        console.log(positionTop);

        $('.js-image').css('height', 'auto');
        $('.js-image').css('width', '100%');

        // var idealTop = -(containerHeight / 3 + newPositionTop - zoneHeight);
        var x = $('.js-image').height() - containerHeight;
        var minTop = 0;
        var maxTop = newPositionTop + zoneHeight;
        var idealTop = x / 3;


        var aTop = minTop;

        if (idealTop > maxTop) {
          aTop = maxTop;
        }

        if (idealTop <= maxTop && idealTop >= minTop) {
          aTop = idealTop;
        }


        console.log({ min: minTop, maxTop: maxTop, idealTop: idealTop, aTop: aTop});

        //aTop = newPositionTop + zoneHeight;

        $('.js-image').css('top', - aTop + 'px');

      }

      $('.js-zone').css({
        'width': newZoneWidth + 'px', 
        'height': newZoneHeight + 'px',
        'top': newPositionTop + 'px',
        'left': newPositionLeft + 'px'
      });
    }

    doIt();

    window.addEventListener('resize', doIt);

   

    //zoom img width ()
    //var newImgWidth = (zoom + 1)* imgWidth;

    // console.log( 'imgWidth = ' +  imgWidth);
    // console.log( 'imgHeight = ' +  imgHeight);
    // console.log( 'containerWidth = ' +  containerWidth);
    // console.log( 'containerHeight = ' +  containerHeight);
    // console.log( 'zoom = ' +  zoom);
    // console.log( 'newImgWidth = ' +  newImgWidth);

    //$('.js-image').css('width', newImgWidth + 'px');

    

});


// $( window ).resize(function() {
//     var imgWidth = $('.js-image').width();
//     var imgHeight = $('.js-image').height();

//     var containerWidth = $('.js-image-cotainer').width();
//     var containerHeight = $('.js-image-cotainer').height();
//     var zoom = (containerHeight - imgHeight) / imgHeight;

//     console.log( 'zoom = ' +  zoom);
    
// });