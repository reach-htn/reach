module.exports.execute = (command, phoneNumber, db, cb) => {
  let args = command.split(/\s+/g);
  if (args.length !== 2) {
    cb('Error: please follow format "more {article number}".');
    return;
  }
  let article = +args[1];
  if (isNaN(article)) {
    cb("Error: that's not a number like I asked you so nicely for.");
    return;
  }
  if (article < 1 || article > 5) {
    cb('Error: please enter an article number between 1 and 5 inclusive.');
    return;
  }
  
  // query the db to get the damn thing
  db.collection('users').doc(phoneNumber).get().then(doc => {
    if (doc.exists) {
      cb(`Preview: ${doc.data()['article' + article]}`);
    } else {
      cb('Error: no previous articles were loaded, please use the "news" command.');
    }
  }).catch(err => {
    cb('Error connecting to database');
    console.log(`Could not get "more" from database: ${err}`);
  });
};
