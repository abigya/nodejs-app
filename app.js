/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
var path = require('path');
var morgan  = require('morgan');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var errorhandler = require('errorhandler');
var session = require('express-session');
const opn = require('opn');

//load routes
var products = require('./routes/products'); 
var passport = require('passport');
var flash = require('connect-flash');

var app = express();
var connection  = require('express-myconnection'); 
var mysql = require('mysql');
app.use(
    connection(mysql,{
        host     : '127.0.0.1',
        user     : 'root',
        password : 'Abigy@15',
        port     :  3306,
        database : 'smartfridge',
        queueLimit : 0, // unlimited queueing
        connectionLimit : 0 // unlimited connections
    },'request')
);
require('./routes/passport')(passport);

// all environments
app.set('port', process.env.PORT || 4300);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(path.join(__dirname, 'public')));
// development only
if ('development' == app.get('env')) {
  app.use(errorhandler());
}
app.use(session({
  secret: 'justasecret',
  resave:true,
  saveUninitialized: true
 }));
 
 app.use(passport.initialize());
 app.use(passport.session());
 app.use(flash());
 
 
 require('./routes/routes.js')(app, passport);

//smart fridge routes
app.get('/products', products.list);
app.get('/products/add', products.add);
app.post('/products/add', products.save);
app.get('/products/delete/:productID',products.remove);
app.get('/products/edit/:productID', products.edit); 
app.post('/products/edit/:productID',products.save_edit);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

//open app in default web browser
opn("http://localhost:4300/");
