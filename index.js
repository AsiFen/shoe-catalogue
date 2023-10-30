// importing the modules
import express from 'express'
// import shoe from './shoe.js'
import exphbs from 'express-handlebars'
import bodyParser from 'body-parser';
//flash - still don't know what it does. How is different to normal templating?
import flash from 'express-flash';
import session from 'express-session';
//creating an instance of the epxress module
import { Router } from "express";
import axios from "axios";
import "dotenv/config";

let app = express()
const router = Router();

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


router.get("/", async (req, res) => {

    const api_all_shoes = "https://shoes-api-rm9c.onrender.com/api/shoes";
    const shoes = (await axios.get(api_all_shoes)).data;

    const api = "https://shoes-api-rm9c.onrender.com/api/shoes/brandnames";
    const brandNames = (await axios.get(api)).data;

    const api_sizes = "https://shoes-api-rm9c.onrender.com/api/shoes/sizes";
    const sizes = (await axios.get(api_sizes)).data;

    const api_colors = "https://shoes-api-rm9c.onrender.com/api/shoes/colors";
    const colors = (await axios.get(api_colors)).data;

    res.render("index", {
        shoes,
        brandNames,
        sizes,
        colors
    });
});

router.get('/brand/:brand', async (req, res) => {
    let brand = req.params.brand;
    const api_brand = `https://shoes-api-rm9c.onrender.com/api/shoes/brand/${brand}`;
    const shoes = (await axios.get(api_brand)).data;
    const api_brandnames = "https://shoes-api-rm9c.onrender.com/api/shoes/brandnames";
    const brandNames = (await axios.get(api_brandnames)).data;

    const api_sizes = "https://shoes-api-rm9c.onrender.com/api/shoes/sizes";
    const sizes = (await axios.get(api_sizes)).data;

    const api_colors = "https://shoes-api-rm9c.onrender.com/api/shoes/colors";
    const colors = (await axios.get(api_colors)).data;

    res.render("index", {
        shoes,
        brandNames,
        sizes,
        colors
    });
})

router.get('/size/:size', async (req, res) => {
    let size_ = req.params.size;
    const api_size = `https://shoes-api-rm9c.onrender.com/api/shoes/size/${size_}`;

    const shoes = (await axios.get(api_size)).data;

    const api_brandnames = "https://shoes-api-rm9c.onrender.com/api/shoes/brandnames";
    const brandNames = (await axios.get(api_brandnames)).data;

    const api_sizes = "https://shoes-api-rm9c.onrender.com/api/shoes/sizes";
    const sizes = (await axios.get(api_sizes)).data;

    const api_colors = "https://shoes-api-rm9c.onrender.com/api/shoes/colors";
    const colors = (await axios.get(api_colors)).data;

    res.render("index", {
        shoes,
        brandNames,
        sizes,
        colors
    });
    res.end;
});

router.get('/color/:color', async (req, res) => {

    let color_params = req.params.color;
    const api_size = `https://shoes-api-rm9c.onrender.com/api/shoes/colors/${color_params}`;
    const shoes = (await axios.get(api_size)).data;

    const api_brandnames = "https://shoes-api-rm9c.onrender.com/api/shoes/brandnames";
    const brandNames = (await axios.get(api_brandnames)).data;

    const api_sizes = "https://shoes-api-rm9c.onrender.com/api/shoes/sizes";
    const sizes = (await axios.get(api_sizes)).data;

    const api_colors = "https://shoes-api-rm9c.onrender.com/api/shoes/colors";
    const colors = (await axios.get(api_colors)).data;

    res.render("index", {
        shoes,
        brandNames,
        sizes,
        colors
    });
})
router.get('/filter', async (req, res) => {
    // let show2filters = req.flash('brandsandsize')[0];
    // console.log(show2filters);

})

router.post('/filter', async (req, res) => {
    let size_params = req.body.size;
    let brand_body = req.body.brand;

    const api_brand_size = `https://shoes-api-rm9c.onrender.com/api/shoes/brand/${brand_body}/size/${size_params}`;
    const shoes = (await axios.get(api_brand_size)).data;

    const api = "https://shoes-api-rm9c.onrender.com/api/shoes/brandnames";
    const brandNames = (await axios.get(api)).data;

    const api_sizes = "https://shoes-api-rm9c.onrender.com/api/shoes/sizes";
    const sizes = (await axios.get(api_sizes)).data;

    const api_colors = "https://shoes-api-rm9c.onrender.com/api/shoes/colors";
    const colors = (await axios.get(api_colors)).data;

    res.render("index", {
        shoes,
        brandNames,
        sizes,
        colors,
        shoes
    })
})

router.get('/add-shoes', async (req, res) => {
    res.render("addShoe", {
        size: 'hi'
    })
})

router.post('/add-shoes', async (req, res) => {
    let size = req.body;

})

app.use(router)
//process the enviroment the port is running on
let PORT = process.env.PORT || 1919;
app.listen(PORT, () => {
    console.log('App started...', PORT);
})
