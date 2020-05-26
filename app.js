var express    = require('express'),
    app        = express(),
    bodyParser = require('body-parser'),
    mongoose   = require('mongoose')

mongoose.connect('mongodb://localhost/campgrounds', { 
                  useNewUrlParser: true,
                  useUnifiedTopology: true 
                });

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

var Campground = mongoose.model('Campground', campgroundSchema);

// Campground.create(
//   {
//   name: 'Granite Hill',
//   image: 'https://pixabay.com/get/54e8d7464b5bab14f1dc84609620367d1c3ed9e04e507440752d7fdc9749c6_340.jpg',
//   description: 'Great place to visit. I will stay here furthermore!'
//   }, 
//   (err, campground) => {
//     try {console.log(campground);}
//     catch {console.log(err);
//     }
//   });

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
  Campground.findById(req.params.id, function(err, foundCampground){
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