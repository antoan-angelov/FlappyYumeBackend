var express = require('express');
var app = express();
//var mysql      = require('mysql');

app.set('port', (process.env.PORT || 3000));

var pg = require("pg")
var http = require("http")
var port = 5000;
var host = '127.0.0.1';

var conString = "pg://postgres:fl4ppysc0r3@localhost:5000/flappy_backend";
//var client = new pg.Client(conString);
//client.connect();



/*var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database: 'flappy_scores'
});*/



var a = 1;
app.get("/", function(request, response) {
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    
        client.query('INSERT INTO scores (name,score) VALUES ($1,$2) RETURNING (id, name, score)', ['Working?', 101], function(err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log('row inserted with id: ' + JSON.stringify(result));
            }
            done();
        });
        
    });
    /*client.query('INSERT INTO scores (name, score) VALUES ($1, $2)', ['Antoan1', 123], function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log('row inserted with id: ' + JSON.stringify(result));
        }
        
    });*/
    
    response.send("gotcha!");
});

app.get(/^\/users\/(\w{3,})\/score\/(\d+)$/, function(request, response) {
    /*var user  = { name: connection.escape(request.params[0]), score: connection.escape(request.params[1]) };
    var query = connection.query('INSERT INTO scores SET ?', user, function(err, result) {
      if (err) throw err;
        
        result.user = user;
        response.send(result);
    });*/
});

app.listen(5432, function() {
    console.log("listening to port 5432 too!");
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});