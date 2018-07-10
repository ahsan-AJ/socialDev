const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const User = require('../models/User');
const { jwtKey } = require('./keys');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secret = jwtKey;

module.exports = passport => {
    passport.use(new JwtStrategy(opts,  (jwt_payload, done) => {
       User.findById(jwt_payload.id)
           .then(user => {
               if(user){
                   return done(null,user)
               }
               return done(null,false);
           }).catch(err => {return done(err,false)})

    }))
}