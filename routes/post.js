const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Article } = require("../models/article");
const { Hashtag } = require("../models/hashtag");
const {
  isLoggedIn,
  isNotLoggedIn,
  checkContent,
  findTag,
} = require("./middleware");

router.use((req, res, next) => {
  next();
});
router.get("/", isLoggedIn, (req, res) => {
  res.render("post", {
    title: "posting",
    session: req.session,
    post: true,
  });
});

router.post("/", isLoggedIn, checkContent, findTag, (req, res, next) => {
  const title = req.body.title;
  const body = req.body.content;
  const post = new Article({
    title: title,
    content: body,
    date: new Date(),
  })
    .save()
    .then((posted) => {
      console.log("Posting content : " + title + " " + body);
      console.log("post Save successfully");
      console.log(res.locals.tag);
      if (res.locals.tag.length === 0) {
        const tag = { name: "none" };
        Hashtag.findOne(tag)
          .then((doc) => {
            if (!doc) {
              const newTag = new Hashtag({
                name: tag.name,
                ids: [posted._id],
              })
                .save()
                .then(() => {
                  console.log("new tag Saved");
                })
                .catch((err) => {
                  console.error(err);
                  res.render("error", { message: err.message });
                });
            } else {
              const origin = doc.ids;
              origin.push(posted._id);
              Hashtag.updateOne({ name: doc.name }, { ids: origin })
                .then(() => {
                  console.log("old tag updated");
                })
                .catch((err) => {
                  console.error(err);
                  res.render("error", { message: err.message });
                });
            }
          })
          .catch((err) => {
            console.error(err);
            res.render("error", { message: err.message });
          });
      } else {
        for (let tag of res.locals.tag) {
          console.log(tag);
          Hashtag.findOne({name:tag})
            .then((doc) => {
              if (!doc) {
                const newTag = new Hashtag({
                  name: tag,
                  ids: [posted._id ],
                })
                  .save()
                  .then(() => {
                    console.log("new tag Saved");
                  })
                  .catch((err) => {
                    console.error(err);
                    res.render("error", { message: err.message });
                  });
              } else {
                const origin = doc.ids;
                origin.push(posted._id);
                Hashtag.updateOne({ name: doc.name }, { ids: origin })
                  .then(() => {
                    console.log("old tag updated");
                  })
                  .catch((err) => {
                    console.error(err);
                    res.render("error", { message: err.message });
                  });
              }
            })
            .catch((err) => {
              console.error(err);
              res.render("error", { message: err.message });
            });
        }
      }
      res.redirect("/");
    })
    .catch((err) => {
      console.err(err);
      res.render("error", { message: err.message });
    });
});

module.exports = router;
