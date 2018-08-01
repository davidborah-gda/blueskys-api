const express = require('express');
const server = express();
const axios = require('axios');

const urlFormatter = require('url');

//load environment variables
require('dotenv').config();

//define the port -> heroku needs the first part
const port = process.env.PORT || 9009;

//define the base url for darksky (the common parts)
const apikey = process.env.API_KEY;
const url = `https://api.darksky.net/forecast/${apikey}/`;

//define the base url for google geolocation API
const geoUrl = `https://maps.googleapis.com/maps/`

//import middleware (power ups)
const cors = require('cors');
const helmet = require('helmet');

//add the middleware (power ups)
server.use(cors());
server.use(helmet());

//routes and stuff...DARKSKY
server.get('/forecast/location/:lat,:lon', (request, response) => {
    const { lat, lon } = request.params;
    const requestUrl = urlFormatter.resolve(url, `${lat},${lon}`);
    axios.get(requestUrl)
        .then((weather) => {
            response.status(200).json(weather.data);
        })
        .catch((error) => {
            response.status(500).json({
                msg: "don't look now, but there is a Tornado behind you!"
            });
        });
});

//routes for GOOGLE Geolation API
server.getGeo('/api/geocode/json?address=:city,:ST', (request, response) => {
    const { city, ST } = request.params;
    const requestUrl = urlFormatter.resolve(url, `${city},${ST}`);
    axios.getGeo(requestUrl)
        .then((data) => {
            response.status(200).json(data.results);
        })
        .catch((error) => {
            response.status(500).json({
                msg: "don't look now, but there is a Tornado behind you!"
            });
        });
});


//kick off this jam
server.listen(port, () => {
    console.log(`Now listening on port: ${port}`);
});