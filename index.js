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

router.get('/brand/:brand', async (req, res) => {
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

router.get('/size/:size', async (req, res) => {
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
});

router.get('/color/:color', async (req, res) => {

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
})
router.get('/filter', async (req, res) => {
    // let show2filters = req.flash('brandsandsize')[0];
    // console.log(show2filters);

})

router.post('/filter', async (req, res) => {
    let size_params = req.body.size;
    let brand_body = req.body.brand;

    const api_brand_size = `http://localhost:9999/api/shoes/brand/${brand_body}/size/${size_params}`;
    const shoes = (await axios.get(api_brand_size)).data;

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
        colors,
        shoes
    })
})

router.get('/add-shoes', async (req, res) => {

    res.render("addShoe", {
        size: 'hi'
    })
})
let cartShoes = {};

router.post('/addToCart/:id', async (req, res) => {
    const shoeId = req.params.id;
    const addShoeId = `http://localhost:9999/api/shoes/${shoeId}`;
    cartShoes = (await axios.get(addShoeId)).data;

    console.log(cartShoes);
    // Redirect the user to the cart page.
    res.render('cart', async (req, res) => {
        cartShoes
    });
    res.redirect('/cart')

});

router.get('/cart', async (req, res) => {
    const getCart = 'http://localhost:9999/api/shoes/cart';
    cartShoes = (await axios.get(getCart)).data;

    console.log(cartShoes);
    // Redirect the user to the cart page.
    res.render('cart', async (req, res) => {
        cartShoes
    });
    try {
        res.render('cart', { cartShoes }); // Render the cart handlebars template and pass the cart data
    } catch (error) {
        res.status(500).send('Error fetching cart: ' + error.message);
    }
});

router.post('/add-shoes', async (req, res) => {

    let obj = {
        'color': req.body.color,
        'price': parseInt(req.body.price),
        'shoe_name': req.body.shoe_name,
        'shoe_size': parseInt(req.body.size),
        'img_url': req.body.img_url,
        'stock': parseInt(req.body.quantity),
        'brand': req.body.brand
    }
    console.log(obj);
    axios.post('http://localhost:9999/api/shoes', obj)
        .then(response => {
            // Handle the response from the API.
            if (response.status === 200) {
                // The shoe was successfully added to the API.
                res.send('Shoe successfully added!');
            } else {
                // There was an error adding the shoe to the API.
                res.send('Error adding shoe: ' + response.statusText);
            }
        })
        .catch(error => {
            // There was an error making the request to the API.
            res.send('Error making request: ' + error.message);
        });

})

app.use(router)
//process the enviroment the port is running on
let PORT = process.env.PORT || 1919;
app.listen(PORT, () => {
    console.log('App started...', PORT);
})
