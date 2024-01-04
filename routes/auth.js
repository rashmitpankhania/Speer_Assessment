var express = require('express');
var router = express.Router();
const User = require('../model/user');

/* Sign up. */
router.post('/signup', function(req, res, next) {
  const {firstName, lastName, email, password} = req.body;
  if(!(email && password && firstName && lastName))
    res.status(400).send('All input is needed!');

  const existingUser = User.findOne({email});
  if(existingUser)
    res.status(409).send('User already exist.')
});

module.exports = router;
