const functions = require('firebase-functions');

const getIso2 = require('./toiso2');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(functions.config().newsapi.key);

module.exports.execute = (command, phoneNumber, db, cb) => {
  let args = command.split(/\s+/g);
  if (args.length < 2) {
    cb('Too few arguments: please enter a country.');
    return;
  }
  country = args[1];
  for (let i = 2; i < args.length; i++) {
    country += ' ' + args[i];
  }
  let iso2 = getIso2(country);
  if (iso2 === null) {
    cb('Unrecognized country "' + country + '".');
    return;
  }
  newsapi.v2.topHeadlines({
    country: iso2
  }).then(response => {
    if (response.status === 'error') {
      cb('Error: could not retrieve news');
      console.log(`Error on retrieving news: ${response.status}, ${response.message}`);
      return;
    }
    console.log(response);
    let numArticles = Math.min(5, response.totalResults);
    let text = `Your top ${numArticles} articles are:`;
    for (var i = 0; i < numArticles; i++) {
      text += '\n' + (i+1) + '. ' + response.articles[i].title;
    }
    text += '\nUse "more {article #}" to preview an article.';
    
    console.log('bar');
    cb(text);
    
    console.log('foo');
    
    // database shizzle
    db.collection('users').doc(phoneNumber).set({
      'phoneNumber': phoneNumber,
      'article1': response.articles[0].content,
      'article2': response.articles[1].content,
      'article3': response.articles[2].content,
      'article4': response.articles[3].content,
      'article5': response.articles[4].content
    }).then(_ => console.log(`Successfully created/updated DB entry for ${phoneNumber}`))
    .catch(err => console.log(`Failed to create/update DB entry for ${phoneNumber}: ${err}`));
  });
}
