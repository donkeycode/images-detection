/**
 * 
 * @param {Config} config {
 *    server: "url",
 *    resizeTag: 'auto-resize-img'
 * }
 */
var goodPicture = function goodPicture(config) {

    var imageContainerInit = function(containerElement) {
        var img = document.createElement("img");
        img.src = containerElement.attributes.src.value;
        img.classList.add('js-image');
        img.classList.add('is-loading');
        
        window.containerElement = containerElement;
        containerElement.classList.add('image-cotainer');
        containerElement.classList.add('js-image-cotainer')
        containerElement.append(img);

        async.parallel({
            load: function(callback) {
                img.addEventListener("load", function() {
                    callback(null, null);
                });
            },
            infos: function(callback) {
                fetch(config.server+"?url="+img.src)
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

            containerElement._metasInfos = results.infos;
            var tags = containerElement._metasInfos._metas.tags.join(', ');

            img.attributes.alt = tags;
            img.attributes.title = tags;

            resizeImage(containerElement); 

            setTimeout(function clearLoading() {
                img.classList.remove('is-loading');
            });
        });
    }


    var resizeImage = function(imageContainer) {
        var img = imageContainer.querySelector('.js-image');

        // Reset for next calculations
        img.style.height = "auto";
        img.style.width = "100%";
        
        var rect = img.getBoundingClientRect();
        var imgWidth = rect.width;
        var imgHeight = rect.height;

        rect = imageContainer.getBoundingClientRect();
        var containerWidth = rect.width;
        var containerHeight = rect.height;

        var box = imageContainer._metasInfos.aws.faces.FaceDetails[0];

        var rotate = imageContainer._metasInfos._metas.rotation;
        img.style.transform = 'rotate('+ (rotate || 0) +'deg)';

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
            img.style.height = containerHeight + "px";
            img.style.width = "auto";
            
            var rect = img.getBoundingClientRect();
            
            if (box) {
                var idealLeft = box.BoundingBox.Left * rect.width -  box.BoundingBox.Left * containerWidth;
            } else {
                var idealLeft = 0;
            }
            idealLeft = -idealLeft;
            
            var maxLeft = containerWidth - rect.width;
            img.style.left = Math.min(0, Math.max(idealLeft, maxLeft)) + 'px';
        } else {
            var zoom = (containerWidth - imgWidth) / imgWidth;

            var newPositionLeft = (1 + zoom) * positionLeft;
            var newPositionTop = (1 + zoom) * positionTop - zoneHeight;

            // Grow the height
            img.style.height = "auto";
            img.style.width = "100%";

            setTimeout(function() {
                var rect = img.getBoundingClientRect();

                var minTop = 0;
                var maxTop = newPositionTop + zoneHeight;
                var idealTop = box.BoundingBox.Top * (rotate != 0 ? rect.width :  rect.height) -  box.BoundingBox.Top * containerHeight;

                var aTop = minTop;

                if (idealTop > maxTop) {
                    aTop = maxTop;
                }

                if (idealTop <= maxTop && idealTop >= minTop) {
                    aTop = idealTop;
                }

                img.style.top = - aTop + 'px';
            });
        }
    }

    document.querySelectorAll(config.resizeTag).forEach(function(containerElement) {
        imageContainerInit(containerElement);
    });

    window.addEventListener('resize', function() {
        document.querySelectorAll(config.resizeTag).forEach(function(containerElement) {
            resizeImage(containerElement);
        });
    });
    
    this.imageContainerInit = imageContainerInit;

    return this;
}



