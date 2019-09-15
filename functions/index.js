const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);
let db = admin.firestore();

const wiki = require('./wiki');
const weather = require('./weather');
const goose_facts = require('./goose_facts');
const directions = require('./directions');
const currency = require('./currency');
const news = require('./news');
const more = require('./more');
const convert = require('./convert');

MENU_MSG = `Valid commands:
* menu: show this menu
* wiki {page title}: read Wikipedia pages
* directions from {address} to {address}: get directions from one location to another
* weather {city}, {country name/code}: get weather info
* news {country}: get country-specific news
* more {number}: get more of an article
* convert {conversion type} {value} {original unit} to {new unit}: do unit conversion
* roll [number]: roll a {number}-sided die
* goosefacts: get a random goose fact`;

exports.sms = functions.https.onRequest(async (req, res) => {
  let command = req.query.Body;
  let commandName = command.split(/\s+/)[0].toLowerCase();
  
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
    case 'news':
      news.execute(command, req.query.From, db, sendit);
      break;
    case 'more':
      more.execute(command, req.query.From, db, sendit);
      break;
    case 'directions':
      directions.execute(command, sendit);
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
    case 'weather': //reads information about the weather
      weather.execute(command, sendit);
      break;
    case 'convert':
      let conSplit = command.split(/\s+/);
      if (conSplit.length < 2) {
        sendit('Error: no conversion info included');
        break;
      }
      let convertType = conSplit[1];
      if (convertType == "currency") {
        currency.execute(command, sendit);
      } else {
       convert.execute(command, sendit);
      }
      break;
    default:
      sendit(`Unrecognized command.\n${MENU_MSG}`);
      break;
  }
  
});
