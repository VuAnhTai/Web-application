var express = require('express');
var exphbs = require('express-handlebars');
var exphbs_section = require('express-handlebars-sections');
var path = require('path');

var app = express();

app.engine('hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: 'views/layouts/',
    helpers: {
    	section: exphbs_section()
    }
}));
app.set('view engine', 'hbs');

app.use(express.static(
    path.resolve(__dirname, 'public')
));

app.get('', (req, res) => {
    res.render('index');
});

app.get('/about', (req, res) => {
    res.render('about');
});
app.get('/checkout', (req, res) => {
    res.render('checkout');
});
app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/contact', (req, res) => {
    res.render('contact');
});
app.get('/payment', (req, res) => {
    res.render('payment');
});
app.get('/single_product', (req, res) => {
    res.render('single_product');
});
app.get('/shop', (req, res) => {
    res.render('shop');
});


app.listen(3001, () => {
    console.log('server running on port 3001');
});