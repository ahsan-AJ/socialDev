const User = require('../models/User');
const gravatar = require('gravatar');
const success = require('../lib/status').sendSuccessStatus;
const failure = require('../lib/status').sendErrorStatus;

async function registerUser(req,res,next){

    const user = await User.findOne({email:req.body.email});
    if(user){
        return failure(res,400,'User already registered with this email');
    }else {
        const avatar = gravatar.url(req.body.email,{
            s : '200', // size,
            r : 'pg', // rating,
            d : 'mm', //default
        });

        const newUser = new User({
            name : req.body.name,
            email : req.body.email,
            avatar : avatar,
            password : req.body.password
        });

        const result = await newUser.save();
        if(!result){
            return failure(res,400,'Unable to save user');
        }

        return success(res,200,{message:'user registered', data : result});
    }
}

async function login(req,res,next){
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await User.findOne({email});
        if (!user) {
            return failure(res, 404, 'user with the specified email not found')
        }
        const passwordPromise = user.comparePassword(password);
        const result = await passwordPromise;
        if (result) {
            return success(res, 200, 'user logged in successfully')
        } else {
            return failure(res, 400, 'password incorrect');
        }
    }catch (error){
        return failure(res,500,`server error ${error}`);
    }
}

module.exports = {
    registerUser : registerUser,
    login:login
};