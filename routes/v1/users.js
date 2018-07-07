const routes = require('express').Router();
const userController = require('../../controllers/user.controller');
//@route POST api/users/register
//@desc  Register a user
//@access Public
routes.post('/register',userController.registerUser);

//@route POST api/users/login
//@desc  Login user with email and password
//@access Public
routes.post('/login',userController.login);



module.exports = routes;