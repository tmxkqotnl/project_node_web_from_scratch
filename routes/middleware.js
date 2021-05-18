exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).redirect('/');
}
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent('로그인한 상태입니다.');
    res.redirect(`/?error=${message}`);
  }
};
exports.checkContent = (req,res,next)=>{
  if(req.body.body == null || req.body.title == null || req.body.title.length>=60){        
    return res.redirect('/post')
  }    
  next();
};