var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';

// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    insertVisits(db, function() {
        db.close();
    });
});

var insertVisits = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('visits');

    function randomIntInc (low, high) {
        return Math.floor(Math.random() * (high - low + 1) + low);
    }

    var views = [];
    var urls = [
        "/",
        "/edmond",
        "/ksander",
        "/basile",
        "/ulrich",
        "/schaal",
        "/theo",
    ];

    //Generate views
    for (var i = 0; i < 100; i++) {

        var visit = {
            url :  "",  //random parmi liste
            user_id: "", //random
            hour: "",    //0-23
        };

        visit.url = urls[ randomIntInc(0, urls.length-1)];
        visit.user_id = randomIntInc(0, 10);
        visit.hour = randomIntInc(0,5);

        views.push(visit);
    }

    // Insert some views
    collection.insertMany(views, function(err, result) {
        console.log("All views added");
        callback(result);
    });
};