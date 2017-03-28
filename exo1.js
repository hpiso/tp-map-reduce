var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';

MongoClient.connect(url, function(err, db) {
    console.log("Connected correctly to server");

    var collection = db.collection('visits');

    var mapper = function() {
        var key = [this.user_id, this.url, this.hour];

        emit(key, 1);
    };

    var reducer = function(key, values) {

        var sum = 0;

        for (val in values) {
            sum += parseFloat(val);
        }

        return(key, sum);
    };

    // Map function
    var map = function() { emit(this.user_id, 1); };
    // Reduce function
    var reduce = function(k,vals) { return 1; };

    collection.mapReduce(mapper, reducer, {out : {inline: 1}, verbose:true}, function(err, results, stats) {
        console.log(results)
    });
});
