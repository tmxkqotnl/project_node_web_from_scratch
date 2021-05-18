const express = require("express");
const passport = require("passport");
const { User } = require("../models/user");
const { Article } = require("../models/article");
const { isLoggedIn, isNotLoggedIn } = require("./middleware");
const router = express.Router();

router.use((req, res, next) => {
  next();
});
router.get("/", (req, res,next) => {
  Article.find({}, (err, articles) => {
    if (err) return next(err);
    res.render("index", {
      title: "Home",
      session: req.session,
      articles,
    });
  });
});
router.get("/logout", isLoggedIn, (req, res) => {
  req.logOut();
  req.session.destroy();
  res.redirect("/");
});
router.get("/login", isNotLoggedIn, (req, res) => {
  res.render("login", { title: "Login", log:"in"});
});
router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.render("login", info);
    }

    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect("/");
    });
  })(req, res, next);
});

router.get('/content', (req,res,next)=>{
  Article.findById(req.query.id,(err,doc)=>{
    if(err){
      return next(err);
    }
    if(doc){
      res.render('content',{
        title:"content",
        target:doc,
      });
    }else{
      res.redirect('/');
    }    
  });
  
});

module.exports = router;
