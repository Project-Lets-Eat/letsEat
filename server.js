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



client.connect() 
.then(() => { 
app.listen(PORT, () => {
    console.log(`server is up on ${PORT}`);
});
})
.catch( error => {
    console.error('connection error', error);
}) 