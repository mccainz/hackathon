var ipp = require('./app/libs/ipp');
var phone = require('./app/libs/phone');

var express = require('express'),
    app = express();
    
app.use(express.logger());
app.use('/',express.static(__dirname+'/app/public'));
app.listen(process.env.PORT);
console.log('Express server started on port %s', process.env.PORT);

app.get('/phone/capabilityToken', function(req, res) {
    res.send(phone.getCapabilityToken());
});

app.get('/phone/recordingCallback', function(req, res){
    console.log(req.query);
    console.log(req.query.RecordingUrl);
    
    var response = "<Response></Response>";

    res.type('text/xml');
    res.send(response.toString());
});

// Test methods for debugging

app.get('/hello', function(req, res){
    res.send('<html><body><h1>Hello World</h1></body></html>');
});

app.get('/test/ipp', function(req, res) {
    // var processInstanceOID = ipp.startLoanApplicationProcess({});
    // console.log("processInstanceOID: " + processInstanceOID);
    
    var processInstanceOid = 674;
    var documentInfo = {
            "fileName": "abc.txt"
    };
    
    var documentId = ipp.addDocumentToProcess(processInstanceOid, documentInfo);
    console.log("documentId: " + documentId);
    
    res.send('<html><body><h1>Hello IPP</h1></body></html>');
});

app.get('/test/phone/message', function(req, res) {
    
    phone.sendSMS("+12054820430", "Test 123");
    
    res.send('<html><body><h1>Hello Phone Message</h1></body></html>');
});

app.get('/test/phone/call', function(req, res) {
    var dest=req.query.number;
    console.log("Destination:" + dest);
    phone.makeCall(dest);
    
    res.send('<html><body><h1>Hello Phone Call</h1></body></html>');
});

app.get('/test/phone/transcribe', function(req, res) {
    
    phone.transcribeAudio("https://api.twilio.com/2010-04-01/Accounts/AC91c7a46e6f657e3f6c29a725d8f12d98/Recordings/REea4efe4e808828795364d314d82aa2e6");
    
    res.send('<html><body><h1>Hello Phone Transcribe</h1></body></html>');
});

app.get('/test/phone/transcribe/callback', function(req, res) {
    
    console.log("Transcription Callback: " + req.query.TranscriptionText)
    
    res.send('<html><body><h1>Hello Phone Transcribe Callback</h1></body></html>');
});
