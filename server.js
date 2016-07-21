var express = require('express');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var app = express();

//Mount dependencies
app.use(express.static(__dirname+'/'));

//Handle API calls
app.get('/api/v1/rest/:originCity/:departureDate/:returnDate', function (req, res) {
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", 'http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/US/USD/en-UK/'+req.params.originCity+'/anywhere/'+req.params.departureDate+'/'+req.params.returnDate+'?apiKey=ni166031138540314211499189868863', false ); // false for synchronous request
    xmlHttp.send( null );
    res.send(xmlHttp.responseText);
});

//Route everything else to AngularJS frontend
app.get('/*',function(req,res){
	res.sendFile(__dirname+'/app/index.html');
});

app.listen(3000, function () {
  console.log('Letsgetaway app started on port 3000');
});