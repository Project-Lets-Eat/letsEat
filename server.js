'use strict';

require('dotenv').config();

const superagent = require('superagent');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const pg = require('pg');
const ZOMATOAPI = process.env.ZOMATO_API_KEY;
const cors = require('cors');
const { response } = require('express');

const client = new pg.Client(process.env.DATABASE_URL);
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.set('view engine', 'ejs'); 

app.get('/', (request, response) => {
    response.send('my homepage');
});


// http://localhost:3001/location?
app.post('/location', handleLocation);

// the table should include the descriptions users want to favorite.. so city-name, restaurant, reviews, etc.
function Location(data) {
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.city_name = data.city_name;
    this.city_id = data.city_id;
    this.entity_id = data.entity_id;
}

function handleLocation (req, res){
    const cityname = req.body.city_name;
    const url = `https://developers.zomato.com/api/v2.1/locations?query=${cityname}`;

    superagent.get(url)
    .set('user-key', ZOMATOAPI)
    .then(cityStuff => {
        const cityData = cityStuff.body.location_suggestions;
        console.log(cityStuff.body);
        let sortCity = cityData.map(cityObj => {
            const createCity = new Location(cityObj);
            return createCity;
        })
        res.render('../views/results', {cityInstance : sortCity});
    })
    .catch( error => {
        console.error('connection error', error);
    })
}

// purpose, what/how invoked, what returned
// arguments (#): 2 lat long, 1 popularity 
// argument types: numbers, 
// return: data: popularity ratings location price range, photo
function RestaurantDetail(data) {
    this.phots_url = data.restaurant.photos_url;
    this.currency = data.nearby_restaurants.currency;
    this.rating_text = data.user_rating.rating_text;
    this.address = data.restaurant.location.address;
    //this.popularity = data.popularity.popularity;
}

app.get('/geocode', searchGeoCode)

function searchGeoCode(req, res) {
    const latitude = request.query.latitude;
    const longitude = request.query.longitude;
    const url = `https://developers.zomato.com/api/v2.1/geocode?lat=${latitude}&long=${longitude}`
    
    superagent.get(url)
        .set('user-key', ZOMATOAPI)
        .then(response => {
            const geoStuff = response.nearby_restaurants;
            console.log(response.nearby_restaurants);
            let geoSuggestions = geoStuff.map(restaurantArr => {
                const sortRest = new RestaurantDetail(restaurantArr);
                return sortRest;
            })
            res.render('../views/results', {  popularDetails: geoSuggestions });
        })
        .catch(error => {
            console.error('connection error', error);
        })
}

function Cuisines(data) {
    this.cuisine_id = data.cuisine_id;
    this.cuisine_name = data.cuisine_name; 
}

app.get('/cuisine', searchCuisines)
function searchCuisines(request, response) {
    const city_id = request.query.city_id;
    const lat = request.query.latitude;
    const lon = request.query.longitude;
    const url = `http://developers.zomato.com/api/v2.1/cuisines?city_id=/location`;

    superagent.get(url)
    .then(result => {
        response.render('views/results', { cuisineList: data.rows})
    })
    .catch(err => console.error(err));
}






client.connect() 
.then(() => { 
app.listen(PORT, () => {
    console.log(`server is up on ${PORT}`);
});
})
.catch( error => {
    console.error('connection error', error);
}) 

