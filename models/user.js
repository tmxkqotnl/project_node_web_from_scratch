const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema({
  id:{
    require:true,
    type:String,
    unique:1,
    trim:true,
  },
  password:{
    require:true,
    type:String
  },
})

// 생성 전 비밀번호 암호화
const saltRound = 15;
Schema.pre('save',function(next){
  const schema = this;
  if(schema.isModified('password') || schema.isNew){
    bcrypt.genSalt(saltRound,(saltError,salt)=>{
      if(saltError){
        return next(saltError);
      }
      bcrypt.hash(schema.password,salt,(err,hash)=>{
        if(err){
          return next(err);
        }
        schema.password = hash;
        next();
      });
    });
  }else{
    return next();
  }
});

const User = mongoose.model('User',Schema);
module.exports = {User};

