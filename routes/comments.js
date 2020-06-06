var express    = require('express');
var router     = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment    = require('../models/comment');
var middleware = require('../middleware');

//NEW COMMENTS
router.get('/new', middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    try {
      res.render('comments/new', {campground: campground});
    } catch {console.log(err)}; 
  }) 
});

//CREATE
router.post('/', middleware.isLoggedIn, (req, res) => {
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
          comment.author.id = req.user._id;
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

//EDIT
router.get('/:comment_id/edit', middleware.checkCommentsOwnership, (req, res)=>{            //comment_id is used in order to not mess up with campgrounds id
    Comment.findById(req.params.comment_id, (err, foundComment)=>{
      try {
        res.render('comments/edit', {comment: foundComment, campground_id: req.params.id});
      } catch {
        console.log(err);
        res.redirect('back');
      }
    }) 
})

//UPDATE
router.put('/:comment_id', middleware.checkCommentsOwnership, (req, res)=>{
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err)=>{
    if(err){
      console.log(err);
      res.redirect('back');
    } else {
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});

//DESTROY
router.delete('/:comment_id', middleware.checkCommentsOwnership, (req, res)=> {
  Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
    if(err){
      res.redirect('back');
      console.log(err);
    } else {
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  })
})

module.exports = router;