import urllib2
print urllib2.urlopen("http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/US/USD/en-UK/JFK/anywhere/2016-06-01/2016-06-30?apiKey=ni166031138540314211499189868863").read()
