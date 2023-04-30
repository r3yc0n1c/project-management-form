var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var projectDBName = "COLLEGE-DB";
var projectRelationName = "PROJECT-TABLE";
var connToken = 'XXXXXXXX|-XXXXXXXXXXXXXXXXX|XXXXXXXX';


$("#project-id").focus();

function saveRecNo2LS(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getProIdAsJsonObj(){
    var proid = $("#project-id").val();
    var jsonStr = {
        id: proid
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#project-name").val(record.name);
    $("#assigned-to").val(record.assigned);
    $("#assignment-date").val(record.date);
    $("#deadline").val(record.deadline);
}

function resetForm(){
    $("#project-id").val("");
    $("#project-name").val("");
    $("#assigned-to").val("");
    $("#assignment-date").val("");
    $("#deadline").val("");
    $("#project-id").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#project-id").focus();
}

function validateData(){
    var proid, proname, proass, prodate, prodead;
    proid = $("#project-id").val();
    proname = $("#project-name").val();
    proass = $("#assigned-to").val();
    prodate = $("#assignment-date").val();
    prodead = $("#deadline").val();

    if(proid === " "){
        alert("Project ID is missing");
        $("#project-id").focus();
        return "";
    }

    if(proname === " "){
        alert("Project Name is missing");
        $("#project-name").focus();
        return "";
    }

    if(proass === " "){
        alert("Assigned To is missing");
        $("#assigned-to").focus();
        return "";
    }

    if(prodate === " "){
        alert("Assignment Date is missing");
        $("#assignment-date").focus();
        return "";
    }

    if(prodead === " "){
        alert("Deadline is missing");
        $("#deadline").focus();
        return "";
    }

    var jsonStrObj = {
        id: proid,
        name: proname,
        assigned: proass,
        date: prodate,
        deadline: prodead
    };
    return JSON.stringify(jsonStrObj);
}

function getPro(){
    var proIdJsonObj = getProIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, projectDBName, projectRelationName, proIdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    console.log(resJsonObj);
    jQuery.ajaxSetup({async: true});
    if(resJsonObj.status === 400){
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#project-name").focus();
    }
    else if(resJsonObj.status === 200){
        $("#project-id").prop("disabled", true);
        fillData(resJsonObj);
        $("#change").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#project-name").focus();
    }
}

function saveData(){
    var jsonStrObj = validateData();
    if(jsonStrObj === " "){
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, projectDBName, projectRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    alert("Project saved!");
    resetForm();
    $("#project-id").focus();
}

function changeData(){
    $("#change").prop("disabled", true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, projectDBName, projectRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    alert("Project data changed!");
    resetForm();
    $("#project-id").focus();
}