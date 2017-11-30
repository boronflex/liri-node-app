//liri app

var request = require("request");
var inquirer = require("inquirer");
var Twitter = require("twitter");
var keys = require("./keys.js");

client = new Twitter(keys.twitterKey);

var uInput = process.argv[4];

// 1. `node liri.js my-tweets`

//    * This will show your last 20 tweets and when they were created at in your terminal/bash window.

inquirer.prompt([

  {
    type: "input",
    name: "userInput",
    message: "What would you like to do?"
  }

// After the prompt, store the user's response in a variable called location.
]).then(function(command) {

    switch (command.userInput) {
        case "my-tweets":
          console.log("here are your tweets")
          getTweets();
          break;
      
        // case "spotify-this-song":
        //   getSong();
        //   break;
      
        // case "movie-this":
        //   getMovie();
        //   break;
      
        // case "do-what-it-says":
        //   readCommand();
        //   break;
    }

});

function getTweets(){

    console.log("get tweets called");
    //console.log(keys.twitterKey);

    client.get('statuses/user_timeline', { screen_name: 'boss_whedon', count: 20}, function(error, tweets, response) {
        for (var i = 0, len = tweets.length; i < len; i++) {
            console.log(tweets[i].text);
        }
    });

}

