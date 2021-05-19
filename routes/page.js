const express = require("express");
const passport = require("passport");
const { User } = require("../models/user");
const { Hashtag } = require("../models/hashtag");
const { Article } = require("../models/article");
const { isLoggedIn, isNotLoggedIn } = require("./middleware");
const router = express.Router();

router.use((req, res, next) => {
  next();
});
router.get("/", (req, res, next) => {
  if (!req.query.tag) {
    Article.find({}, (err, articles) => {
      if (err) return next(err);
      Hashtag.find({}, (err, tags) => {
        if (err) return next(err);
        const lists = [];
        for (let i of tags) {
          lists.push({ name: i.name, num: i.ids.length });
        }
        res.render("index", {
          title: "Home",
          session: req.session,
          articles,
          items: lists,
        });
      });
    });
  } else {
    Hashtag.find({ name: req.query.tag })
      .then((docs) => {
        const tagged = [];
        for (let id of docs[0].ids) {
          Article.findOne({ _id: id }).then((doc) => {
            tagged.push(doc);
          });
        }
        Hashtag.find({}, (err, tags) => {
          if (err) return next(err);
          const lists = [];
          for (let i of tags) {
            lists.push({ name: i.name, num: i.ids.length });
          }
          res.render("index", {
            title: "Home",
            session: req.session,
            articles: tagged,
            items: lists,
          });
        });
      })
      .catch((err) => {});
  }
});
router.get("/logout", isLoggedIn, (req, res) => {
  req.logOut();
  req.session.destroy();
  res.redirect("/");
});
router.get("/login", isNotLoggedIn, (req, res) => {
  res.render("login", { title: "Login", login: true });
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

router.get("/content", (req, res, next) => {
  Article.findById(req.query.id, (err, doc) => {
    if (err) {
      return next(err);
    }
    if (doc) {
      res.render("content", {
        title: "content",
        target: doc,
        session: req.session,
      });
    } else {
      res.redirect("/");
    }
  });
});

router.post("/del", (req, res, next) => {
  Article.findByIdAndDelete(req.query.id, (err, doc) => {
    if (err) return next(err);
    console.log("document deleted");
    Hashtag.find({ ids: doc._id })
      .then((docs) => {
        for (let d of docs) {
          let temp = d.ids;

          temp.splice(temp.indexOf(doc._id), 1);
          Hashtag.updateOne({ name: d.name }, { ids: temp })
            .then(() => {
              console.log("hashtag modified");
            })
            .catch((err) => {
              console.error(err);
            });
        }
      })
      .catch((err) => {
        console.error(err);
      });

    res.send({ sign: "ok" });
  });
});

module.exports = router;
