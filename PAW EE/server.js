const port = process.env.PORT || 3000;
const ip = process.env.IP;
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const validator = require('express-validator');


//new
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const usersModel = require('./models/user.model');


//This function will allow us to retrict the access to the routes
global.secure = function(type) {
	return function (request, response, next) {
		if (request.isAuthenticated()) {
			if (type) {
				if (type === request.users.type) {
					return next();
				}else{
					response.redirect('/');
				}
			}else{
				return next();
			}			
		}
		response.redirect('/');
	}
};
//end of new

app.use(validator());
app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));

//new
app.use(cookieParser());
app.use(session({
	secret: 'someRandomSecretKey',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(username, callback) {
	callback(null, username);
});

passport.deserializeUser(function(username, callback) {
	usersModel.read(username, function(data) {
		callback(null, data);
	})
});
//end of new

app.set('view engine', 'ejs');
app.set('views','views');

//CONEXAO BASE DE DADOS
global.connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'root',
	database : 'mydb',
}).on('enqueue', function (sequence) {
	if ('Query' === sequence.constructor.name) {
		console.log(sequence.sql);
	}
});


app.listen(port, function(){
	console.log('Server started at: ' + port);
});

//Midleware that sets the isAuthenticated variable in all views
app.use(function(request, response, next){
 	response.locals.user = request.user;
 	response.locals.isAuthenticated = request.isAuthenticated();
 	next();
});

app.use('/public', express.static('public'));
app.use('/', require('./controllers/index.route'));
app.use('/calibragem', require('./controllers/calibragem.route'));
app.use('/produtor', require('./controllers/produtor.route'));