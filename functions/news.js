const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('c7b8594b075e4b07ab47e2c7c21d6e30');

module.exports.execute = (command, cb) => {

// To query /v2/top-headlines
// All options passed to topHeadlines are optional, but you need to include at least one of them
newsapi.v2.topHeadlines({
  sources: 'bbc-news,the-verge',
  q: 'bitcoin',
  category: 'business',
  language: 'en',
  country: 'us'
}).then(response => {
  let text = "Your top five articles are";   
  for(var i = 0; i < 5 && i < response.articles.length; i++){
      text += i + 1
      text += response.articles[i].title;
  } 
  cb(text); 

  console.log(response);
  /*
    {
      status: "ok",
      articles: [...]
    }
  */
});
// To query /v2/everything
// You must include at least one q, source, or domain

}