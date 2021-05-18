const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {User} = require('../models/user');

module.exports = ()=>{
  
  // local strategy
  passport.use(new LocalStrategy({
    usernameField:'id',
    passwordField:'password',
    session:true,
    passReqToCallback:false
  },async(id,password,done)=>{
    try{
      const curUser = await User.findOne({id:id}).exec();
      if(curUser){
        const result = await bcrypt.compare(password,curUser.password);
        if(result){
          done(null,curUser);
        }else{
          done(null,false,{message:"비밀번호가 일치하지 않습니다."});
        }
      }else{
        done(null,false,{message:"존재하지 않는 회원입니다."});
      }
    }catch(err){
      console.error(err);
      done(err);
    }
  }));
};