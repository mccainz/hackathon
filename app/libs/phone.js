/* 
    Module which exposes methods assisting with phone integration
*/

// var BASE_URL = "https://hackathon-local-c9-nair_anoop.c9.io";
var BASE_URL = "http://np-compete.herokuapp.com";

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

var TELAPI_ACCOUNT_SID = 'AC949c7dbca39d4687818b304e15a0ee41';
var TELAPI_AUTH_TOKEN = '6d849366b4f84d60990e4c1cd2828096';

var telApiClient = new TelApiClient(TELAPI_ACCOUNT_SID, TELAPI_AUTH_TOKEN);

var TRANSCRIBE_CALLBACK_URL = BASE_URL + "/phone/transcribeCallback";
var TRANSCRIBE_CALLBACK_METHOD = "GET";

var TWIMLETS_ECHO_BASE_URL = "http://twimlets.com/echo?Twiml=";

var getCapabilityToken = function() {
    var capability = new twilioClient.Capability(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    capability.allowClientIncoming('jenny');

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

var joinNumberToConference = function(number, url) {
    
    // A URL that produces an XML document (TwiML) which contains instructions for the call
    var twimlResponse = 
        '<Response>' +
        	'<Say voice="alice" language="en-GB">Thank you for joining the conference.</Say>' +
        	'<Dial record="true" action="{BASE_URL}/phone/recordingCallback" method="GET">' +
        		'<Conference>MyRoom</Conference>' +
        	'</Dial>' +
        '</Response>';
    twimlResponse = twimlResponse.replace("{BASE_URL}", BASE_URL);
    
    var callUrl = TWIMLETS_ECHO_BASE_URL + encodeURIComponent(twimlResponse);
    console.log("Call URL: " + callUrl);
    
    //Place a phone call, and respond with TwiML instructions from the given URL
    twilio.makeCall({
        to: number, // Any number Twilio can call
        from: TWILIO_FROM_NUMBER, // A number you bought from Twilio and can use for outbound communication
        url: callUrl

    }, function(err, responseData) {
        //executed when the call has been initiated.
        if(!err){
            console.log(responseData.from);
        }
        else{
            console.log(err);
        }
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
            console.log("Error: " + error);
        }
    );
}

module.exports.sendSMS = sendSMS;
module.exports.joinNumberToConference = joinNumberToConference;
module.exports.transcribeAudio = transcribeAudio;
module.exports.getCapabilityToken = getCapabilityToken;
