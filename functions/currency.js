const functions = require('firebase-functions');
const superagent = require('superagent');

function convertCurrency(value, curOrig, curNew, cb){
	superagent.get('https://openexchangerates.org/api/latest.json').query({
		'app_id': functions.config().oer.key
	}).timeout({response: 1000, deadline: 2000}).then(res => {
		let currencyTable = res.body;
		
		if (!(currencyTable.rates.hasOwnProperty(curOrig)) || !(currencyTable.rates.hasOwnProperty(curNew))) {
			cb("Error: Invalid currency codes");
		}
		let newValue = (value / currencyTable.rates[curOrig] * currencyTable.rates[curNew]).toFixed(2);
		
		cb(value + " " + curOrig + " = " + newValue + " " + curNew);
	}).catch(err => {
		console.log(err.message);
		cb('Error: could not retrieve currency data');
	});
}

module.exports.execute = (command, cb) => {
  let args = command.split(/\s+/);
  if (args.length < 2) {
		cb("Error: Value and currencies not specified");
		return;
  }
  if (isNaN(args[1])) {
		cb("Error: First argument must be a numerical value");
  }
  let val = +args[1];
  let cOrig = args[2];
  let cNew;
  
  if (args[3] == "to") {
		cNew = args[4];
  } else {
		cNew = args[3];
  }
  
  convertCurrency(val, cOrig, cNew, cb);
};
