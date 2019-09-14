const functions = require('firebase-functions');
const wiki = require('./wiki');
const goose_facts = require('./goose_facts');
const directions = require('./directions');

MENU_MSG = `Valid commands:
* menu: show this menu
* wiki {page title} ["/" page number]: read Wikipedia pages
* roll [number]: roll a die with that number of sides
* goosefacts: show a random goose fact
* directions from <address> to <address>: get in-text directions from one location to another`;

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
    case 'directions':
      msg = directions.execute();
      break;
    case 'roll': // rolls a dice with x amount of sides
      let splitted = command.split(/\s+/);
      if (splitted.length < 2) {
        sendit('Error: specify a number of sides on the die');
        break;
      }
      let num = splitted[1];
      sendit('' + (Math.floor(Math.random() * Math.floor(num)) + 1));
      break;
    case 'goosefacts': //spits out a ramdom goose fact
      sendit(goose_facts.facts[Math.floor(Math.random() * Math.floor(15))]);
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
