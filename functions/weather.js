const superagent = require('superagent');
module.exports.execute = (command, cb) => {
  try {
    const args = command.split(/\s+/);
    if (args.length < 3) {
      cb("Please enter the correct format: weather {city} {country code}. Use ISO 3166 country codes");
      return;
    }
    
    superagent.get('http://api.openweathermap.org/data/2.5/weather').query({
      'q': args[1] + ',' + args[2], 'APPID': 'd7040e8a3b4f0976d79b6ea17265c79c'
    }).timeout({response: 1000, deadline: 2000}).then(res => {
      if (res.error) {
        cb(`Error ${res.status}: ${res.text}`);
        return;
      }
      
      const description = res.weather.description;
      const temp = res.main.temp;
      
      cb(`Weather in "${args[1]}":\n Temperature: "${temp}"\n Desc.: ${description}`);
    }).catch(err => { cb('could not retrieve weather data'); });
  } catch (e) {
    console.error(e);
    cb('Error');
  }
};
