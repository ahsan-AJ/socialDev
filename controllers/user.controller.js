const User = require('../models/User');
const gravatar = require('gravatar');
const { jwtKey } = require('../config/keys');
const jwt = require('jsonwebtoken');

const validateRegisterInput = require('../lib/validations/register');
const validateLoginInput = require('../lib/validations/login');
const success = require('../lib/status').sendSuccessStatus;
const failure = require('../lib/status').sendErrorStatus;

async function registerUser(req, res, next) {

    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return failure(res, 400, errors);
    }

    const user = await User.findOne({ email: req.body.email });
    if (user) {
        return failure(res, 400, 'User already registered with this email');
    } else {
        const avatar = gravatar.url(req.body.email, {
            s: '200', // size,
            r: 'pg', // rating,
            d: 'mm', //default
        });

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            avatar: avatar,
            password: req.body.password
        });

        const result = await newUser.save();
        if (!result) {
            return failure(res, 400, 'Unable to save user');
        }

        return success(res, 200, { message: 'user registered', data: result });
    }
}

async function login(req, res, next) {

    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return failure(res, 400, errors);
    }

    const email = req.body.email;
    const password = req.body.password;


    try {
        const user = await User.findOne({ email });
        if (!user) {

            return failure(res, 404, 'user with the specified email not found')
        }
        const passwordPromise = user.comparePassword(password);
        const result = await passwordPromise;
        if (result) {

            // return success(res, 200, 'user logged in successfully')

            const payload = {
                id: user.id,
                name: user.name,
                avatar: user.avatar
            }

            // Sign Token
            try {
                const token = await jwt.sign(payload, jwtKey, { expiresIn: 3600 });
                if (token) success(res, 200, { token: `Bearer ${token}` });
            } catch (error) {
              return failure(res, 500, 'Internal server error')
            }
        } else {
            return failure(res, 400, 'password incorrect');
        }
    } catch (error) {
        return failure(res, 500, `server error ${error}`);
    }
}

async function getCurrentUser(req,res,next){
    const _json = {
        id : req.user.id,
        name : req.user.name,
        email : req.user.email
    }
    success(res,200,_json);
}

module.exports = {
    registerUser: registerUser,
    login: login,
    getCurrentUser:getCurrentUser
};