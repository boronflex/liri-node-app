//liri app

var request = require("request");
var inquirer = require("inquirer");
var Twitter = require("twitter");
var Spotify = require('node-spotify-api');
var fs = require("fs");
var keys = require("./keys.js");

inquirer.prompt([

  {
    type: "input",
    name: "userInput",
    message: "What would you like to do?"
  }

]).then(function(command) {

    switch (command.userInput) {
        case "my-tweets":
          getTweets();
          break;
      
        case "spotify-this-song":
          getSong();
          break;
     
        case "movie-this":
          getMovie();
          break;

// 4. `node liri.js do-what-it-says`

// * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.

// * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.

// * Feel free to change the text in that document to test out the feature for other commands.
      
        case "do-what-it-says":
          readCommand();
          break;
    }

});

function getTweets(){

    var client = new Twitter(keys.twitterKey);

    console.log("Here are your last 20 tweets, try and calm down: ")

    client.get('statuses/user_timeline', { screen_name: 'boss_whedon', count: 20}, function(error, tweets, response) {
        for (var i = 0, len = tweets.length; i < len; i++) {
            console.log(tweets[i].text);
        }
    });

}

function getSong(){

// * This will show the following information about the song in your terminal/bash window

// * Artist(s)

// * The song's name

// * A preview link of the song from Spotify

// * The album that the song is from

// * If no song is provided then your program will default to "The Sign" by Ace of Base.

    var spotify = new Spotify(keys.spotifyKey);

    spotify.search({ type: 'track', query: 'All the Small Things' }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        
        //console.log(JSON.stringify(data, null, 2)); 

        var stringy = JSON.stringify(data, null, 2)

        fs.writeFile("spot-obj.txt", stringy, function(error) {
            
            if (error) {
            return console.log(error);
            }
            
        });
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

function readCommand(){

    fs.readFile("random.txt", "utf8", function(error, data) {
        
        if (error) {
        return console.log(error);
        }
    
        var dataArr = data.split(",");
    
        console.log(dataArr);
        
    });

}




