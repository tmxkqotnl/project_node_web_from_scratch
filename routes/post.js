const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Article} = require('../models/article');
const {isLoggedIn,isNotLoggedIn,checkContent} = require('./middleware');

router.use((req,res,next)=>{
  next();
});
router.get('/',isLoggedIn,(req,res)=>{
  res.render('post',{title:"posting", session:req.session});
});
router.post('/',checkContent,isLoggedIn,(req,res)=>{
  const title = req.body.title;
  const body = req.body.body;
  const post = new Article({
    title:title,
    body:body,
    date:new Date(),
  }).save().then(()=>{
    console.log("Posting content : "+title+" "+body);
    console.log("Save successfully");
    res.redirect('/');
  }).catch(err=>{
    console.err(err);
    res.render('error',{message:err.message});
  });
});


module.exports = router;