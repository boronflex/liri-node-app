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
            logger(tweets[i].text);
        }

    });
}

function getSong(){

    inquirer.prompt([

        {
            type: "input",
            name: "userInput",
            message: "Ok what song?"
        }

    ]).then(function(command) {

        var songTitle = command.userInput;

        searchSong(songTitle);

    });

};

function searchSong(songTitle){

    var spotify = new Spotify(keys.spotifyKey);
    
    if (songTitle === ""){
        
        //songTitle = "The Sign";
        //ace of base doesnt come up as the first result

        spotify
        .request('https://api.spotify.com/v1/tracks/3DYVWvPh3kGwPasp7yjahc')
        .then(function(data) {

            // * Artist(s)

            console.log(`Artist Name: ${data["album"]["artists"][0]["name"]}`)
            logger(data["album"]["artists"][0]["name"]);
            
            // * The song's name

            console.log(`Song Title: ${data["name"]}`)
            logger(data["name"]);
            
            // * A preview link of the song from Spotify

            console.log(`Preview Link: ${data["album"]["artists"][0]["external_urls"]["spotify"]}`)
            logger(data["album"]["artists"][0]["external_urls"]["spotify"]);

            // * The album that the song is from

            console.log(`Album: ${data["album"]["name"]}`)
            logger(data["album"]["name"])
    

        })
        .catch(function(err) {
          console.error('Error occurred: ' + err); 
        });

    } else {

        spotify.search({ type: 'track', query: songTitle, limit: 1 }, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

            // * Artist(s)

            console.log(`Artist Name: ${data["tracks"]["items"][0]["album"]["artists"][0]["name"]}`)
            logger(data["tracks"]["items"][0]["album"]["artists"][0]["name"]);
            
            // * The song's name

            console.log(`Song Name: ${data["tracks"]["items"][0]["name"]}`)
            logger(data["tracks"]["items"][0]["name"]);
            
            // * A preview link of the song from Spotify

            console.log(`Preview Link ${data["tracks"]["items"][0]["album"]["artists"][0]["external_urls"]["spotify"]}`)
            logger(data["tracks"]["items"][0]["album"]["artists"][0]["external_urls"]["spotify"]);

            // * The album that the song is from

            console.log(`Album: ${data["tracks"]["items"][0]["album"]["name"]}`)
            logger(data["tracks"]["items"][0]["album"]["name"]);
            
            //console.log(JSON.stringify(data, null, 2)); 

        });

    }

};

function getMovie(){

    inquirer.prompt([

    {
        type: "input",
        name: "userInput",
        message: "Ok what movie?"
    }

    ]).then(function(command) {

        var movieTitle = command.userInput;

        searchMovie(movieTitle);

    });

}

function searchMovie(movieTitle){

    if (movieTitle === ""){
        movieTitle = "Mr.Nobody";
    };

    var queryUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=40e9cece";

    request(queryUrl, function(error, response, body) {

        if (!error && response.statusCode === 200) {

            //        * Title of the movie.
            console.log(`TItle: ${JSON.parse(body).Title}`);
            logger(JSON.parse(body).Title);
            //        * Year the movie came out.
            console.log(`Year released: ${(JSON.parse(body).Released).slice(-4)}`);
            logger((JSON.parse(body).Released).slice(-4));
            //        * IMDB Rating of the movie.
            console.log(`IMDB rating: ${JSON.parse(body).imdbRating}`);
            logger(JSON.parse(body).imdbRating);
            //        * Rotten Tomatoes Rating of the movie.
            console.log(`Rotten Tomatoes rating: ${JSON.parse(body).Ratings[1].Value}`);
            logger(JSON.parse(body).Ratings[1].Value);
            //        * Country where the movie was produced.
            console.log(`Country where produced: ${JSON.parse(body).Country}`);
            logger(JSON.parse(body).Country);
            //        * Language of the movie.
            console.log(`Language: ${JSON.parse(body).Language}`);
            logger(JSON.parse(body).Language);
            //        * Plot of the movie.
            console.log(`Plot: ${JSON.parse(body).Plot}`);
            logger(JSON.parse(body).Plot);
            //        * Actors in the movie.
            console.log(`Actors: ${JSON.parse(body).Actors}`);
            logger(JSON.parse(body).Actors);

        }
    });

}

function readCommand(){

    fs.readFile("random.txt", "utf8", function(error, data) {
        
        if (error) {
        return console.log(error);
        }
    
        var dataArr = data.split(",");
    
        //console.log(dataArr);

        switch (dataArr[0]) {
            
            case "my-tweets":
              getTweets();
              break;
          
            case "spotify-this-song":
              searchSong(dataArr[1]);
              break;
         
            case "movie-this":
              searchMovie(dataArr[1]);
              break;
        }
        
    });

}

function logger(data){

    data = `${data} \n`

    //data = JSON.stringify(data, null, 2) + "\n"
    
    fs.appendFile("log.txt", data, function(err) {
    
      if (err) {
        console.log(err);
      }

      else {
        //console.log("Content Added!");
      }
    
    });
}




