var express    = require('express');
var router     = express.Router();
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');

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
router.post('/', middleware.isLoggedIn, (req, res) => {
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newCampground = {name: name, price: price, image: image, description: desc, author: author};
  Campground.create(newCampground, (err, newlyCreated) =>{
    try{
      res.redirect('/campgrounds');
    } catch {
      console.log(err);
    }
  });
});

//NEW - display form to add new campgrounds
router.get('/new', middleware.isLoggedIn, (req, res) => {
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

//EDIT 
router.get('/:id/edit', middleware.checkOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground)=> {
     res.render('campgrounds/edit', {campground: foundCampground});
   }); 
});

//UPDATE
router.put('/:id', middleware.checkOwnership, (req, res)=>{
  // req.body.campground.body = req.sanitize(req.body.campground.body);
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, ()=>{
    try{
      res.redirect(`/campgrounds/${req.params.id}`);
    } catch {
      res.redirect('/campgrounds');
    }
  })
})

//DESTROY
router.delete('/:id', middleware.checkOwnership, async(req, res)=>{
    Campground.findByIdAndRemove(req.params.id, (err, removedCampground)=>{
      try{
        res.redirect('/campgrounds')
      } catch(err){
        console.log(err);
        res.redirect('/campgrounds')
      }
      Comment.deleteMany({_id: { $in: removedCampground.comments}}, (err) => {
        if(err){console.log(err)}
      })
    });      
  })

module.exports = router;