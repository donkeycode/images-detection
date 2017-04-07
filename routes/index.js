var express = require('express');
var router = express.Router();
var config = require('config');
var async = require('async');

var AWSRekognize = require('../tools/aws');
var GoogleVision = require('../tools/gvision');
var downloader = require('../tools/downloader');
var crypto = require('crypto');

router.get('/images-infos', function(req, res, next) {

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

            var awsTags = awsReko.extractTags(results.aws);
            var googleTags = googleReko.extractTags(results.google);
            
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
    for (var i=0; i<a.length; ++i) {
        for (var j=i+1; j<a.length; ++j) {
            if (a[i] === a[j]) {
                a.splice(j--, 1);
            }
        }
    }

    return a;
};