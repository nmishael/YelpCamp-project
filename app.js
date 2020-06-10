var express    = require('express'),
    app        = express(),
    bodyParser = require('body-parser'),
    mongoose   = require('mongoose'),
    flash      = require('connect-flash');
    passport   = require('passport'),
    LocalStrategy = require('passport-local'),
    methodOverride = require('method-override'),
    //Campground = require('./models/campground'),
    //Comment    = require('./models/comment'),
    User       = require('./models/user'),
    seedDB     = require('./seeds');

    //REQUIRING ROUTERS
var commentRoutes    = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes      = require('./routes/index');


// mongoose.connect('mongodb://localhost/campgrounds', 
mongoose.connect(process.env.DATABASEURL, { 
                  useNewUrlParser: true,
                  useUnifiedTopology: true, 
                  useFindAndModify: false,
                  useCreateIndex: true
                }).then(() => {
                  console.log('<======Connected to DB======>');
                }).catch(err => {
                  console.log('ERROR: ', err.message);
                });

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
// seedDB(); //seed the database

//passport configuration
app.use(require('express-session')({
  secret: 'Session',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error= req.flash('error');  
  res.locals.success= req.flash('success');
  next();
})

//ROUTES
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use(indexRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`<======ONLINE on ${PORT}======>`);
});