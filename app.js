var express    = require('express'),
    app        = express(),
    bodyParser = require('body-parser'),
    mongoose   = require('mongoose'),
    Campground = require('./models/campground'),
    seedDB     = require('./seeds');

mongoose.connect('mongodb://localhost/campgrounds', { 
                  useNewUrlParser: true,
                  useUnifiedTopology: true 
                });

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

seedDB();

app.get('/', (req, res) =>{
  res.render('landing');
})

// INDEX - display campgrounds
app.get('/campgrounds', (req, res) =>{
  Campground.find({}, (err, allcampgrounds) => {
    try {
      res.render('index', {campgrounds: allcampgrounds});
    } catch {
      console.log(err);
    }
  });
});

//CREATE - create new campgrounds
app.post('/campgrounds', (req, res) => {
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = {name: name, image: image, description: desc};
  Campground.create(newCampground, (err, newlyCreated) =>{
    try{
      res.redirect('/campgrounds');
    } catch {
      console.log(err);
    }
  });
});

//NEW - display form to add new campgrounds
app.get('/campgrounds/new', (req, res) => {
  res.render('new')
})

//SHOW - show additional information about campground
app.get('/campgrounds/:id', (req, res) => {
  Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
    if(err){
      console.log(err)
    } else {
      res.render('show', {campground: foundCampground});
    }
  });
  // req.params.id 
})

app.listen(3000, () => {
  console.log('<======ONLINE======>');
});