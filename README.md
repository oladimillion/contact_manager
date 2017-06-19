This is a CONTACT MANAGER app.

To use this app, make sure NODE is installed on your machine

NOTE: "To make use of text message feature of this app,
secret.API_KEY and secret.USERNAME" in lib/smslib.js 
should be replaced with your own API_KEY and USERNAME 
(visit http://www.africastalking.com for detail)


(the following command should be run without quote)

RUN "npm install" to install the dependencies
RUN "node contact" to start the app


To use the app, run the following commnads:

add -n <firstname> <lastname> -p <phone number>            - TO ADD CONTACT
eg. add -n Oladimeji Akande -p +2348138002701 

search <name>                                              - TO RETREIVE CONTACT INFO
where name can be lastname or firtname
eg. search Oladimeji

text <firstname> -m <\"message\">                           - TO SEND TEXT MESSAGE
eg. text James -m "We meet at Hogwarts, 3 PM, Anthony"

delete <firstname> <lastname>                              - TO DELETE CONTACT

Press Ctrl + C                                             - TO QUIT THE APP




