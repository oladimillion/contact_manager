var secret = require("../env/env"); // secrets needed to communicate with africastalking api(http://www.africastalking.com)
var chalk = require("chalk");

var options = {
    sandbox: true, // true/false to use/not sandbox
    apiKey: secret.API_KEY,
    username: secret.USERNAME, 
    format: 'json' // or xml
};
var AfricasTalking = require('africastalking')(options);

var sms = AfricasTalking.SMS;

function SMSManager(phone, message, callback) {
    var opts = {
        to: phone,
        message: message
    };

    sms.send(opts)
        .then(function(success) {
            callback(success);
        })
        .catch(function(error) {
            // var err = { mess: "Message sending failed" };
            // callback(err);
            console.log("Message could not be sent\n");
        });
}

module.exports = SMSManager;