var express    = require('express');
var router     = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment    = require('../models/comment');

//NEW COMMENTS
router.get('/new', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    try {
      res.render('comments/new', {campground: campground});
    } catch {console.log(err)}; 
  }) 
});

//CREATE
router.post('/', isLoggedIn, (req, res) => {
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
          //add username id to comment
          comment.author._id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();          
          campground.comments.push(comment);
          campground.save();
          res.redirect(`/campgrounds/${campground._id}`);
        }
      });
    }
  });
});

//middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next()
  } else {
    res.redirect('/login');
  }
}

module.exports = router;