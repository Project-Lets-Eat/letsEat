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
const methodOverride = require('method-override');
const client = new pg.Client(process.env.DATABASE_URL);

app.use(methodOverride('_method'));
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.set('view engine', 'ejs');

app.get('/', renderIndex);
app.post('/viewRestaurant', viewSingleRestaurant); // check this
//app.post('/viewRestaurant', viewRestaurantDetailsHomePage);
app.post('/location', handleLocation);
app.post('/save', save);
app.delete('/delete/:id', deleteTask);
app.put('/update/:id', updateTask);
app.get('/viewRestaurant', viewSingleRestaurant);
// the table should include the descriptions users want to favorite.. so city-name, restaurant, reviews, etc.
function Location(data) {
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.city_name = data.city_name;
    this.city_id = data.city_id;
    this.entity_id = data.entity_id;
  
}

function restaurantDetail(data) {
    this.featured_image = data.restaurant.featured_image;
    this.price_range = data.restaurant.price_range;
    this.rating_text = data.restaurant.user_rating.rating_text;// check object
    this.address = data.restaurant.location.address;
    this.cuisine = data.restaurant.cuisines;
    this.average_cost_for_two = data.restaurant.average_cost_for_two;
    this.name = data.restaurant.name;
    this.id = data.restaurant.id;
}

function renderIndex(_request, response) {
    let SQL = "SELECT * FROM restaurant";
    
    client.query(SQL)
    .then ( queryResponse => {
        console.log(queryResponse);
            response.render('index', { favoriteRestaurants: queryResponse.rows });
        }
    );
}




function save(req, res) {
    let SQL = `INSERT INTO restaurant (name, address, rating_text, featured_image, price_range, cuisine, average_cost_for_two)
    VALUES ($1, $2, $3, $4, $5, $6, $7)`;

    let VALUES = [req.body.name, req.body.address, req.body.rating_text, req.body.featured_image, req.body.price_range, req.body.cuisine, req.body.average_cost_for_two]

    client.query(SQL, VALUES)
    .then(res.redirect('/'));
}

function updateTask (req, res) {
    console.log('life', req.body);
    let {name, address, rating_text, featured_image, price_range, cuisine, average_cost_for_two} = req.body;
    let restaurantUpdate = 'UPDATE restaurant SET name=$1, address=$2, rating_text=$3, featured_image=$4, price_range=$5, cuisine=$6, average_cost_for_two=$7 WHERE id=$8';
    let restaurantArr = [name, address, rating_text, featured_image, price_range, cuisine, average_cost_for_two, req.params.id];

    client.query(restaurantUpdate, restaurantArr)
    .then(res.redirect(`/`))
}


function deleteTask(req, res) {
    let SQL = `DELETE FROM restaurant WHERE id=$1;`;
    console.log(req.params.id)
    let id = [req.params.id]
    client.query(SQL, id)
        .then(res.redirect('/'));
}

function handleLocation(req, res) {
    const cityname = req.body.city_name;
    const url = `https://developers.zomato.com/api/v2.1/locations?query=${cityname}`;
    
    superagent.get(url)
        .set('user-key', ZOMATOAPI)
        .then(cityStuff => {
            const cityData = cityStuff.body.location_suggestions[0];
            
            //let sortCity = cityData.map (cityObj => {
            const createCity = new Location(cityData);
            //  return createCity;
            const geoCodeURL = `https://developers.zomato.com/api/v2.1/geocode?lat=${createCity.latitude}&lon=${createCity.longitude}`
            
            superagent.get(geoCodeURL)
                .set('user-key', ZOMATOAPI)
                .then(restaurantStuff => {
                    const geoData = restaurantStuff.body.nearby_restaurants;
                    
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

// restaurant details function that inserts data into SQL, use key from this fcn and insert as xxx.forEach in index.ejs, similar to popularDetails for results.ejs
/*function viewRestaurantDetailsHomePage (req, res) {
    client.query('SELECT * FROM restaurant')
    .then(find => {
        res.render('views/index', {indexKey : find.rows[0]});
    })
    .catch(error => {
        console.error('connection error', error);
    })
}
*/
function viewSingleRestaurant (req, res) {
// query db - sql str, does it have req.body.restaurantID client.query-- select * from restaurant where name= req.body.restaurantName
//.then... if results.rows > 0
// res = results.rows[0] 
// else.... vvv

const sql= `SELECT * FROM restaurant WHERE name=$1;`;
console.log(req.query);
const values = [req.query.restaurantName];
client.query(sql, values)

.then(results => {
    if (results.rows.length > 0){
        console.log('hello there');
    res.render('viewRestaurant', {restaurant : results.rows[0]});
    }
    else {
        console.log('goodbye');
    const restaurantURL = `https://developers.zomato.com/api/v2.1/restaurant?res_id=${req.body.restaurantID}`

    superagent.get(restaurantURL)
    .set('user-key', ZOMATOAPI)
    .then(singleData => {
        let singleRestaurantObj = {};
        singleRestaurantObj.name = singleData.body.name;
        singleRestaurantObj.address = singleData.body.location.address;
        singleRestaurantObj.cuisine = singleData.body.cuisines;
        singleRestaurantObj.featured_image = singleData.body.featured_image;
        singleRestaurantObj.price_range = singleData.body.price_range;
        singleRestaurantObj.rating_text = singleData.body.user_rating.rating_text;
        singleRestaurantObj.average_cost_for_two = singleData.body.average_cost_for_two;
        res.render('viewRestaurant', {restaurant: singleRestaurantObj});
    })
}
}) 
    .catch(error => {
        console.error('connection error', error);
    })
}

client.connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`server is up on ${PORT}`);
        })
    })
    .catch(error => {
        console.error('connection error', error);
    })
