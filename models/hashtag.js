const mongoose = require('mongoose');
const schema = mongoose.Schema({
  name:{
    type:String,
    unique:true,
    require:true
  },
  ids:[{type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    require:true
  }],
})
const Hashtag = mongoose.model('Hashtag',schema);
module.exports = {Hashtag};
