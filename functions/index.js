const functions = require('firebase-functions');
const wiki = require('./wiki');
const goose_facts = require('./goose_facts');
const directions = require('./directions');

MENU_MSG = `Valid commands:
* menu: show this menu
* wiki <title> ["/" page number]: read Wikipedia pages
* directions from <address> to <address>: get in-text directions from one location to another`;

exports.sms = functions.https.onRequest(async (req, res) => {
  let msg = '';
  let command = req.query.Body.toLowerCase();
  let commandName = command.split(/\s+/)[0];
  
  let num = 0;
  
  switch (command) {
    case 'menu':
      msg = MENU_MSG;
      break;
    case 'wiki':
      msg = wiki.execute();
      break;
    case 'directions':
      msg = directions.execute();
      break;
    case 'roll': // rolls a dice with x amount of sides
      num = command.split(/\s+/)[1];
      msg = Math.floor(Math.random() * Math.floor(num)) + 1;
      break;
    case 'goosefacts': //spits out a ramdom goose fact
      msg = goose_facts.facts(Math.floor(Math.random() * Math.floor(15)));
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
