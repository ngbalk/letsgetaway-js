var express = require('express');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var app = express();

//Mount dependencies
app.use(express.static(__dirname+'/'));

//Handle API calls
app.get('/api/v1/rest/domestic/:originCity', function (req, res) {
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", 'http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/US/USD/en-UK/'+req.params.originCity+'/US/anytime/anytime?apiKey=prtl6749387986743898559646983194', false ); // false for synchronous request
    xmlHttp.send( null );
    res.send(xmlHttp.responseText);
});

app.get('/api/v1/rest/international/:originCity', function (req, res) {
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", 'http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/US/USD/en-UK/'+req.params.originCity+'/anywhere/anytime/anytime?apiKey=prtl6749387986743898559646983194', false ); // false for synchronous request
    xmlHttp.send( null );
    res.send(xmlHttp.responseText);
});

//Route everything else to AngularJS frontend
app.get('/*',function(req,res){
	res.sendFile(__dirname+'/app/index.html');
});

port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
ip = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";

app.listen(port, ip, function () {
  console.log('Letsgetaway app started on port 8080');
});