var express = require('express');
var router = express.Router();
var config = require('config');
var async = require('async');

var AWSRekognize = require('../tools/aws');
var GoogleVision = require('../tools/gvision');

router.get('/images-infos/:imageId', function(req, res, next) {
    var awsReko = AWSRekognize(config);
    var googleReko = GoogleVision(config);

    var file = __dirname + '/../images/'+ req.params.imageId +'.jpg';

    async.parallel({
        aws: function(callback) {
            awsReko.rekognize(file, callback);
        },
        google: function(callback) {
            googleReko.rekognize(file, callback);
        },

    }, function(err, results) {
        if (err) {
            res.status(400);
            res.json(err);
            return;
        }

        res.json(results);
    });
})


module.exports = router;
