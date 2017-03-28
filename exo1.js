var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';

MongoClient.connect(url, function(err, db) {
    console.log("Connected correctly to server");

    var collection = db.collection('visits');

    var mapper = function() {
        var key = [this.url, this.hour];

        emit(key, 1);
    };

    var reducer = function(key, values) {

        var sum = 0;

        for (val in values) {
            sum += parseFloat(val);
        }

        return(key, sum);
    };

    collection.mapReduce(mapper, reducer, {out : {inline: 1}, verbose:true}, function(err, results, stats) {
        console.log(results)
    });
});
