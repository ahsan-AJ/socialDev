const express = require('express');
const routes = express.Router();
const passport = require('passport');


const profileController = require('../../controllers/profile.controller');

// @route GET /api/profile
// @desc Get Logged In user profile
// @access Private



routes.get('/',profileController.getCurrentProfile);

routes.post('/',profileController.createProfile);


routes.get('/handle/:handle', profileController.getProfileByHandle);

routes.get('/user/:user_id', profileController.getProfileByUserId);


routes.get('/all', profileController.getAllProfiles);

routes.post('/experience', profileController.addExperience);
routes.post('/education', profileController.addEducation);

routes.delete('/experience/:id', profileController.removeExperience);
routes.delete('/education/:id', profileController.removeEducation);

routes.delete('/', profileController.deleteProfile);

module.exports = routes;