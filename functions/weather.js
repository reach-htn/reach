const superagent = require('superagent');
var lookup = require('country-code-lookup'); //https://www.npmjs.com/package/country-code-lookup
const K2C = 273.2;

module.exports.execute = (command, cb) => {
  try {
    const args = command.split(',');
    if (args.length < 3) {
      cb("Please enter the correct format: weather {city},{country name}");
      return;
    }
    if(args[2].toLowerCase() == 'great britain'){
      args[2] = 'United Kingdom';
    }
    lookup.byCountry(args[2]);
    
    superagent.get('http://api.openweathermap.org/data/2.5/weather').query({
      'q': args[1] + ',' + lookup.countries.iso2, 'APPID': 'd7040e8a3b4f0976d79b6ea17265c79c'
    }).timeout({response: 1000, deadline: 2000}).then(res => {
      if (res.error) {
        cb(`Error ${res.status}: ${res.text}`);
        return;
      }
      cb(`Weather in ${res.body.name}, ${res.body.sys.country}:\n` +
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
