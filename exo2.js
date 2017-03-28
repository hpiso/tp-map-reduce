var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';

MongoClient.connect(url, function(err, db) {
    console.log("Connected correctly to server");

    var collection = db.collection('visits');

    var mapper = function() {
        var key = [this.url, this.hour];

        emit(key, this.user_id);
    };

    var reducer = function(key, values) {

        var uniqs = {};

        for (val in values) {
            uniqs[values[val]] = 1;
        }
        
        return(key, uniqs);
    };

    collection.mapReduce(mapper, reducer, {out : {inline: 1}, verbose:true}, function(err, results, stats) {
        console.log(results)
    });
});
