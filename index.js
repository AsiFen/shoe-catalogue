// importing the modules
import express from 'express'
// import shoe from './shoe.js'
import exphbs from 'express-handlebars'
import bodyParser from 'body-parser';
//flash - still don't know what it does. How is different to normal templating?
import flash from 'express-flash';
import session from 'express-session';
//creating an instance of the epxress module
let app = express()
//create an instance of my greetings function imported as module

//configuring the handlebars module
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
// app.set('views', './views');
// initialise session middleware - flash-express depends on it
app.use(session({
    secret: "<add a secret string here>",
    resave: false,
    saveUninitialized: true
}));
// initialise the flash middleware
app.use(flash());
// This ensures form variables can be read from the req.body variable
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
//built-in static middleware from ExpressJS to use static resources
app.use(express.static('public'))

import { Router } from "express";
import axios from "axios";
import "dotenv/config";

// Router instance
const router = Router();

// Api endpoint
const API_END_POINT = "https://shoes-api-rm9c.onrender.com/api/shoes";

// Router to get the shoes from the database and display the data to the ui
router.get("/", async (req, res) => {
    // GET the shoes from the api
    const shoes = (await axios.get(API_END_POINT)).data;
    console.log(shoes);
    // RENDER the shoes in the index page
    res.render("index", {
        shoes: shoes,
    });
});

router.get("/addShoes", (req, res) => {
    res.render("addShoes");
});


app.use(router)
//process the enviroment the port is running on
let PORT = process.env.PORT || 1999;
app.listen(PORT, () => {
    console.log('App started...', PORT);
})
