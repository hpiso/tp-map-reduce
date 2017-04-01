var MongoClient = require('mongodb').MongoClient,
    test = require('assert');

// Connexion au client Mongo
MongoClient.connect('mongodb://localhost:27017/myproject', function(err, db) {

    // Collection de test
    var collection = db.collection('SSSP');

    // Graph
    var graph = [
       { _id: 'A', value:{ url: 'A', pageRank: 1, adjlist: ['B', 'C'] }},
       { _id: 'B', value:{ url: 'B', pageRank: 1, adjlist: ['C'] }},
       { _id: 'C', value:{ url: 'C', pageRank: 1, adjlist: ['A'] }},
       { _id: 'D', value:{ url: 'D', pageRank: 1, adjlist: ['C'] }},
    ];

    collection.removeMany();

    collection.insertMany(graph, {w: 1}).then(function(result) {

        var map = function() {
            
            for (var i = 0, len = this.value.adjlist.length; i < len; i++) {
                emit(this.value.adjlist[i], this.value.pageRank / len);
            }

            // Vérifie si le reduce est appelé
            emit(this.value.url, 0);
            // Passage des valeurs de pageRank au reduce
            emit(this.value.url, this.value.adjlist);

        };

        var reduce = function(key, values) {
            
            var adjlist = [];
            var pageRank = 0.0;
            var dampingFactor = 0.85;

            for (var i = 0, len = values.length; i < len; i++) {
                if (values[i] instanceof Array)
                    adjlist = values[i];
                else
                    pageRank += values[i];
            }

            pageRank = 1 - dampingFactor + dampingFactor * pageRank;
            return { url: key, pageRank: pageRank, adjlist: adjlist };
        };

        function bfsIteration(currentLoop, maxLoop, callback) {

            // Appel des fonctions Map et Reduce
            collection.mapReduce(map, reduce, {out: {replace: 'SSSP'}}).then(function(collection) {

                collection.find().toArray().then(function (docs) {

                    if (currentLoop)
                        console.log('*****************');

                    console.log('Valeur de I : ', currentLoop);
                    console.log(docs);

                    // Lorsque le nombre d'itération max est atteint
                    if (currentLoop == maxLoop)
                        callback();
                    
                    bfsIteration(++ currentLoop, maxLoop, callback);
                });
            });
        }

        bfsIteration(0, 20, function finish() {
            console.log('Fin du programme');
            db.close();
        });

    });
});