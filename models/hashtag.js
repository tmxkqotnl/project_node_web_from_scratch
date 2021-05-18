const mongoose = require('mongoose');
const Schema = mongoose.Schema({
  articleid:{

  }
})
const hashtag = mongoose.model('hashtag',Schema);
module.exports = {hashtag};
