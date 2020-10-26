'use strict';

require('dotenv').config();

const superagent = require('superagent');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const pg = require('pg');
const ZOMATOAPI = process.env.ZOMATO_API_KEY;

const client = new pg.Client(process.env.DATABASE_URL);
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); 
//app.get(route, fcn);
//app.post('/results', fcn);











client.connect() 
.then(() => { 
app.listen(PORT, () => {
    console.log(`server is up on ${PORT}`);
});
})
.catch( error => {
    console.error('connection error', error);
}) 

