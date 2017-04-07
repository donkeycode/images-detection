// import entire SDK 
const AWS = require('aws-sdk');
const fs = require('fs');
var crypto = require('crypto');
var async = require('async');

var AWSRekognize = function(config) {

    AWS.config.update(config.aws.credentials);

    var _upload = function(imagePath, done) {
        var s3 = new AWS.S3();
        var s3Key = "img-"+crypto.randomBytes(4).readUInt32LE(0);

        fs.readFile(imagePath, (err, data) => {

            if (err) { throw err; }

            var base64data = new Buffer(data, 'binary');

            var s3 = new AWS.S3();
            s3.putObject({
                Bucket: config.aws.s3.bucketName,
                Key: s3Key,
                Body: base64data,
                ACL: 'public-read'
            }, function (err, res) {
                if (err) {
                    return done(err);
                }

                done(null, s3Key);
            });
        });
    }

    var _detectFaces = function(s3Key, done) {
        var reko = new AWS.Rekognition();
        reko.detectFaces({
            Image: {
                S3Object: {
                    Bucket: config.aws.s3.bucketName,
                    Name: s3Key
                }
            }
        }, function(err, data) {
            if (err) {
                return done(err, err.stack);
            }

            done(null, data);
        });
    };

    var _detectLabels = function(s3Key, done) {
        var reko = new AWS.Rekognition();
        reko.detectLabels({
            Image: {
                S3Object: {
                    Bucket: config.aws.s3.bucketName,
                    Name: s3Key
                }
            }
        }, function(err, data) {
            if (err) {
                return done(err, err.stack);
            }

            done(null, data);
        });
    };

    return  {
        rekognize: function(imagePath, done) {
            _upload(imagePath, (err, s3Key) => {
                if (err) {
                    return done(err);
                }

                async.parallel({
                    labels: function(callback) {
                        return _detectLabels(s3Key, callback);
                    },
                    faces: function(callback) {
                        return _detectFaces(s3Key, callback);
                    }
                }, function (err, infos) {
                    if (err) {
                        return done(err, infos);
                    }

                    return done(null, infos);
                });
            });
        },
        extractTags: function(results) {
            return results.labels.Labels.filter((elem) => {
                return elem.Confidence > 60;
            }).map((elem) => {
                return elem.Name.toLowerCase();
            });
        }
    }
}


module.exports = AWSRekognize;