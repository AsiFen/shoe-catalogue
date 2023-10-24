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

router.get("/", async (req, res) => {
    const api_all_shoes = "http://localhost:9999/api/shoes";
    const shoes = (await axios.get(api_all_shoes)).data;

    const api = "http://localhost:9999/api/shoes/brandnames";
    const brandNames = (await axios.get(api)).data;

    const api_sizes = "http://localhost:9999/api/shoes/sizes";
    const sizes = (await axios.get(api_sizes)).data;

    const api_colors = "http://localhost:9999/api/shoes/colors";
    const colors = (await axios.get(api_colors)).data;

    res.render("index", {
        shoes,
        brandNames,
        sizes,
        colors
    });
});

app.get('/brand/:brand', async (req, res) => {
    let brand = req.params.brand;
    const api_brand = `http://localhost:9999/api/shoes/brand/${brand}`;
    const shoes = (await axios.get(api_brand)).data;
    const api_brandnames = "http://localhost:9999/api/shoes/brandnames";
    const brandNames = (await axios.get(api_brandnames)).data;

    const api_sizes = "http://localhost:9999/api/shoes/sizes";
    const sizes = (await axios.get(api_sizes)).data;

    const api_colors = "http://localhost:9999/api/shoes/colors";
    const colors = (await axios.get(api_colors)).data;

    res.render("index", {
        shoes,
        brandNames,
        sizes,
        colors
    });
})

app.get('/size/:size', async (req, res) => {
    let size_ = req.params.size;
    const api_size = `http://localhost:9999/api/shoes/size/${size_}`;
    const shoes = (await axios.get(api_size)).data;

    const api_brandnames = "http://localhost:9999/api/shoes/brandnames";
    const brandNames = (await axios.get(api_brandnames)).data;

    const api_sizes = "http://localhost:9999/api/shoes/sizes";
    const sizes = (await axios.get(api_sizes)).data;

    const api_colors = "http://localhost:9999/api/shoes/colors";
    const colors = (await axios.get(api_colors)).data;

    res.render("index", {
        shoes,
        brandNames,
        sizes,
        colors
    });
    res.end;
})

app.get('/color/:color', async (req, res) => {
    let color_params = req.params.color;
    const api_size = `http://localhost:9999/api/shoes/colors/${color_params}`;
    const shoes = (await axios.get(api_size)).data;
    
    const api_brandnames = "http://localhost:9999/api/shoes/brandnames";
    const brandNames = (await axios.get(api_brandnames)).data;

    const api_sizes = "http://localhost:9999/api/shoes/sizes";
    const sizes = (await axios.get(api_sizes)).data;

    const api_colors = "http://localhost:9999/api/shoes/colors";
    const colors = (await axios.get(api_colors)).data;

    res.render("index", {
        shoes,
        brandNames,
        sizes,
        colors
    });
    res.end;
})

// app.get('/:brand/:size', async (req, res) => {

//     res.end;
// })


app.use(router)
//process the enviroment the port is running on
let PORT = process.env.PORT || 1999;
app.listen(PORT, () => {
    console.log('App started...', PORT);
})
