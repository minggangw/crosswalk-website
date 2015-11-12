
/* jslint browser: true */
/* global $, jQuery, alert, confirm */

var goodImage = false;

function checkUrl(value) {
    return (/^((http(s)?):\/\/)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value));
}

function onStoreUrlBlur(input) {
    input.value = input.value.trim();    

    //when exiting field, if invalid change font to red, else default color
    input.style.color = (input.value && !checkUrl(input.value) ? "red" : '');

    // update tooltip (title) in preview
    $('#pvwImg').attr("title", "On click URL: " + (input.value ? input.value : "<App store URL>"));
}

function onAppNameChange(input) {
    $('#pvwLabel').text (input.value ? input.value : "Application Name");
}

// Load icon image when image selected and show in template
function onImgSelect(input) {
    "use strict";
    // Check file size!/Full file API support.
    var fileApiSupported = (window.FileReader && window.File && window.FileList && window.Blob);
    if (!fileApiSupported) {
        $('#pvwImg').attr('src', "/assets/apps/no-file-api.jpg");
        goodImage = true;  //just guess since we can't get more details
        return;
    }
    
    //make sure it is an image format
    if (input.files.length !== 1 ||
        !(input.files[0].type.match('image.*'))) {
        alert("The file selected was not an image");
        goodImage = false;
        input.style.color = "red";
        return;
    }
    //check size (limit 1MB, should be ~4K)
    if (input.files[0].size > 1000000) {
        alert("The image file is too large. Limit 1MB. 300x300px recommended dimensions.");
        goodImage = false;
        input.style.color = "red";
        return;
    }
    //load preview window
    var reader = new FileReader();
    reader.onload = function (e) {
        $('#pvwImg').attr('src', e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
    input.style.color = "black";
    goodImage = true;
}

function onAuthorChange(input) {
    $('#pvwAuthor').text (input.value ? input.value : "Author");
}

function onAuthorUrlBlur(input) {
    input.value = input.value.trim();    

    //when exiting field, if invalid change font to red, else default color
    input.style.color = (input.value && !checkUrl(input.value) ? "red" : '');

    // update tooltip (title) in preview
    $('#pvwAuthor').attr("title", "On click URL: " + (input.value ? input.value : "<Author URL>"));
}

function onPublishDateChange(input) {
    $('#pvwPublishDate').text ("Published: " + getDateEst(input.value));
}

function onDownloadsChange(input) {
    input.value = input.value.trim();
    $('#pvwDownloads').text ("Downloads: " + getNumEst(input.value));
}

function onDownloadsBlur(input) {
    var numValid = (/^(\d+|\d{1,3}(,\d{3})*)(\.\d+)?$/i.test(input.value));

    //when exiting field, if invalid change font to red, else default color
    input.style.color = (input.value && !numValid ? "red" : '');
}

function onPriceBlur(input) {
    var numValid = (/^\d+(\.\d{2}){0,1}$/i.test(input.value));

    //when exiting field, if invalid change font to red, else default color
    input.style.color = (input.value && !numValid ? "red" : '');
}  

function onSizeBlur(input) {
    var numValid = (/^\d+$/i.test(input.value));

    //when exiting field, if invalid change font to red, else default color
    input.style.color = (input.value && !numValid ? "red" : '');
}  


//update all preview fields (only called when page loaded)
function onPageLoad() {
    $('html,body').animate({scrollTop:0},0); //for both result page or form error

    // empty all fields
    $('#appSubmitForm').trigger("reset");

    // set url fields' font color to default color on focus 
    $(':input').not(':button, :submit, :reset, :hidden, :checkbox, :radio').focus(function() {
        $(this).css('color','');
    });

    // init jquery popup calendar object
    $("#publishDate").datepicker();

    //load preview 
    onStoreUrlBlur (document.getElementById("storeUrl"));
    onAppNameChange (document.getElementById("name"));
    onAuthorChange (document.getElementById("author"));
    onAuthorUrlBlur (document.getElementById("authorUrl"));

    onPublishDateChange (document.getElementById("publishDate"));
    onDownloadsChange (document.getElementById("downloads"));
}

// If an error occurs, the user can return to their form
// without losing all their entries via this function
function showFormDiv() {
    $('html,body').animate({scrollTop:0},0);
    $("#appSubmitPage").css("display","block");
    $("#appResultDiv").css("display","none");
}

//--------- App Insert into DB from form ---------------

function validateForm() {
    var url = $('input[name=storeUrl]').val();
    if (url && !checkUrl(url)) {
        if (!confirm ("The App Store URL does not appear to be a valid website. " + 
                     "Do you want to continue anyway?")) {
            return false;
        }
    }
    //double-check values
    if ($('#name').val()   === '' || $('#imageFile').val() === '' ||
        $('#author').val() === '' || $('#email').val() === '') {
        alert ("Error: One or more required fields were empty or not the correct format.");
        return false;
    }
    if (!goodImage) {
        $('input[name=imageFile]').focus();
        alert ("Please select a valid icon image for your application.");
        return false;
    }
    if ($('input[name=price]').val() > 200) {
        alert ("You wish! Maximum price allowed is $200.");
        return;
    }
    url = $('input[name=authorUrl]').val();
    if (url && !checkUrl(url)) {
        if (!confirm ("The Author URL does not appear to be a valid website. " + 
                     "Do you want to continue anyway?")) {
            return false;
        }
    }
    return true;
}

function showTermsDialog() {
    $("#appTermsDlg").dialog("open");
}


function onFormSubmit(e) {
    e.stopPropagation(); // Stop stuff happening
    e.preventDefault(); //Prevent Default action. 

    if (!validateForm()) {
        return;
    }

    // spinner: $("#multi-msg").html("<img src='loading.gif'/>");
    var formObj = $(this);
    var formURL = formObj.attr("action");

    if (window.FormData === undefined) {  // for HTML5 browsers
        alert ("This browser does not support the form upload feature. Please use a newer browser.");
        return;
    }

    var formData = new FormData(this);

    $.ajax({
        url: formURL,
        type: 'POST',
        data:  formData,
        mimeType:"multipart/form-data",
        cache: false,
        contentType: false,
        processData:false,
        success: function(data, textStatus, jqXHR) {
            if (typeof data.error == 'undefined') {
                $("#appSubmitResult").html(data);
            } else {
                $("#appSubmitResult").html('An error occured during form submission. ' + data.error);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $("#appSubmitResult").html('The AJAX Request Failed. ' + errorThrown);
        }          
    });

    $('html,body').animate({scrollTop:0},0);
    $("#appSubmitPage").css("display","none");
    $("#appResultDiv").css("display","block");
}

$(document).ready(function()
{
    onPageLoad();

    //setup jquery modal dialog to show Terms and Conditions 
    $("#appTermsDlg").dialog({
        autoOpen: false, modal: true, resizable: false, 
        dialogClass: "appTermsDlg",

        width: '70%',
        autoResize:true,
        position: {
            my: "center", 
            at: "center", 
            of: window
        }
    }).prev(".ui-dialog-titlebar").addClass("appTermsDlgTitle");

    //Callback handler for form submit event
    $(".appSubmitForm").submit(onFormSubmit);
});

