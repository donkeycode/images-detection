function resizeImage(imageContainer) {
    $(imageContainer).find('.js-image').css('height', 'auto');
    $(imageContainer).find('.js-image').css('width', '100%');

    var imgWidth = $(imageContainer).find('.js-image').width();
    var imgHeight = $(imageContainer).find('.js-image').height();
    var containerWidth = $(imageContainer).width();
    var containerHeight = $(imageContainer).height();

    var box = imageContainer._metasInfos.aws.faces.FaceDetails[0];
    var rotate = imageContainer._metasInfos._metas.rotation;

    $(imageContainer).find('.js-image').css('transform', 'rotate('+ (rotate || 0) +'deg)');
    $(imageContainer).find('.js-image').css('transform-origin', 'center center');
    $(imageContainer).find('.js-image').css('transform-style', 'preserve-3d');
    if (box) {
      var zoneWidth = box.BoundingBox.Width * imgWidth;
      var zoneHeight = box.BoundingBox.Height * imgHeight;
      var positionLeft = box.BoundingBox.Left * imgWidth;
      var positionTop = box.BoundingBox.Top * imgHeight;
    } else {
      var zoneWidth = 1 * imgWidth;
      var zoneHeight = 1 * imgHeight;
      var positionLeft = 1 * imgWidth;
      var positionTop = 1 * imgHeight;
    }
  
    if (containerHeight > imgHeight) {
      var zoom = (containerHeight - imgHeight) / imgHeight;
      var newPositionLeft = (1 + zoom) * positionLeft;
      var newPositionTop = (1 + zoom) * positionTop;

      // On agrandi la largeur
      $(imageContainer).find('.js-image').css('height', containerHeight + 'px');
      $(imageContainer).find('.js-image').css('width', 'auto');

      var idealLeft = (containerWidth / 3 - newPositionLeft);
      var maxLeft = containerWidth - $(imageContainer).find('.js-image').width() ;
      $(imageContainer).find('.js-image').css('left',  Math.min(0, Math.max(idealLeft, maxLeft)) + 'px');
      

    } else {
      var zoom = (containerWidth - imgWidth) / imgWidth;

      var newPositionLeft = (1 + zoom) * positionLeft;
      var newPositionTop = (1 + zoom) * positionTop - zoneHeight;

      $(imageContainer).find('.js-image').css('height', 'auto');
      $(imageContainer).find('.js-image').css('width', '100%');

      var x = $(imageContainer).find('.js-image').height() - containerHeight;
      var minTop = 0;
      var maxTop = newPositionTop + zoneHeight;
      var idealTop = box.BoundingBox.Top * $(imageContainer).find('.js-image').height() -  box.BoundingBox.Top * containerHeight;

      console.log(idealTop, $(imageContainer).find('.js-image').height(), containerHeight);

      var aTop = minTop;

      if (idealTop > maxTop) {
        aTop = maxTop;
      }

      if (idealTop <= maxTop && idealTop >= minTop) {
        aTop = idealTop;
      }

      //aTop = idealTop;

      $(imageContainer).find('.js-image').css('top', - aTop + 'px');
    }
  }

function imageContainerInit(that) {
  var img = $('<img />')
      .attr('src', $(that).attr('src'))
      .addClass('js-image');

  $(that).addClass('image-cotainer js-image-cotainer');
  $(that).append(img);

  async.parallel({
    load: function(callback) {
      $(img).one("load", function() {
        callback(null, null);
      });
    },
    infos: function(callback) {
      fetch('http://localhost:3000/images-infos/?url='+$(img)[0].src)
        .then(function(response) {
          response.json().then(function(datas) {
            callback(null, datas);
          })
        });
    }
  }, function (err, results) {
    if (err) {
      console.error(err);
    }

    that._metasInfos = results.infos;
    $(img).attr('alt', that._metasInfos._metas.tags.join(', '));
    $(img).attr('title', that._metasInfos._metas.tags.join(', '));


    resizeImage(that);            
  });

}

$(document).ready(function() {
  $('auto-resize-img').each(function() {
    imageContainerInit(this);
  });

  window.addEventListener('resize', function() {
    $('auto-resize-img').each(function() {
      resizeImage(this);
    });
  });
});

