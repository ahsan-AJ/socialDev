'use strict';

const routes = require('./appRoutes')();
const passport = require('passport');

module.exports = function(app){



    app.use('/api/v1/posts',routes.posts);
    app.use('/api/v1/users',routes.users);
    app.use('/api/v1/profile',passport.authenticate('jwt',{session:false}),routes.profile);

}