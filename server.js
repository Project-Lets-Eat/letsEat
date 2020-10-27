'use strict';

require('dotenv').config();

const superagent = require('superagent');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const pg = require('pg');
const ZOMATOAPI = process.env.ZOMATO_API_KEY;
const IPSTACKAPI = process.env.IPSTACK_API_KEY;

//const client = new pg.Client(process.env.DATABASE_URL);
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); 

app.get('/', (request, response) => {
    response.send('my homepage');
});

app.get('/test/route', (request, response) => {
    response.json({ location: '',  });
});

// http://localhost:3001/location?
app.get('/location', handleLocation);


function Location(data) {
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.city_name = data.city_name;
    this.city_id = data.city_id;
    this.entity_id = data.entity_id;
}

































function Cuisines(data) {
    this.cuisine_id = data.cuisine.cuisine_id;
    this.cuisine_name = data.cuisine.cuisine_name; 
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
        response.render('views/results', { cuisineList: allCuisines})
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