var inquirer = require('inquirer');
var chalk = require('chalk');
var model = require('../model/models');
var SMSManager = require("./smslib");

var initialize = model.init;
var insertData = model.insert;
var fetchLastnameData = model.fetchlastname;
var fetchFirstnameData = model.fetchfirstname;
var fetchFLData = model.fetchfldata;
var deleteData = model.deletedata;
var closeDB = model.close;


var sm = false; // send message
var sms = "" // text message to be sent


function SendMessage(name, phone) {

    SMSManager(phone, sms, function(result) {
        console.log(result);
    });

    sms = "";
    sm = false;
    console.log();
}

// gets phone no from db using fname and lname
function Which(array, match, fl) {

    var question = [{
        type: 'input',
        name: 'index',
        message: 'Choose a contact: ',
        validate: function(value) {
            var pass = value.match(/^[\d]+$/);
            if (pass) {
                return true;
            } else {
                console.log("\n\nInvalid command");
                console.log("Choose a contact by entering its subscript value\n");
                return;
            }
        }
    }];

    inquirer.prompt(question).then(function(answers) {
        var value = "";
        value = answers.index;
        value = parseInt(value);

        console.log();
        // console.log(array[value - 1].phone);
        if (value <= 0 || value > array.length) {
            console.log();
            console.log("Invalid input!");
            console.log();

            Which(array, match, fl);

        } else {

            if (fl === "fn") {
                fetchFLData(array[value - 1].firstname, match, function(result) {


                    // console.log("Inside Which function");
                    console.log("Firstname: ", result[0].firstname);
                    console.log(" Lastname: ", result[0].lastname);
                    console.log(" Phone No: ", result[0].phone);

                    if (sm) {
                        SendMessage(match, result[0].phone);
                    }
                    console.log();

                    again();
                });

            } else if (fl === "ln") {
                fetchFLData(match, array[value - 1].lastname, function(result) {

                    // console.log("Inside Which function");
                    console.log("Firstname: ", result[0].firstname);
                    console.log(" Lastname: ", result[0].lastname);
                    console.log(" Phone No: ", result[0].phone);

                    if (sm) {
                        SendMessage(match, result[0].phone);
                    }
                    console.log();

                    again();
                });

            }
        }
    });

}

//fl -> firstnames and lastname
function SelectContact(match, result, fl) {

    if (result.length > 1) {
        var names = "";
        for (var i = 0; i < result.length; i++) {
            names += result[i].lastname + " [" + +(i + 1) + "]   ";
        }
        console.log("\nWhich " + match + "? " + names + "\n");

        Which(result, match, fl);

    } else if (result.length == 1) {
        console.log();
        console.log("Firstname: ", result[0].firstname);
        console.log(" Lastname: ", result[0].lastname);
        console.log(" Phone No: ", result[0].phone);

        console.log();

        if (sm) {
            SendMessage(match, result[0].phone);
        }
        console.log();
        again();

    } else {
        console.log();
        console.log(match, " does not exist!");
        console.log();

        if (sm) {
            sms = "";
            sm = false;
        }
        again();
    }
}

// filters user inputs
function Filter() {

    var question = [{
        type: 'input',
        name: 'command',
        message: 'Enter a commmand: ',
        validate: function(value) {
            var pass = value.match(/^[\s]*((add[\s]+-n[\s]+[A-Z][a-z]{2,}[\s]+[A-Z][a-z]{2,}[\s]+-p[\s]+[\+][0-9]{5,})|(search[\s]+[A-Z][a-z]{2,})|-h|--help|quit|(text[\s]+[A-Z][a-z]+[\s]+-m[\s]+.+)|(delete[\s]+[A-Z][a-z]+[\s]+[A-Z][a-z]{2,}))$/);
            if (pass) {
                return true;
            } else {
                console.log("\n\nInvalid command");
                console.log("Enter -h or --help   - TO GET HELP\n")
                return;
            }
        }
    }];

    inquirer.prompt(question).then(function(answers) {
        // console.log(answers);
        var value = "";
        value = answers.command;
        // console.log("value: ", value);
        var regex = /[\s]+/m;
        var valueArray = value.split(regex);

        // console.log(valueArray);

        if (valueArray[0] == "") {
            valueArray.shift();
        }

        // console.log(valueArray);

        if (valueArray[0] === "-h" || valueArray[0] === "--help") {
            console.log("\nHELP:\n\tadd -n <firstname> <lastname> -p <phone number>            - TO ADD CONTACT");
            console.log("\teg. add -n Oladimeji Akande -p +2348138002701 ");
            console.log("\tsearch <name> eg. search Oladimeji                         - TO RETREIVE CONTACT INFO");
            console.log("\ttext <firstname> -m <\"message\">                            - TO SEND TEXT MESSAGE");
            console.log("\teg. text James -m “We meet at Hogwarts, 3 PM, Anthony”");
            console.log("\tdelete <firstname> <lastname>                              - TO DELETE CONTACT");
            console.log("\tPress Ctrl + C                                             - TO QUIT THE APP\n");
            // console.log(answers);                                                  
            again();
        } else if (valueArray[0] == "delete") {

            fetchFLData(valueArray[2], valueArray[1], function(result) {
                // console.log(result);
                if (result.length === 0) {
                    console.log();
                    console.log("Contact does not exist!");
                    console.log();

                } else if (result[0].firstname === valueArray[2] && result[0].lastname === valueArray[1]) {
                    console.log();
                    deleteData(valueArray[2], valueArray[1], function(result) {
                        // console.log("result : ", result);
                        if (result.length === 0) {
                            console.log("Contact deleted!");
                            console.log();
                        } else {
                            console.log("Error Occured!");
                            console.log();
                        }
                    });

                }
                again();
            });

        } else if (valueArray[0] === "add") {
            // console.log(valueArray);
            fetchFLData(valueArray[3], valueArray[2], function(result) {
                if (result.length === 0) {
                    insertData(valueArray[2], valueArray[3], valueArray[5]);
                    console.log();
                    console.log("Contact added!");
                    console.log();

                } else if (result[0].firstname === valueArray[3] && result[0].lastname === valueArray[2]) {
                    console.log();
                    console.log("Contact exists already!");
                    console.log();
                }
                again();
            });


        } else if (valueArray[0] == "text") {
            // console.log("sending sms");
            var receiverName = valueArray[1];
            var regex = /\".+/g;
            var regex2 = /[^\"]+/g;

            var message = regex.exec(value);

            sms = regex2.exec(message)[0];

            fetchLastnameData(receiverName, function(result) {
                if (result.length != 0) {
                    // console.log("inside lib :", result);
                    sm = true;
                    SelectContact(receiverName, result, "ln");

                } else {
                    fetchFirstnameData(receiverName, function(result) {
                        sm = true;
                        SelectContact(receiverName, result, "fn");
                    });

                }

            });


        } else if (valueArray[0] == "search") {
            var match = valueArray[1];

            fetchLastnameData(match, function(result) {
                if (result.length != 0) {
                    // console.log("inside lib :", result);
                    SelectContact(match, result, "ln");

                } else {
                    fetchFirstnameData(match, function(result) {
                        SelectContact(match, result, "fn");
                    });

                }

            });
        }
        // console.log(JSON.stringify(answers, null, '  '));
    });

}

function again() {
    setTimeout(Filter, 2000);
}

exports.main = function() {
    console.log();
    initialize();

    Filter();
}