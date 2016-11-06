var express = require('express');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var app = express();

//Mount dependencies
app.use(express.static(__dirname+'/'));

/** Get cheapest domestic destinations **/
app.get('/api/v1/rest/domestic/:originCity', function (req, res) {
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", 'http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/US/USD/en-UK/'+req.params.originCity+'/US/anytime/anytime?apiKey=prtl6749387986743898559646983194', false ); // false for synchronous request
    xmlHttp.send( null );
    res.send(xmlHttp.responseText);
});

/** Get cheapest international destinations **/
app.get('/api/v1/rest/international/:originCity', function (req, res) {
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", 'http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/US/USD/en-UK/'+req.params.originCity+'/anywhere/anytime/anytime?apiKey=prtl6749387986743898559646983194', false ); // false for synchronous request
    xmlHttp.send( null );
    res.send(xmlHttp.responseText);
});

/** Get price grid for specified inbound and outbound month **/
app.get('/api/v1/rest/grid/:origin/:dest/:outboundMonth/:inboundMonth', function (req, res) {
    console.log("makingthe call!!!!");
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", "http://partners.api.skyscanner.net/apiservices/browsegrid/v1.0/US/USD/en-UK/"+req.params.origin+"/"+req.params.dest+"/"+req.params.outboundMonth+"/"+req.params.inboundMonth+"?apiKey=prtl6749387986743898559646983194", false);
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