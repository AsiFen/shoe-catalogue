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
    secret: "<iamafraidofsnakes>",
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

const api_brandnames = "https://shoes-api-rm9c.onrender.com/api/shoes/brandnames";
const brandNames = (await axios.get(api_brandnames)).data;

const api_sizes = "https://shoes-api-rm9c.onrender.com/api/shoes/sizes";
const sizes = (await axios.get(api_sizes)).data;

const api_colors = "https://shoes-api-rm9c.onrender.com/api/shoes/colors";
const colors = (await axios.get(api_colors)).data;

router.get("/", async (req, res) => {
    const api_all_shoes = "https://shoes-api-rm9c.onrender.com/api/shoes";
    let shoes = (await axios.get(api_all_shoes)).data;

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
    let shoes = (await axios.get(api_brand)).data
    console.log(shoes);
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

    let shoes = (await axios.get(api_size)).data;

    res.render("index", {
        shoes,
        brandNames,
        sizes,
        colors
    });
});

router.get('/color/:color', async (req, res) => {

    let color_params = req.params.color;
    const api_size = `https://shoes-api-rm9c.onrender.com/api/shoes/colors/${color_params}`;
    let shoes = (await axios.get(api_size)).data;

    res.render("index", {
        shoes,
        brandNames,
        sizes,
        colors
    });
})

router.post('/filter', async (req, res) => {
    let size_params = req.body.size;
    let brand_body = req.body.brand;

    const api_brand_size = `https://shoes-api-rm9c.onrender.com/api/shoes/brand/${brand_body}/size/${size_params}`;
    let shoes = (await axios.get(api_brand_size)).data;

    res.render("index", {
        shoes,
        brandNames,
        sizes,
        colors,
        shoes
    })
})

router.get('/add-shoe', async (req, res) => {

    res.render("addShoe", {
        size: 'hi'
    })
});

router.get('/signup', async (req, res) => {

    res.render('login')
})

router.post('/signup', async (req, res) => {
    const username = req.body.signupUsername;
    const password = req.body.signupPassword;

    const signupApiUrl = 'https://shoes-api-rm9c.onrender.com/signup';
    const signupData = {
        username: username,
        password: password,
    };
    console.log(signupData);

    try {
        const response = await axios.post(signupApiUrl, signupData);
        if (response.status === 200) {
            // Successful login & Store userId in the session
            req.session.userId = response.data.user_cart.user_id;;
            console.log(response.data, req.session.userId);

            res.redirect('/');
        } else {
            // Failed signup
            console.log('Signup failed');
            res.render('login', { error: 'Signup failed' });
        }
    } catch (error) {
        console.error('Error during signup:', error);
        res.render('login', { error: 'An error occurred during signup' });
    }
})

router.get('/login', async (req, res) => {

    res.render('login')
})

router.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const loginApiUrl = 'https://shoes-api-rm9c.onrender.com/login';
    const loginData = {
        username: username,
        password: password,
    }

    try {
        const response = await axios.post(loginApiUrl, loginData);

        if (response.status == 200) {
            // Successful login & Store userId in the session
            req.session.userId = response.data.user_cart.user_id;
            console.log(response.data.user_cart.user_id, req.session.userId);

            res.redirect('/'); // Redirect to the cart page after adding the shoe

        } else {
            // Failed login
            res.render('login', { error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.render('login', { error: 'An error occurred during login' });
    }
})

router.post('/addToCart/:id', async (req, res) => {
    const shoeId = req.params.id;
    const userId = req.session.userId; // Retrieve userId from session
    console.log(userId);

    try {
        const addToCartUrl = `https://shoes-api-rm9c.onrender.com/cart/${userId}/add/${shoeId}`;
        await axios.post(addToCartUrl);
        const getCartUrl = `https://shoes-api-rm9c.onrender.com/cart/${userId}`;
        const cartShoes = (await axios.get(getCartUrl)).data;
        console.log(cartShoes);
        res.redirect('/'); // Redirect to the cart page after adding the shoe
    } catch (error) {
        console.error('Error adding shoe to cart:', error);
        res.status(500).send('Error adding shoe to cart: ' + error.message);
    }
});

router.get('/cart', async (req, res) => {
    const userId = req.session.userId; // Retrieve userId from session

    try {
        const getCartUrl = `https://shoes-api-rm9c.onrender.com/cart/${userId}`;
        const cartShoes = (await axios.get(getCartUrl)).data;
        console.log(cartShoes);
        let cartPrice = 0;

        cartShoes.forEach(item => {
            cartPrice += item.price;
        });

        res.render('cart', { cartShoes, cartPrice: cartPrice });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).send('Error fetching cart: ' + error.message);
    }
});


router.post('/add-shoe', async (req, res) => {

    let obj = {
        'color': req.body.color,
        'price': parseInt(req.body.price),
        'shoe_name': req.body.shoe_name,
        'shoe_size': parseInt(req.body.size),
        'img_url': req.body.img_url,
        'stock': parseInt(req.body.quantity),
        'brand': req.body.brand
    }

    axios.post('https://shoes-api-rm9c.onrender.com/api/shoes', obj)
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
