const functions = require('firebase-functions');
const superagent = require('superagent');

const K2C = 273.2;

const getIso2 = require('./toiso2');

module.exports.execute = (command, cb) => {
  try {
    const rawargs = command.split(/\s+/g);
    if (rawargs.length < 3) {
      cb("Please enter the correct format: weather {city}, {country name/code}");
      return;
    }
    const city = rawargs[1].substring(0, rawargs[1].length - 1); // get rid of trailing comma
    const findcountryargs = command.split(/\s*,\s*/);
    if (findcountryargs.length < 2) {
      cb("Please enter the correct format: weather {city}, {country name/code}");
      return;
    }
    const country = findcountryargs[1];
    
    let iso2 = getIso2(country);
    if (iso2 === null) {
      cb(`Couldn't find country "${country}".`)
      return;
    }
    
    superagent.get('http://api.openweathermap.org/data/2.5/weather').query({
      'q': city + ',' + iso2,
      'APPID': functions.config().openweathermap.key
    }).timeout({response: 1000, deadline: 2000}).then(res => {
      if (res.error) {
        cb(`Error ${res.status}: ${res.text}`);
        return;
      }
      cb(`Weather in ${res.body.name}:\n` +
        `Temperature: ${(res.body.main.temp-K2C).toFixed(1)}C (min: ${(res.body.main.temp_min-K2C).toFixed(1)}C, ` +
        `max: ${(res.body.main.temp_max-K2C).toFixed(1)}C)\n` +
        `Humidity: ${(res.body.main.humidity).toFixed(0)}%\n` +
        `Overall: ${res.body.weather[0].description}.\n`);
    }).catch(err => { cb('could not retrieve weather data'); });
  } catch (e) {
    console.error(e);
    cb('Error');
  }
};
