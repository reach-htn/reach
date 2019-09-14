const functions = require('firebase-functions');
const wiki = require('./wiki');

MENU_MSG = `Valid commands:
* menu: show this menu
* wiki {page title} ["/" page number]: read Wikipedia pages`;

exports.sms = functions.https.onRequest(async (req, res) => {
  let command = req.query.Body.toLowerCase();
  let commandName = command.split(/\s+/)[0];
  
  sendit = (msg) => {
    res.send(`
    <?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Sms>${msg}</Sms>
    </Response>
    `);
  }
  
  switch (commandName) {
    case 'menu':
      sendit(MENU_MSG);
      break;
    case 'wiki':
      wiki.execute(command, sendit);
      break;
    default:
      sendit(`Unrecognized command.\n${MENU_MSG}`);
      break;
  }
  
});

// basic test function
exports.helloWorld = functions.https.onRequest(async (request, response) => {
 response.send(`<?xml version="1.0" encoding="UTF-8"?>
 <Response>
     <Sms>Hello from Reach!</Sms>
 </Response>`);
});
