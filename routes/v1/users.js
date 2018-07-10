const routes = require('express').Router();
const userController = require('../../controllers/user.controller');
const passport = require('passport');
//@route POST api/users/register
//@desc  Register a user
//@access Public
routes.post('/register',userController.registerUser);

//@route POST api/users/login
//@desc  Login user with email and password
//@access Public
routes.post('/login',userController.login);

//@route Get api/users/current
//@desc  Return current user
//@access Private
routes.get('/current',passport.authenticate('jwt',{session:false}),userController.getCurrentUser);

module.exports = routes;