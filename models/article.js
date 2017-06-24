let mongoose = require('mongoose');
// Article Scheama

let articleSchema = mongoose.Schema({
  title: {
    type: String,
    require: true
  },
  author:{
    type:String,
    require: true
  },
  body:{
    type: String,
    require: true
  }
})

let Article = module.exports = mongoose.model('Article',articleSchema);
