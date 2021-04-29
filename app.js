require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


app.get('/', (req, res, next) => {
    res.render("home")
});

app.get('/artist-search', (req, res, next) => {

    spotifyApi
        .searchArtists(`${req.query.artist}`)
        .then(data => {
            // console.log('The received data from the API: ', data.body.artists);
            res.render("artist-search-results", {
                artist: data.body.artists.items
            })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});


app.get('/album/:artistId', (req, res, next) => {

    spotifyApi.getArtistAlbums(`${req.params.artistId}`).then(
        function (data) {
            res.render("albums", {
                album: data.body.items
            })
            // console.log('Artist albums', data.body.items);
        },
        function (err) {
            console.error(err);
        }
    );
});


app.get('/tracks/:albumId', (req, res, next) => {

    spotifyApi.getAlbumTracks(`${req.params.albumId}`).then(
        function (data) {
            res.render("tracks", {
                track: data.body.items
            })
            console.log('Artist albums', data.body);
        },
        function (err) {
            console.error(err);
        }
    );
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));