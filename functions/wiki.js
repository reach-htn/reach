const superagent = require('superagent');
module.exports.execute = (command, cb) => { // TODO: pagination
  try {
    const args = command.split(/\s+/);
    if (args.length < 2) {
      return "Error: no Wikipedia page title specified";
    }
    let title = args[1];
    for (var i = 2; i < args.length; i++) {
      title += ' ' + args[i];
    }
    superagent.get('http://en.wikipedia.org/w/api.php').query({
      'format': 'json',
      'action': 'query',
      'prop': 'extracts',
      'exintro': '',
      'explaintext': '',
      'titles': title
    }).timeout({response: 1000, deadline: 2000}).then(res => {
      if (res.error) {
        cb(`Error ${res.status}: ${res.text}`);
        return;
      }
      const pageids = Object.keys(res.body.query.pages);
      if (pageids.length == 1 && pageids[0] == '-1') {
        cb(`No page like "${title}" found.`);
        return;
      }
      // just take the first one, it's fine
      const articleData = res.body.query.pages[pageids[0]];
      const articleTitle = articleData.title;
      let articleText = articleData.extract;
      if (articleText == '') {
        cb(`No page like "${title}" found.`);
        return;
      }
      // remove pronunciation crap if it's there
      if (articleText.match(/^\w+\s+\(.+\)/)) {
        articleText = articleText.replace(/\(.+\)\s/, ''); // single match removed
      }
      // trim to first 220 bytes - 2-ish segments max, probably?
      if (articleText.length > 220) {
        articleText = articleText.substring(0, 220);
      }
      articleText += '...'; // yeah there's more to the article
      cb(`"${articleTitle}" on Wikipedia: ${articleText}`);
    }).catch(err => {
      cb(`Error: ${err.message}`);
    });
  } catch (e) {
    console.error(e);
    cb('Error');
  }
};
