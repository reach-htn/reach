const functions = require('firebase-functions');
const wiki = require('./wiki');

MENU_MSG = `Valid commands:
* menu: show this menu
* wiki <title> ["/" page number]: read Wikipedia pages`;

exports.sms = functions.https.onRequest(async (req, res) => {
  let msg = '';
  let command = req.query.Body.toLowerCase();
  let commandName = command.split(/\s+/)[0];
  
  switch (command) {
    case 'menu':
      msg = MENU_MSG;
      break;
    case 'wiki':
      msg = wiki.execute();
      break;
    default:
      msg = `Unrecognized command.\n${MENU_MSG}`;
      break;
  }
  
  res.send(`
  <?xml version="1.0" encoding="UTF-8"?>
  <Response>
    <Sms>${msg}</Sms>
  </Response>
  `);
});

// basic test function
exports.helloWorld = functions.https.onRequest(async (request, response) => {
 response.send(`<?xml version="1.0" encoding="UTF-8"?>
 <Response>
     <Sms>Hello from Reach!</Sms>
 </Response>`);
});
