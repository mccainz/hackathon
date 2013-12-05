var ipp = require('./app/libs/ipp');

var express = require('express'),
    app = express();
    
app.use(express.logger());
app.use('/',express.static(__dirname+'/app/public'));
app.listen(process.env.PORT);
console.log('Express server started on port %s', process.env.PORT);

app.get('/hello', function(req, res){
    res.send('<html><body><h1>Hello World</h1></body></html>');
});


app.get('/ippTest', function(req, res) {
    // var processInstanceOID = ipp.startLoanApplicationProcess({});
    // console.log("processInstanceOID: " + processInstanceOID);
    
    var processInstanceOid = 674;
    var documentInfo = {
            "fileName": "abc.txt"
    };
    
    var documentId = ipp.addDocumentToProcess(processInstanceOid, documentInfo);
    console.log("documentId: " + documentId);
    
    var body = 'Hello World';
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Length', body.length);
    res.end(body);
});