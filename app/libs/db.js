var mongoose = require ("mongoose");

var Transcription = null;

var init = function() {
    var uristring = "mongodb://test:test@ds047198.mongolab.com:47198/game";

    // Makes connection asynchronously.  Mongoose will queue up database
    // operations and release them when the connection is complete.
    mongoose.connect(uristring, function (err, res) {
        if (err) {
            console.log ('ERROR connecting to: ' + uristring + '. ' + err);
        } else {
            console.log ('Succeeded connected to: ' + uristring);
        }
    });
    
    var transcriptionSchema = new mongoose.Schema({
        sid: {type: String},
        date_created: {type: String},
        audio_url: { type: String},
        transcription_text: { type: String},
        duration: { type: String},
        uri: { type: String}
    });
    
    // Compiles the schema into a model, opening (or creating, if
    // nonexistent) the 'Transcriptions' collection in the MongoDB database
    Transcription = mongoose.model('Transcriptions', transcriptionSchema);
    
    // Clear out old data
    /*Transcription.remove({}, function(err) {
      if (err) {
        console.log ('error deleting old data.');
      }
    });*/
}

var createTranscription = function(data) {
    // Creating one transcription
    var transcription = new Transcription (data);
    
    // Saving it to the database.  
    transcription.save(function (err) {if (err) console.log ('Error on save!')});
}

module.exports.init = init;
module.exports.createTranscription = createTranscription;
