var express    = require('express'),
    app        = express(),
    bodyParser = require('body-parser'),
    mongoose   = require('mongoose'),
    Campground = require('./models/campground'),
    Comment    = require('./models/comment'),
    seedDB     = require('./seeds');

mongoose.connect('mongodb://localhost/campgrounds', { 
                  useNewUrlParser: true,
                  useUnifiedTopology: true 
                });

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
seedDB();

app.get('/', (req, res) =>{
  res.render('landing');
})

// INDEX - display campgrounds
app.get('/campgrounds', (req, res) =>{
  Campground.find({}, (err, allcampgrounds) => {
    try {
      res.render('campgrounds/index', {campgrounds: allcampgrounds});
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
  res.render('campgrounds/new')
})

//SHOW - show additional information about campground
app.get('/campgrounds/:id', (req, res) => {
  Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
    if(err){
      console.log(err)
    } else {
      res.render('campgrounds/show', {campground: foundCampground});
    }
  });
  // req.params.id 
})
//=================================================//
//COMMENTS ROUTES
//=================================================//
//NEW for COMMENTS
app.get('/campgrounds/:id/comments/new', (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    try {
      res.render('comments/new', {campground: campground});
    } catch {console.log(err)}; 
  }) 
});

//CREATE
app.post('/campgrounds/:id/comments', (req, res) => {
  //lookup campground using ID
  Campground.findById(req.params.id, (err, campground) => {
    if(err){
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      //create new comment
      Comment.create(req.body.comment, (err, comment) =>{
        if (err) {
          console.log(err);          
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect(`/campgrounds/${campground._id}`);
        }
      })
    }
  })
  
  //connect new comment to a campground
  //redirect campground show page
})

app.listen(3000, () => {
  console.log('<======ONLINE======>');
});