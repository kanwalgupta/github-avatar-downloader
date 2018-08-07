var request = require('request');
var password = require('./secrets.js');
var fs = require('fs');

var args = process.argv.slice(2);

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  // ...
 if(repoOwner === undefined || repoName === undefined){
  console.log("Please enter valid information for repo owner and repo name");
  return ;
 }
 var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization' : password.GITHUB_TOKEN
    },

  };
  request(options, function(err, res, body) {
    cb(err, JSON.parse(body));
});
}
getRepoContributors(args[0], args[1], function(err, result) {
  console.log("Errors:", err);
  result.forEach(function(contributor){
  downloadImageByURL(contributor.avatar_url,"avatars/"+contributor.login+ '.jpg');
  })

});
function downloadImageByURL(url, filePath) {
  request.get(url)               // Note 1
       .on('error', function (err) {                                   // Note 2
         throw err;
       })
       .on('response', function (response) {                           // Note 3
         console.log('Response Status Code: ', response.statusCode);
       })
       .pipe(fs.createWriteStream(filePath));
}
