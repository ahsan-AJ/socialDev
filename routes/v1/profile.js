const express = require('express');
const routes = express.Router();
const passport = require('passport');

const profileController = require('../../controllers/profile.controller');

// @route GET /api/profile
// @desc Get Logged In user profile
// @access Private

routes.get('/',profileController.getCurrentProfile);

routes.post('/',profileController.createProfile);

module.exports = routes;