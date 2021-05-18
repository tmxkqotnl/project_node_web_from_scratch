const mongoose = require('mongoose');
const Schema = mongoose.Schema({
  title:{
    type:String,
    maxlength:60,
  },
  body:{
    type:String,
  },
  date:Date,
})
const Article = mongoose.model('Article',Schema);
module.exports = {Article};