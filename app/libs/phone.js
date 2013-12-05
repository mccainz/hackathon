/* 
    Module which exposes methods assisting with phone integration
*/

// Twilio configuration
// These vars are your accountSid and authToken from twilio.com/user/account
var TWILIO_ACCOUNT_SID = 'AC91c7a46e6f657e3f6c29a725d8f12d98';
var TWILIO_AUTH_TOKEN = '59ba3880b91e61ed8c546fc6414f19b5';

var TWILIO_APP_ID = 'AP08206680a85f3adb24bbe39c5dd1714a';
var TWILIO_FROM_NUMBER = '+12052386787';

var twilio = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Important!
// TODO: If obj.Capability(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN) is called on a twilio object that is 
// already initialized with (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN), strange errors result!
var twilioClient = require('twilio');

// TelApi configuration
var TelApiClient = require('telapi').client;

var TELAPI_ACCOUNT_SID = 'AC91c7a46e6f657e3f6c29a725d8f12d98';
var TELAPI_AUTH_TOKEN = '59ba3880b91e61ed8c546fc6414f19b5';
var telApiClient = new TelApiClient(TELAPI_ACCOUNT_SID, TELAPI_AUTH_TOKEN);

var TRANSCRIBE_CALLBACK_URL = "/test/phone/transcribe/callback";
var TRANSCRIBE_CALLBACK_METHOD = "GET";

var getCapabilityToken = function() {
    var capability = new twilioClient.Capability(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    //This is a TwiML app SID configured with a voice URL
    //https://www.twilio.com/user/account/apps
    capability.allowClientOutgoing(TWILIO_APP_ID);
    
    return capability.generate();
}

var sendSMS = function(to, message) {
    
    //Send an SMS text message
    twilio.sendMessage({
        to: to, // Any number Twilio can deliver to
        from: TWILIO_FROM_NUMBER, // A number you bought from Twilio and can use for outbound communication
        body: message // Body of the SMS message
    },
    function(err, sms) { // This function is executed when a response is received from Twilio
    
        if (!err) { // "err" is an error received during the request, if any
            console.log("SMS SID: " + sms.sid);
        }
    });
}

var makeCall = function(number, url) {
    //Place a phone call, and respond with TwiML instructions from the given URL
    twilio.makeCall({
        to: number, // Any number Twilio can call
        from: TWILIO_FROM_NUMBER, // A number you bought from Twilio and can use for outbound communication
        url: 'http://twimlets.com/echo?Twiml=%3CResponse%3E%0A%20%20%20%20%3CSay%3EJoining%20a%20conference%20room%3C%2FSay%3E%0A%20%20%20%20%3CDial%3E%0A%20%20%20%20%20%20%20%20%3CConference%3EMyRoom%3C%2FConference%3E%0A%20%20%20%20%3C%2FDial%3E%0A%3C%2FResponse%3E&' // A URL that produces an XML document (TwiML) which contains instructions for the call

    }, function(err, responseData) {
    
        //executed when the call has been initiated.
        console.log(responseData.from);
    });
}

var transcribeAudio = function(audioURL) {
    telApiClient.create(
        'transcriptions',
        {
            AudioUrl: audioURL,
            TranscribeCallback: TRANSCRIBE_CALLBACK_URL,
            CallbackMethod: TRANSCRIBE_CALLBACK_METHOD
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
module.exports.makeCall = makeCall;
module.exports.transcribeAudio = transcribeAudio;
module.exports.getCapabilityToken = getCapabilityToken;
