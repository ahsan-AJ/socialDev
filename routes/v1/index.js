'use strict';

const routes = require('./appRoutes')();

module.exports = function(app){



    app.use('/api/v1/posts',routes.posts);
    app.use('/api/v1/users',routes.users);
    app.use('/api/v1/profile',routes.profile);

}