const superagent = require('superagent');
const K2C = 273.2;
module.exports.execute = (command, cb) => {
  try {
    const args = command.split(/\s+/);
    if (args.length < 3) {
      cb("Please enter the correct format: weather {city} {country code}. Use 2-letter country codes (e.g. CA, US)");
      return;
    }
    
    superagent.get('http://api.openweathermap.org/data/2.5/weather').query({
      'q': args[1] + ',' + args[2], 'APPID': 'd7040e8a3b4f0976d79b6ea17265c79c'
    }).timeout({response: 1000, deadline: 2000}).then(res => {
      if (res.error) {
        cb(`Error ${res.status}: ${res.text}`);
        return;
      }
      cb(`Weather in ${res.body.name}, ${res.body.sys.country}:\n` +
        `Temperature: ${(res.body.main.temp-K2C).toFixed(1)}°C (min: ${(res.body.main.temp_min-K2C).toFixed(1)}°C, ` +
        `max: ${(res.body.main.temp_max-K2C).toFixed(1)}°C)\n` +
        `Humidity: ${(res.body.main.humidity).toFixed(0)}%\n` +
        `Pressure: ${(res.body.main.pressure/10).toFixed(1)} kPa\n` +
        `Wind speed: ${(res.body.wind.speed*3.6).toFixed(1)} km/h\n` +
        `Overall: ${res.body.weather[0].description}.\n`);
      
      const description = res.body.weather[0].description;
      const temp = res.body.main.temp;
      
      cb(`Weather in "${args[1]}":\n Temperature: "${temp}"\n Desc.: ${description}`);
    }).catch(err => { cb('could not retrieve weather data'); });
  } catch (e) {
    console.error(e);
    cb('Error');
  }
};
