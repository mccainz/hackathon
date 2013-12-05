/* 
    Module which exposes methods assisting with IPP integration
*/
var rest = require('restler');

// IPP REST invocation parameters
var IPP_BASE_URL = "https://www.infinity.com";
var IPP_ENGINE_REST_URL = "/iod72-0/services/rest/engine";
var IPP_START_PROCESS_REST_URL = "/processes/{processId}";
var IPP_REST_QUERY_PARAMETERS = "stardust-bpm-partition={partitionId}&stardust-bpm-model={modelId}";

var CONTENT_TYPE = "application/xml";

var IPP_USER = "motu";
var IPP_PASSWORD = "motu";

// IOD solution parameters
var PARTITION_ID = "fcd8e808-fb63-465d-8e7a-1a772c6ece2c";

var LOAN_APPLICATION_MODEL = "Model";
var LOAN_APPLICATION_PROCESS = "Process1";

var DOCUMENT_ADD_MODEL = "DocumentAddTest";
var DOCUMENT_ADD_PROCESS = "AddDocument";

var startLoanApplicationProcess = function(data) {
    var processInstanceOID = 0;
    
    var url = IPP_BASE_URL + IPP_ENGINE_REST_URL + IPP_START_PROCESS_REST_URL + "?" + IPP_REST_QUERY_PARAMETERS;
    url = url.replace("{partitionId}", PARTITION_ID);
    url = url.replace("{processId}", LOAN_APPLICATION_PROCESS);
    url = url.replace("{modelId}", LOAN_APPLICATION_MODEL);
    
    console.log("URL: " + url);
    
    var payload = '<Args></Args>';
    
    rest.post(url, {
      username: IPP_USER,
      password: IPP_PASSWORD,
      data: payload,
      headers: { 
        'Content-Type': CONTENT_TYPE
      }
    }).on('complete', function(result, response) {
        console.log("complete");
    })
    .on('success', function(data, response) {
        console.log("success");

        // parse piOID from response
        // sample response: https://www.infinity.com/iod72-0/services/rest/engine/processes/Process1?piOID=679&stardust-bpm-partition=fcd8e808-fb63-465d-8e7a-1a772c6ece2c&stardust-bpm-model=Model
        var regex = /piOID=([0-9]+)&?/;
        var results = regex.exec(response.rawEncoded);
        console.log("regex results" + results[1]);
        
        processInstanceOID = results[1];
    })
    .on('fail', function(data, response) {
        console.log("fail");
        console.log(data);
        console.log(response.statusCode);
        console.log(response.rawEncoded);
    })
    .on('error', function(data, response) {
        console.log("error");
    });
    
    
    // TODO: Need to use deferreds (e.g. Futures(https://github.com/coolaj86/futures) or Step(https://github.com/creationix/step)) as rest.post is asynchronous
    return processInstanceOID;
}

var addDocumentToProcess = function(processInstanceOID, documentInfo) {
    var documentId = "";
    
    var url = IPP_BASE_URL + IPP_ENGINE_REST_URL + IPP_START_PROCESS_REST_URL + "?" + IPP_REST_QUERY_PARAMETERS;
    url = url.replace("{partitionId}", PARTITION_ID);
    url = url.replace("{processId}", DOCUMENT_ADD_PROCESS);
    url = url.replace("{modelId}", DOCUMENT_ADD_MODEL);
    
    console.log("URL: " + url);
    
    var payload = 
            '<Args xmlns="http://eclipse.org/stardust/rest/v2012a/types">' + 
            '<FormalParameter_1 xmlns="http://www.w3.org/2001/XMLSchema">{processInstanceOID}</FormalParameter_1>' + 
            '<FormalParameter_2 xmlns="http://www.w3.org/2001/XMLSchema">{fileName}</FormalParameter_2>' + 
            '</Args>';
    payload = payload.replace("{processInstanceOID}", processInstanceOID);
    payload = payload.replace("{fileName}", documentInfo.fileName);
    
    rest.post(url, {
      username: IPP_USER,
      password: IPP_PASSWORD,
      data: payload,
      headers: { 
        'Content-Type': CONTENT_TYPE
      }
    }).on('complete', function(result, response) {
        console.log("complete");
    })
    .on('success', function(data, response) {
        console.log("success");

        // parse piOID from response
        // sample response: https://www.infinity.com/iod72-0/services/rest/engine/processes/Process1?piOID=679&stardust-bpm-partition=fcd8e808-fb63-465d-8e7a-1a772c6ece2c&stardust-bpm-model=Model
        var regex = /piOID=([0-9]+)&?/;
        var results = regex.exec(response.rawEncoded);
        console.log("regex results" + results[1]);
        
        console.log(results[1]);
    })
    .on('fail', function(data, response) {
        console.log("fail");
        console.log(data);
        console.log(response.statusCode);
        console.log(response.rawEncoded);
    })
    .on('error', function(data, response) {
        console.log("error");
    });
    
    
    // TODO: Need to use deferreds (e.g. Futures(https://github.com/coolaj86/futures) or Step(https://github.com/creationix/step)) as rest.post is asynchronous
    return documentId;
}

module.exports.startLoanApplicationProcess = startLoanApplicationProcess;
module.exports.addDocumentToProcess = addDocumentToProcess;
