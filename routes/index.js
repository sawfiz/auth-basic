const express = require('express');
const router = express.Router();

const passport = require('passport');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Authentication Basics' });
});

router.get('/sign-up', function (req, res, next) {
  res.render('sign-up-form', { title: 'Sign Up Here' });
});

router.post('/sign-up', async (req, res, next) => {
  bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
    if (err) {
      console.log('Erro hashing password');
    } else {
      try {
        const user = new User({
          username: req.body.username,
          password: hashedPassword,
        });
        const result = await user.save();
        res.redirect('/');
      } catch (err) {
        return next(err);
      }
    }
  });
});

// passport.authenticate() is a function.  If to be called directly,
// need to add (req, res, next) as function parameters
// router.post('/log-in', async (req, res, next) => {
//   passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/',
//   })(req, res, next);
router.post(
  '/log-in',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',
  })
);

module.exports = router;

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});
