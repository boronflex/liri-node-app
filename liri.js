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

]).then(function(command) {

    switch (command.userInput) {
        case "my-tweets":
          console.log("here are your tweets")
          getTweets();
          break;
      
        // case "spotify-this-song":
        //   getSong();
        //   break;

// 3. `node liri.js movie-this '<movie name here>'`
        
//      * If you haven't watched "Mr. Nobody," then you should: <http://www.imdb.com/title/tt0485947/>
        
//      * It's on Netflix!
    
//    * You'll use the request package to retrieve data from the OMDB API. Like all of the in-class activities, the OMDB API requires an API key. You may use `40e9cece`.
      
        case "movie-this":
          getMovie();
          break;
      
        // case "do-what-it-says":
        //   readCommand();
        //   break;
    }

});

function getTweets(){

    console.log("here are your last 20 tweets, try and calm down: ")

    client.get('statuses/user_timeline', { screen_name: 'boss_whedon', count: 20}, function(error, tweets, response) {
        for (var i = 0, len = tweets.length; i < len; i++) {
            console.log(tweets[i].text);
        }
    });

}

function getMovie(){

    inquirer.prompt([

    {
        type: "input",
        name: "userInput",
        message: "Ok what movie?"
    }

    ]).then(function(command) {

        var movieTitle = command.userInput;

//    * If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
        if (movieTitle === ""){
            movieTitle = "Mr.Nobody";
        };

        var queryUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=40e9cece";

        request(queryUrl, function(error, response, body) {

            if (!error && response.statusCode === 200) {

                //        * Title of the movie.
                console.log(`TItle: ${JSON.parse(body).Title}`);
                //        * Year the movie came out.
                console.log(`Year released: ${(JSON.parse(body).Released).slice(-4)}`);
                //        * IMDB Rating of the movie.
                console.log(`IMDB rating: ${JSON.parse(body).imdbRating}`);
                //        * Rotten Tomatoes Rating of the movie.
                console.log(`Rotten Tomatoes rating: ${JSON.parse(body).Ratings[1].Value}`);
                //        * Country where the movie was produced.
                console.log(`Country where produced: ${JSON.parse(body).Country}`);
                //        * Language of the movie.
                console.log(`Language: ${JSON.parse(body).Language}`);
                //        * Plot of the movie.
                console.log(`Plot: ${JSON.parse(body).Plot}`);
                //        * Actors in the movie.
                console.log(`Actors: ${JSON.parse(body).Actors}`);

            }
        });

    });

}

