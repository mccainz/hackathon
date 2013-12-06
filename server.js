var ipp = require('./app/libs/ipp');
var phone = require('./app/libs/phone');

var express = require('express'),
    app = express();
    
app.use(express.logger());
app.use('/',express.static(__dirname+'/app/public'));
app.listen(process.env.PORT);
console.log('Express server started on port %s', process.env.PORT);

app.get('/loan/start', function(req, res) {
    
    // var processInstanceOID = ipp.startLoanApplicationProcess({});
    // console.log("processInstanceOID: " + processInstanceOID);
});

app.get('/loan/approve', function(req, res) {
    
    // TODO: Approve the loan in IPP
});

app.get('/phone/capabilityToken', function(req, res) {
    
    res.send(phone.getCapabilityToken());
});

app.get('/phone/message', function(req, res) {
    
    var destination = req.query.dest;
    var message = req.query.message;
    
    phone.sendSMS(destination, message);
});

app.get('/phone/call', function(req, res) {
    
    var destination = req.query.number;
    phone.joinNumberToConference(destination);
    
    res.send('<html><body><h1>Hello Phone Call</h1></body></html>');
});

app.get('/phone/recordingCallback', function(req, res){
    
    console.log(req.query);
    console.log(req.query.RecordingUrl);

    // Transcribe the received audio URL
    phone.transcribeAudio(req.query.RecordingUrl);
    
    var response = "<Response></Response>";

    res.type('text/xml');
    res.send(response.toString());
});

app.get('/phone/transcribeCallback', function(req, res) {
    
    var status = req.query.TranscriptionStatus;
    console.log("Transcription Callback: " + status)
    
    if (status == "completed") {
        // Get transcription text
        console.log("Transcription Callback: " + req.query.TranscriptionText);

        // Get audio URL
        console.log("Audio URL: " + req.query.AudioURL);

        // Send both files to IPP
        /*var processInstanceOid = 674;
        var documentInfo = {
                "fileName": "abc.txt"
        };
        
        var documentId = ipp.addDocumentToProcess(processInstanceOid, documentInfo);
        console.log("documentId: " + documentId);*/

        // Send both files to Mongo
    }
    
    res.send('<html><body><h1>Hello Phone Transcribe Callback</h1></body></html>');
});

// Test methods for debugging

app.get('/test/hello', function(req, res){
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

app.get('/test/phone/transcribe', function(req, res) {
    
    phone.transcribeAudio("https://api.twilio.com/2010-04-01/Accounts/AC91c7a46e6f657e3f6c29a725d8f12d98/Recordings/REea4efe4e808828795364d314d82aa2e6");
    
    res.send('<html><body><h1>Hello Phone Transcribe</h1></body></html>');
});

