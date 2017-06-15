const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mid = require('../middleware/index');

/* GET home page. */
router.get('/', mid.loggedOut, function(req, res, next) {
  res.render('index', { });
});

router.get('/signin', mid.loggedOut, function(req, res, next) {
  res.render('signin');
});

router.get('/profile', mid.needLogIn, function(req, res, next) {
  /*if(! req.session.userId) {
    res.send('you are not logged in');
  }*/
  User.findById(req.session.userId)
    .exec(function(error, user) {
      if(error) {
        return next(error);
      }
      else {
        return res.render('profile', {
      });
    }
  });

});

router.post('/signin', function(req, res, next) {
  if(req.body.userid && req.body.newpassword) {
    User.authenticate(req.body.userid, req.body.newpassword, function(error, user) {
      if (error || !user) {
        res.send('wrong email or password');
      }
      else {
        req.session.userId = user._id;
        res.redirect('/profile');
      }
    });
  }
  else {
    res.send('pls fill in all the spaces');
  }
});

router.get('/join', mid.loggedOut, function(req, res, next) {
  res.render('signup');
});

router.post('/joinnerdbox', mid.loggedOut, function(req, res, next) {
  if(req.body.userid && req.body.newpassword) {
    let userData = {
      userid: req.body.userid,
      newpassword: req.body.newpassword
    };

    User.create(userData, function(error, user) {
      if(error) {
        return next(error);
      }
      else{
        req.session.userId = user._id;
        res.redirect('/profile');
      }
    });
  }

  else {
    let err = new Error('all fields required');
    err.status = 400;
    return next(err);
  }
});

router.get('/logout', function(req, res, next) {
  if(req.session) {
    //delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      }
      else {
        return res.redirect('/');
      }
    });
  }
});


module.exports = router;
