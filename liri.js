// Read and set environment variables
require("dotenv").config();
//  require("./.env").config();
var Spotify = require("node-spotify-api");

var secretKey = require("./keys.js");
var spotify = new Spotify({
    id: secretKey.spotify.id,
    secret: secretKey.spotify.secret
});

// Import the axios npm package.
var axios = require("axios");

// Import the moment npm package.
var moment = require("moment");

// Import the FS package for read/write.
var fs = require("fs");
// concert-this <artist/band name here
var getMyBands = function (artist) {
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(queryURL).then(
        function (response) {
            var jsonData = response.data;

            if (!jsonData.length) {
                console.log("No results found for " + artist);
                return;
            }
            console.log("Upcoming concerts for " + artist + ":");
            for (var i = 0; i < jsonData.length; i++) {
                var show = jsonData[i];
                // Print data about each concert,Give info on venue, and format dat info          
                console.log(
                    show.venue.city +
                    "," +
                    (show.venue.region || show.venue.country) +
                    " at " +
                    show.venue.name +
                    " " +
                    moment(show.datetime).format("MM/DD/YYYY")
                );
            }
        }
    );
};
// Running search on OMDBAPI
var getMeMovie = function (movieName) {
    if (movieName === undefined) {
        movieName = "Undisputed";
    }

    var urlHit =
        "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";

    axios.get(urlHit).then(
        function (response) {
            var jsonData = response.data;
            console.log("Plot: " + jsonData.Plot);
            console.log("Title: " + jsonData.Title);
            console.log("Rated: " + jsonData.Rated);
            console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
            console.log("IMDB Rating: " + jsonData.imdbRating);
            console.log("Country: " + jsonData.Country);
            console.log("Year: " + jsonData.Year);
            console.log("Language: " + jsonData.Language);
            console.log("Actors: " + jsonData.Actors);

        }
    );
};
var getArtistNames = function (artist) {
    return artist.name;
};

// Function for running a Spotify search
var getMeSpotify = function (songName) {
    if (songName === undefined) {
        songName = "Keep Hustling";
    }

    spotify.search(
        {
            type: "track",
            query: songName
        },
        function (err, data) {
            if (err) {
                console.log("Error occurred: " + err);
                return;
            }
            var songs = data.tracks.items;
            for (var i = 0; i < songs.length; i++) {
                console.log(i);
                console.log("artist(s): " + songs[i].artists.map(getArtistNames));
                console.log("album: " + songs[i].album.name);               
                console.log("preview song: " + songs[i].preview_url);               
                console.log("---------------");
                console.log("song name: " + songs[i].name);
            }
        }
    );
};

// Function for running a command based on text file
var doWhatItSays = function() {
    fs.readFile("random.txt", "utf8", function(error, data) {
      console.log(data);
  
      var dataArr = data.split(",");
  
      if (dataArr.length === 2) {
        choice(dataArr[0], dataArr[1]);
      } else if (dataArr.length === 1) {
        choice(dataArr[0]);
      }
    });
  };
  // Function for determining which command is executed
var choice = function(caseData, functionData) {
    switch (caseData) {
    case "concert-this":
      getMyBands(functionData);
      break;
    case "spotify-this-song":
      getMeSpotify(functionData);
      break;
    case "movie-this":
      getMeMovie(functionData);
      break;
    case "do-what-it-says":
      doWhatItSays();
      break;
    default:
      console.log("LIRI doesn't know that");
    }
  };
  // Function which takes in command line arguments and executes correct function accordingly
var Madness = function(argOne, argTwo) {
    choice(argOne, argTwo);
  };
  // MAIN PROCESS
// =====================================
Madness(process.argv[2], process.argv.slice(3).join(" "));