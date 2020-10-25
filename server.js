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

app.get('/location', handleLocation);
// the table should include the descriptions users want to favorite.. so city-name, restaurant, reviews, etc.
function Location(data) {
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.city_name = data.city_name;
    this.city_id = data.city_id;
    this.entity_id = data.entity_id;
    //this.name = info.restaurants.name;
    //this.price_range = info.price_range;
}
// purpose, what/how invoked, what returned
// arguments (#): 2 lat long, 1 popularity 
// argument types: numbers, 
// return: data: popularity ratings location price range, photo
function restaurantDetail(data) {
    this.photos_url = data.restaurant.photos_url;
    this.currency = data.restaurant.currency;
    this.rating_text = data.restaurant.user_rating.rating_text;
    this.address = data.restaurant.location.address;
<<<<<<< HEAD
    this.popularity = data.popularity.popularity;
    this.cuisines = data.nearby_restaurants.cuisines;
=======
    this.cuisine = data.restaurant.cuisines;
    this.average_cost_for_two = data.restaurant.average_cost_for_two;
>>>>>>> 371a591da657c2802f484e69af01e81cf14f7baa
}

function handleLocation(req, res) {
    const cityname = req.query.city_name;
    const url = `https://developers.zomato.com/api/v2.1/locations?query=${cityname}`;

    superagent.get(url)
        .set('user-key', ZOMATOAPI)
        .then(cityStuff => {
            const cityData = cityStuff.body.location_suggestions[0];
            console.log(cityStuff.body);
            //let sortCity = cityData.map (cityObj => {
            const createCity = new Location(cityData);
            //  return createCity;
            const geoCodeURL = `https://developers.zomato.com/api/v2.1/geocode?lat=${createCity.latitude}&long=${createCity.longitude}`

            superagent.get(geoCodeURL)
                .set('user-key', ZOMATOAPI)
                .then(restaurantStuff => {
                    const geoData = restaurantStuff.body.nearby_restaurants;
                    console.log(geoData);
                    let geoSuggestions = geoData.map(restaurantArr => {
                        return new restaurantDetail(restaurantArr);
                    })
                    // superagent to separate restaurant by cuisine type

                    res.render('../views/results', { popularDetails: geoSuggestions });
                })
                .catch(error => {
                    console.error('connection error', error);
                    // make request to geocode api
                })
            // })
            //res.render('../views/results', { cityInstance: sortCity });
        })
        .catch(error => {
            console.error('connection error', error);
        })
}

<<<<<<< HEAD

=======
/*
>>>>>>> 371a591da657c2802f484e69af01e81cf14f7baa
function Cuisines(data) {
    this.cuisine_id = data.cuisine_id;
    this.cuisine_name = data.cuisine_name; 

}

app.get('/cuisine', searchCuisines)
function searchCuisines(request, response) {
    const lat = request.query.latitude;
    const lon = request.query.longitude;
    const url = `http://developers.zomato.com/api/v2.1/cuisines?lat=${lat}&lon=${lon}`;

    superagent.get(url)
    .then(result => {
        console.log(result.body);
        let allCuisines = result.body.cuisines.map(cuisineType => {
            return new Cuisines(cuisineType);
        })
        response.render('views/results', { cuisinesList: allCuisines})
    })
    .catch(err => console.error(err));
}
*/

client.connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`server is up on ${PORT}`);
        });
    })
    .catch(error => {
        console.error('connection error', error);
    })

