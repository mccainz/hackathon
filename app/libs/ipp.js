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
var PARTITION_ID = "6055908c-4192-4e2c-bbdc-8526d8d8de4b";

var LOAN_APPLICATION_MODEL = "NewAccount";
var LOAN_APPLICATION_PROCESS = "NewAccount";

var DOCUMENT_ADD_MODEL = "DocumentAdd";
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
        // console.log("complete");
    })
    .on('success', function(data, response) {

        // parse piOID from response
        // sample response: https://www.infinity.com/iod72-0/services/rest/engine/processes/Process1?piOID=679&stardust-bpm-partition=6055908c-4192-4e2c-bbdc-8526d8d8de4&stardust-bpm-model=Model
        var regex = /piOID=([0-9]+)&?/;
        var results = regex.exec(response.rawEncoded);

        processInstanceOID = results[1];
        console.log("Started processInstanceOID: " + processInstanceOID);
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
            '<FormalParameter_4 xmlns="http://www.w3.org/2001/XMLSchema">{base64Content}</FormalParameter_4>' + 
            '</Args>';
    payload = payload.replace("{processInstanceOID}", processInstanceOID);
    payload = payload.replace("{fileName}", documentInfo.fileName);
    payload = payload.replace("{base64Content}", documentInfo.base64Content);
    
    rest.post(url, {
      username: IPP_USER,
      password: IPP_PASSWORD,
      data: payload,
      headers: { 
        'Content-Type': CONTENT_TYPE
      }
    }).on('complete', function(result, response) {
        // console.log("complete");
    })
    .on('success', function(data, response) {

        // parse piOID from response
        // sample response: https://www.infinity.com/iod72-0/services/rest/engine/processes/Process1?piOID=679&stardust-bpm-partition=6055908c-4192-4e2c-bbdc-8526d8d8de4&stardust-bpm-model=Model
        var regex = /piOID=([0-9]+)&?/;
        var results = regex.exec(response.rawEncoded);
        
        processInstanceOID = results[1];
        console.log("Started processInstanceOID: " + processInstanceOID);
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
