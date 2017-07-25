var express = require('express');
var app = express();
var router = express.Router();
var session = require('express-session')
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('./config/passport');
var flash = require('connect-flash');
var port = process.env.PORT || 3000;
var routes = require('./routes/routes')
var home = require('./routes/home')
var board = require('./routes/board')
var post = require('./routes/post')
var comment = require('./routes/comment')
var user = require('./routes/user')
var group = require('./routes/group')

//Express configuration ==============================================================================================================================================================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({   
	        	secret: '밖에 비온다 주륵주륵',
                resave: false,
                saveUninitialized: false
            })
        );
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());



//View engine configuration =========================================================================================================================================================
var exphbs  = require('express-handlebars');
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

//Routes =============================================================================================================================================================================
app.use(routes(passport))
app.use(home)
app.use(board)
app.use(post)
app.use(comment)
app.use(user)
app.use(group)

//Error handling =====================================================================================================================================================================
app.use(function(req, res, next) {
  var err = new Error('Not found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


//====================================================================================================================================================================================
app.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});


module.exports = app;