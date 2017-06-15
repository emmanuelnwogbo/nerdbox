function loggedOut(req, res, next) {
  if (req.session && req.session.userId) {
    return res.redirect('/profile');
  }
  return next();
}

function needLogIn(req, res, next) {
  if(!req.session.userId) {
    return res.redirect('/join');
  }
  return next();
}

//directly below is what I believe is a better implementation of what I was trying to achieve with the needLogIn function.

/*function requiresLogin(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  else {
    res.redirect('/join');
  }
}*/

module.exports.loggedOut = loggedOut;
module.exports.needLogIn = needLogIn;
