var mongoose = require('mongoose'),
Campground   = require('./models/campground'),
Comment      = require('./models/comment');

var data = [
  {
      name: "Cloud's Rest",
      image: 'https://pixabay.com/get/55e9d6414355ae14f1dc84609620367d1c3ed9e04e507440752a7cd3944dcc_340.jpg',
      description: 'Blah blah blah'
  },
  {
      name: "Night Cmping",
      image: 'https://pixabay.com/get/57e1dd4a4350a514f1dc84609620367d1c3ed9e04e507440752a73dc9e45c6_340.jpg',
      description: 'Blah blah blah'
  },
  {
      name: "Some Camp",
      image: 'https://pixabay.com/get/55e8dc404f5aab14f1dc84609620367d1c3ed9e04e507440752a73dc9e45c6_340.jpg',
      description: 'Blah blah blah'
    }
           ]

function seedDB(){
  //remove cammpgrounds
  Campground.remove((err)=>{
    try {
      console.log('Campgrounds deleted');
      Comment.remove((err)=> {
        if(err) {
          console.log(err)
        }
      });
        //add campgrounds
      data.forEach((seed)=> {
        Campground.create(seed, (err, campgrounds) =>{
          try {
            console.log('Campgrounds Added')
            Comment.create(
              {
                text: 'There will be comments',
                author: 'Homer'
              }, (err, comment)=>{
                    try{
                      campgrounds.comments.push(comment);
                      campgrounds.save();
                      console.log('commnents created')
                    } catch{console.log(err)}
                  });
          } catch {console.log(err)}
        });
      });
    } catch {console.log(err)}
  });
};

module.exports = seedDB;
