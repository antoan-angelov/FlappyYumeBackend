var express = require('express');
var app = express();
var pg = require("pg");
var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 3000));
app.use(bodyParser.json());

var islocal = false;
var conString = "postgres://postgres:fl4ppysc0r3@localhost:5432/flappy_backend";
var databaseUrl = islocal ? conString : process.env.DATABASE_URL;

app.get("/scores", function(request, response) {
    pg.connect(databaseUrl, function(err, client, done) {
        getHighestScores(done, client, response);
    });
});

app.post("/insert", function(request, response) {
    if(!request.body.name || !request.body.score) {
        response.send('{"error":"Required POST parameters name and score are missing.", "text":'+JSON.stringify(request.body)+'}');
        return;
    }    

    pg.connect(databaseUrl, function(err, client, done) {
    
        if(request.body.id) {
            client.query('SELECT * FROM scores WHERE id = $1', [ request.body.id ], function(err, result) {
            
                if (err) {
                    response.send(err);
                    done();
                }
                else {                
                    if(result.rows.length > 0) {
                        client.query('UPDATE scores SET score = $1 WHERE id = $2', [request.body.score, request.body.id], function(err, result) {
                            if (err) {
                                response.send(err);
                                done();
                            } else {
                                getHighestScores(done, client, response, request.body.id);
                            }
                        }); 
                    }
                    else {
                        insert(client, request, response, done);
                    }
                 }
            });
        }
        else {
            insert(client, request, response, done);
        }        
    });
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

function insert(client, request, response, done) {
    client.query('INSERT INTO scores (name,score) VALUES ($1,$2) RETURNING (id)', [request.body.name, request.body.score], function(err, result) {
        if (err) {
            response.send(err);
            done();
        } else {
            getHighestScores(done, client, response, result.rows[0].id);
        }
    }); 
}

function getHighestScores(done, client, response, insertId) {
    client.query("SELECT * FROM scores ORDER BY score DESC LIMIT 10", function(err, result){ 
        if (err) {
            response.send(err);
        } else {
        var obj = {"scores" : result.rows};
            if(insertId) {
                obj.insertId = insertId;
            }
            response.send(JSON.stringify(obj));
        }
        done();
    });
}

