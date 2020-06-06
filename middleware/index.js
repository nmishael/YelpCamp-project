var Campground = require('../models/campground');
var Comment = require('../models/comment');

var middlewareObj = {};

middlewareObj.checkOwnership = function(req, res, next) {
  if(req.isAuthenticated()){
    //does uder own the campground?
    Campground.findById(req.params.id, (err, foundCampground)=> {
      try {        
        if(foundCampground.author.id.equals(req.user._id)){
          next();
        } else{
          res.redirect('back');
        }
      } catch {
        res.redirect('back');
      }
    });  
  } else {
    res.redirect('back');
  }
}

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next()
  } else {
    res.redirect('/login');
  }
}

middlewareObj.checkCommentsOwnership = function(req, res, next) {
  if(req.isAuthenticated()){
    //does uder own the comment?
    Comment.findById(req.params.comment_id, (err, foundComment)=> {
      if(err){
        res.redirect('back');
      } else {
        if(foundComment.author.id.equals(req.user._id)){
          next();
        } else {
          res.redirect('back');
        }
      }
    });
  } else {
    res.redirect('back');
  }
}

module.exports = middlewareObj;