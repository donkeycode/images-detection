const vision = require('node-cloud-vision-api');

var GoogleVision = function(config) {

    vision.init({
        auth: config.google.credentials.api_key
    });

    var _rekognize = function(imagePath, done) {
        const visionRequest = new vision.Request({
            image: new vision.Image(imagePath),
            features: [
                new vision.Feature('FACE_DETECTION', 4),
                new vision.Feature('LABEL_DETECTION', 10),
                new vision.Feature('LOGO_DETECTION', 3),
                new vision.Feature('LANDMARK_DETECTION', 10),
                new vision.Feature('TEXT_DETECTION', 30),
                new vision.Feature('WEB_DETECTION', 30)
            ]
        });

        vision.annotate(visionRequest).then((visonResponse) => {
            done(null, visonResponse.responses);
        }, (e) => {
            done(e);
        });
    };

    return  {
        rekognize: function(imagePath, done) {
            return _rekognize(imagePath, done);
        },
        extractTags: function(results) {
            return results[0].labelAnnotations.filter((elem) => {
                return elem.score > 0.6;
            }).map((elem) => {
                return elem.description.toLowerCase();
            });
        }
    }
};

module.exports = GoogleVision;



  

  