const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');


// Make DB Connection
mongoose.connect(config.database);
let db = mongoose.connection;
db.once('open',()=>{
  console.log('Connected to MongoDB...');
});
// Error Check
db.on('error',(err)=>{
  console.log(err)
})

// Init App
const app = express();

// Importing Models
let Article = require('./models/article.js');

// Loading View Engine
app.set('views', path.join(__dirname,'views'));
app.set('view engine','pug');

// Loading body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Express session middleware

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
// Express Messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Setting Public folder as Static folder
app.use(express.static(path.join(__dirname,'public')));

// bringing in passport
require('./config/passport')(passport);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Global variable
app.get('*',(req,res,next)=>{
  res.locals.user = req.user || null;
  next();
});

// Setting Routes
app.get('/',(req,res)=>{
  Article.find({},(err,articles)=>{
    if(err){
      console.log(err);
    }
    else {
      res.render('index',{title:'Articles',articles:articles});
    }
  });
});
// Importing routes files
let articles = require('./router/articles.js');
let users = require('./router/users.js');
app.use('/articles',articles);
app.use('/users',users);

app.listen(3000,()=>{
  console.log('You are listening on port 3000...')
})
