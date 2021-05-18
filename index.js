const express = require('express');
const app = express();
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const nunjucks = require('nunjucks');
const path = require('path');
const session = require('express-session');
const {User} = require('./models/user');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const passportindex = require('./passport');

dotenv.config(); // dotenv config must be top level of code
passportindex();
app.set('port',process.env.PORT||8001);  // set port 
app.set('view engine', 'html'); // set view option
nunjucks.configure('views', { // set nunjuecks
  express:app,
  watch:true,
});
app.use('/',express.static(path.join(__dirname,"public"))); // set static folder
app.use('/img',express.static(path.join(__dirname,"public/img")));
app.use(process.env.NODE_ENV === "dev" ? morgan('dev') : morgan('combined')); // set morgan
app.use(express.urlencoded({extended:true})); // set urlEncoding
app.use(cookieParser(process.env.COOKIE_SECRET)); // set cookie-parser
app.use(session({
  resave:false,
  saveUninitialized: false,
  secret:process.env.COOKIE_SECRET,
  cookie:{
    httpOnly:true,
    secure:false, // not https
  }
})); // set session

// set mongoose
mongoose.connect(`mongodb+srv://Admin:${process.env.MONGO_PASSWORD}@mongodbtutorial.5lxlo.mongodb.net/nodeWeb?retryWrites=true&w=majority`,{
  useCreateIndex:true,
  useFindAndModify:false,
  useUnifiedTopology:true,
  useNewUrlParser:true
},()=>{
  console.log("Atlas is connected");
  User.findOne({id:"admin"},(err,user)=>{
    if(err) {
      console.error(err);
      return; // 처리좀..
    }

    if(!user){
      const admin = new User({
        id:'admin',
        password:'admin',
      });
      admin.save().then(()=>{
        console.log('admin initialized');
      }).catch(err=>{
        console.error(err);
      });
    }else{
      console.log('admin is already initialized');
    }
  })
  

});
app.use(passport.initialize());
app.use(passport.session());

const indexRouter = require('./routes/page');
const postRouter = require('./routes/post');
app.use('/',indexRouter);
app.use('/post',postRouter);

// 404 error(?) handler
app.use((req,res,next)=>{
  const error = new Error(`Cannot Handle ${req.url}`);
  res.status(404);
  next(error);
});
// error handler
app.use('/',(err,req,res,next)=>{
  res.status(err.status || 500);
  console.log(err.message);
  res.render('error',{message:"예상치 못한 오류가 발생했습니다.",title:"ERROR MESSAGE"});
});

// listening @@
app.listen(app.get('port'),()=>{
  console.log("port number "+app.get('port')+" Waiting");
});

