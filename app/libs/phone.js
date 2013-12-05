/* 
    Module which exposes methods assisting with phone integration
*/

// These vars are your accountSid and authToken from twilio.com/user/account
var accountSid = 'AC91c7a46e6f657e3f6c29a725d8f12d98';
var authToken = '59ba3880b91e61ed8c546fc6414f19b5';
var twilio = require('twilio')(accountSid, authToken);

var TelApiClient = require('telapi').client;
var telApiClient = new TelApiClient(
    'AC949c7dbca39d4687818b304e15a0ee41', 
    '6d849366b4f84d60990e4c1cd2828096'
);

var sendSMS = function(to, message) {
    
    //Send an SMS text message
    twilio.sendMessage({
        to: to, // Any number Twilio can deliver to
        from: '+12052386787', // A number you bought from Twilio and can use for outbound communication
        body: message // Body of the SMS message
    },
    function(err, sms) { // This function is executed when a response is received from Twilio
    
        if (!err) { // "err" is an error received during the request, if any
            console.log("SMS SID: " + sms.sid);
        }
    });
}

var transcribeAudio = function(audioURL) {
    telApiClient.create(
        'transcriptions',
        {
            AudioUrl: audioURL,
            TranscribeCallback: "https://hackathon-local-c9-nair_anoop.c9.io/test/phone/transcribe/callback",
            CallbackMethod: "GET"
        },
        function(response) {
            console.log("Transcription SID: " + response.sid);
        },
        function(error) {
            console.log("Error: " + error)
        }
    );
}

module.exports.sendSMS = sendSMS;
module.exports.transcribeAudio = transcribeAudio;
