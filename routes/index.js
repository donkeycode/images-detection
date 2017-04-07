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
       new vision.Feature('LABEL_DETECTION', 10),
      new vision.Feature('LOGO_DETECTION', 3),
      new vision.Feature('LANDMARK_DETECTION', 10),
      new vision.Feature('TEXT_DETECTION', 30)
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

router.get('/images-infos', function(req, res, next) {
  var obj = {
      "FaceDetails": [
          {
              "AgeRange": {
                  "High": 52,
                  "Low": 35
              },
              "Beard": {
                  "Confidence": 99.24075317382812,
                  "Value": false
              },
              "BoundingBox": {
                  "Height": 0.07251264899969101,
                  "Left": 0.5766666531562805,
                  "Top": 0.20741990208625793,
                  "Width": 0.04777777940034866
              },
              "Confidence": 99.98963165283203,
              "Emotions": [
                  {
                      "Confidence": 99.58682250976562,
                      "Type": "HAPPY"
                  },
                  {
                      "Confidence": 0.8675634860992432,
                      "Type": "SURPRISED"
                  },
                  {
                      "Confidence": 0.713878870010376,
                      "Type": "CONFUSED"
                  }
              ],
              "Eyeglasses": {
                  "Confidence": 99.99971008300781,
                  "Value": false
              },
              "EyesOpen": {
                  "Confidence": 99.895263671875,
                  "Value": false
              },
              "Gender": {
                  "Confidence": 100,
                  "Value": "Female"
              },
              "Landmarks": [
                  {
                      "Type": "eyeLeft",
                      "X": 0.6029305458068848,
                      "Y": 0.23030062019824982
                  },
                  {
                      "Type": "eyeRight",
                      "X": 0.6098537445068359,
                      "Y": 0.25418150424957275
                  },
                  {
                      "Type": "nose",
                      "X": 0.6016806960105896,
                      "Y": 0.24728542566299438
                  },
                  {
                      "Type": "mouthLeft",
                      "X": 0.5873144268989563,
                      "Y": 0.24033169448375702
                  },
                  {
                      "Type": "mouthRight",
                      "X": 0.594233512878418,
                      "Y": 0.26430267095565796
                  },
                  {
                      "Type": "leftPupil",
                      "X": 0.6036158800125122,
                      "Y": 0.23083151876926422
                  },
                  {
                      "Type": "rightPupil",
                      "X": 0.6094146966934204,
                      "Y": 0.2522544860839844
                  },
                  {
                      "Type": "leftEyeBrowLeft",
                      "X": 0.603692889213562,
                      "Y": 0.21896634995937347
                  },
                  {
                      "Type": "leftEyeBrowRight",
                      "X": 0.6084298491477966,
                      "Y": 0.2228173315525055
                  },
                  {
                      "Type": "leftEyeBrowUp",
                      "X": 0.6103474497795105,
                      "Y": 0.23083403706550598
                  },
                  {
                      "Type": "rightEyeBrowLeft",
                      "X": 0.612907350063324,
                      "Y": 0.24373094737529755
                  },
                  {
                      "Type": "rightEyeBrowRight",
                      "X": 0.6163859963417053,
                      "Y": 0.2513608932495117
                  },
                  {
                      "Type": "rightEyeBrowUp",
                      "X": 0.6157721877098083,
                      "Y": 0.26029086112976074
                  },
                  {
                      "Type": "leftEyeLeft",
                      "X": 0.6009235382080078,
                      "Y": 0.22636979818344116
                  },
                  {
                      "Type": "leftEyeRight",
                      "X": 0.6040581464767456,
                      "Y": 0.2350967973470688
                  },
                  {
                      "Type": "leftEyeUp",
                      "X": 0.6040844321250916,
                      "Y": 0.22940756380558014
                  },
                  {
                      "Type": "leftEyeDown",
                      "X": 0.6022165417671204,
                      "Y": 0.23076103627681732
                  },
                  {
                      "Type": "rightEyeLeft",
                      "X": 0.6082584857940674,
                      "Y": 0.25010883808135986
                  },
                  {
                      "Type": "rightEyeRight",
                      "X": 0.6107239723205566,
                      "Y": 0.2590138912200928
                  },
                  {
                      "Type": "rightEyeUp",
                      "X": 0.6108769178390503,
                      "Y": 0.2533814013004303
                  },
                  {
                      "Type": "rightEyeDown",
                      "X": 0.6091930866241455,
                      "Y": 0.2546018660068512
                  },
                  {
                      "Type": "noseLeft",
                      "X": 0.597159206867218,
                      "Y": 0.244641974568367
                  },
                  {
                      "Type": "noseRight",
                      "X": 0.599098801612854,
                      "Y": 0.25295665860176086
                  },
                  {
                      "Type": "mouthUp",
                      "X": 0.593993604183197,
                      "Y": 0.2510901093482971
                  },
                  {
                      "Type": "mouthDown",
                      "X": 0.5876810550689697,
                      "Y": 0.25488653779029846
                  }
              ],
              "MouthOpen": {
                  "Confidence": 77.8773422241211,
                  "Value": true
              },
              "Mustache": {
                  "Confidence": 99.98287200927734,
                  "Value": false
              },
              "Pose": {
                  "Pitch": 20.124887466430664,
                  "Roll": 65.58293914794922,
                  "Yaw": 8.746491432189941
              },
              "Quality": {
                  "Brightness": 38.94131088256836,
                  "Sharpness": 93.67259216308594
              },
              "Smile": {
                  "Confidence": 97.75274658203125,
                  "Value": true
              },
              "Sunglasses": {
                  "Confidence": 53.31218719482422,
                  "Value": true
              }
          }
      ],
      "OrientationCorrection": "ROTATE_0"
  };

  res.json(obj);
})

module.exports = router;
