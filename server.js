'use strict'

//dependencies
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

//create instances
const app = express();
const router = express.Router();

//setup ports
const port = process.env.API_PORT || 8080;

//use bodyparser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//To prevent errors from Cross Origin Resource Sharing, we will set 
//our headers to allow CORS with middleware like so:
app.use( (req, res, next) => {
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Credentials', 'true');
 res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
 res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
//remove cache
 res.setHeader('Cache-Control', 'no-cache');
 next();
});

//endpoints
router.get('/', () => {
    res.json({message: 'API Initialized!'});
});

//use router config
app.use('/api', router);

//starts server
app.listen(port, () => {
    console.log('Listening on port ${port}');
});