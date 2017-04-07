var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const vision = require('node-cloud-vision-api');
  vision.init({
    auth: 'AIzaSyAxmNAEPX4FxDAzZ08ieta_A-fqf3MU4R4'
  });

  const visionRequest = new vision.Request({
    image: new vision.Image(__dirname + '/../images/1.jpg'),
    features: [
      new vision.Feature('FACE_DETECTION', 4),
      // new vision.Feature('LABEL_DETECTION', 10),
      // new vision.Feature('LOGO_DETECTION', 3),
      // new vision.Feature('LANDMARK_DETECTION', 10),
      // new vision.Feature('TEXT_DETECTION', 30)
    ]
  })

  vision.annotate(visionRequest).then((visonResponse) => {
      console.log('ON /');

    // handling response
    console.log(JSON.stringify(visonResponse.responses))
    res.json(visonResponse.responses);
  }, (e) => {
      console.log('ON /');

    console.error('Error: ', e)
    res.status(400);
    res.json(e);
  });
});

module.exports = router;
