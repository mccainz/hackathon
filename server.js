var ipp = require('./app/libs/ipp');
var phone = require('./app/libs/phone');
var db = require('./app/libs/db');

var rest = require('restler');

var express = require('express'),
    app = express();
    
app.use(express.logger());
app.use('/',express.static(__dirname+'/app/public'));
app.listen(process.env.PORT);
console.log('Express server started on port %s', process.env.PORT);

app.get('/loan/start', function(req, res) {

    var processInstanceOID = ipp.startLoanApplicationProcess({});
    console.log("processInstanceOID: " + processInstanceOID);
    
    res.send("fini");
});

app.get('/loan/approve', function(req, res) {
    
    // TODO: Approve the loan in IPP
    var destination = req.query.dest;
    var msg="Loan Approved!"
    phone.sendSMS(destination,msg);
    res.send("fini");
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
    console.log(destination);
    phone.joinNumberToConference(destination);
    
    res.send('<html><body><h1>Hello Phone Call</h1></body></html>');
});

app.get('/phone/recordingCallback', function(req, res){
    
    console.log(req.query.RecordingUrl);

    // Transcribe the received audio URL
    phone.transcribeAudio(req.query.RecordingUrl);
    
    var response = "<Response></Response>";

    res.type('text/xml');
    res.send(response.toString());
});

/*var getBinaryContentAsBase64 = function (url, callback) {
    // Required 'request' module
    var request = require('request');

    // Make request to our image url
    request({url: url, encoding: null}, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            // So as encoding set to null then request body became Buffer object
            var base64String = body.toString('base64');
            if (typeof callback == 'function') {
                callback(base64String);
            }
        } else {
            throw new Error('Can not download image');
        }
    });
};

getBinaryContentAsBase64(audioUrl, function (base64String) {
    console.log(base64String);
});
*/

app.get('/phone/transcribeCallback', function(req, res) {
    
    var status = req.query.TranscriptionStatus;
    console.log("Transcription Callback: " + status)
    
    if (status == "completed") {
        var base64String = "";

        // Get transcription text
        var transcriptionText = req.query.TranscriptionText; // "Test 1234";
        console.log("Transcription Callback: " + transcriptionText);
        
        // Get audio URL
        var audioUrl = req.query.AudioUrl; // "https://api.twilio.com/2010-04-01/Accounts/AC91c7a46e6f657e3f6c29a725d8f12d98/Recordings/REea4efe4e808828795364d314d82aa2e6.mp3";
        console.log("Audio URL: " + audioUrl);

        // Get other transcription attributes
        var sid = req.query.sid;
        var date_created = req.query.date_created;
        var duration = req.query.duration;
        var uri = req.query.uri;


        // Get base64 encoded transcription text
        base64String = new Buffer(transcriptionText).toString('base64');
        console.log(base64String); // "SGVsbG8gMTIz"

        // Get base64 encoded audio file
        rest.get(audioUrl, {
            decoding: "buffer",
        }).on('complete', function(data) {
            base64String = data.toString('base64');
            console.log(base64String);
        });
        
        // Send both files to IPP
        /*var processInstanceOid = 674;
        var documentInfo = {
            "fileName": "recording.mp3"
            "base64Content": base64String
        };
        
        var documentId = ipp.addDocumentToProcess(processInstanceOid, documentInfo);
        console.log("documentId: " + documentId);*/

        // Send Transcription text to Mongo
        var transcriptionEntry = {
            "sid": sid,
            "date_created": date_created,
            "audio_url": audioUrl,
            "transcription_text": transcriptionText,
            "duration": duration,
            "uri": uri
        };
        
        db.init();
        db.createTranscription(transcriptionEntry);
    }
    
    res.send('<html><body><h1>Hello Phone Transcribe Callback</h1></body></html>');
});

// Test methods for debugging

app.get('/test/hello', function(req, res){
    res.send('<html><body><h1>Hello World</h1></body></html>');
});

app.get('/test/db', function(req, res){
    
    var sample = {
        "sid": "a",
        "date_created": "b",
        "audio_url": "c",
        "transcription_text": "d",
        "duration": "e",
        "uri": "f"
    };
    
    db.init();
    db.createTranscription(sample);
    
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

