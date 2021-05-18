const passport = require('passport');
const LocalStrategy = require('./localStrategy');
const {User} = require('../models/user');

module.exports = ()=>{
  // session
  passport.serializeUser((user,done)=>{
    done(null,user.id);
  });
  passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{
      done(null,id);
    });
  });

  LocalStrategy();
}
