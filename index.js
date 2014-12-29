var express = require('express');
var app = express();
var pg = require("pg");

app.set('port', (process.env.PORT || 3000));

var islocal = true;
var conString = "postgres://postgres:fl4ppysc0r3@localhost:5432/flappy_backend";
var databaseUrl = islocal ? conString : process.env.DATABASE_URL;

app.get("/scores", function(request, response) {
    pg.connect(databaseUrl, function(err, client, done) {
        getHighestScores(done, client, response);
    });
});

app.get(/^\/users\/(\w{3,})\/score\/(\d+)$/, function(request, response) {

    pg.connect(databaseUrl, function(err, client, done) {
    
        client.query('INSERT INTO scores (name,score) VALUES ($1,$2) RETURNING (id, name, score)', [request.params[0], request.params[1]], function(err, result) {
            if (err) {
                response.send(err);
                done();
            } else {
                getHighestScores(done, client, response);
            }
        });
        
    });
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

function getHighestScores(done, client, response) {
    client.query("SELECT * FROM scores ORDER BY score DESC LIMIT 10", function(err, result){ 
        if (err) {
            response.send(err);
        } else {
            response.send(JSON.stringify(result.rows));
        }
        done();
    });
}

