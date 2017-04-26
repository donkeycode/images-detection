var config = require('config');
var mongoose = require('mongoose');

mongoose.connect(config.mongodb);

var CacheSchema = new mongoose.Schema({
    url: String,
    datas: Object
}, { strict: false });
var CacheDB = mongoose.model('Cache', CacheSchema);


var __get = function(url, done) {
    return CacheDB.findOne({ url: url }).then(function(obj) {
        done(obj);
    }, function (err) {
        done(null, err);
    });
};

module.exports = {
    get: __get,
    set: function(url, datas) {
        return __get(url, function(aCache) {
            if (!aCache) {
                aCache = new CacheDB();
                aCache.url = url;
            }

            aCache.datas = datas;

            return aCache.save();
        });
    }
};