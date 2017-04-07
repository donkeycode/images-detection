var express = require('express');
var router = express.Router();
var config = require('config');
var async = require('async');

var AWSRekognize = require('../tools/aws');
var GoogleVision = require('../tools/gvision');
var downloader = require('../tools/downloader');
var crypto = require('crypto');

router.get('/images-infos', function(req, res, next) {

    console.log(req.query.url);

    var file = "/tmp/img-"+crypto.randomBytes(4).readUInt32LE(0);
    downloader(req.query.url, file, function() {
        var awsReko = AWSRekognize(config);
        var googleReko = GoogleVision(config);
        
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

            var awsTags = results.aws.labels.Labels.filter((elem) => {
                return elem.Confidence > 60;
            }).map((elem) => {
                return elem.Name.toLowerCase();
            });

            var googleTags = results.google[0].labelAnnotations.filter((elem) => {
                return elem.score > 0.6;
            }).map((elem) => {
                return elem.description.toLowerCase();
            });
            
            results._metas = {
                tags: awsTags.concat(googleTags).unique(),
                rotation: results.aws.faces.OrientationCorrection ? results.aws.faces.OrientationCorrection.replace(/ROTATE_/, '') : 0
            };

            res.json(results);
        });
    });
})


module.exports = router;


Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};