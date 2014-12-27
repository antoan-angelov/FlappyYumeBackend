var express = require('express');
var app = express();
//var mysql      = require('mysql');

app.set('port', 5000);

/*var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database: 'flappy_scores'
});*/

app.get("/", function(request, response) {

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

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});