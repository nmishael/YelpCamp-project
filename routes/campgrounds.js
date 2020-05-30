var express    = require('express');
var router     = express.Router();
var Campground = require('../models/campground');

// CAMPGROUNDS ROUTER - INDEX
router.get('/', (req, res) =>{ 
  Campground.find({}, (err, allcampgrounds) => {
    try {
      res.render('campgrounds/index', {campgrounds: allcampgrounds});
    } catch {
      console.log(err);
    }
  });
});

//CREATE - create new campgrounds
router.post('/', isLoggedIn, (req, res) => {
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newCampground = {name: name, image: image, description: desc, author: author};
  Campground.create(newCampground, (err, newlyCreated) =>{
    try{
      res.redirect('/');
    } catch {
      console.log(err);
    }
  });
});

//NEW - display form to add new campgrounds
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new')
})

//SHOW - show additional information about campground
router.get('/:id', (req, res) => {
  Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
    if(err){
      console.log(err)
    } else {
      res.render('campgrounds/show', {campground: foundCampground});
    }
  });
});

//middlware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next()
  } else {
    res.redirect('/login');
  }
}

module.exports = router;