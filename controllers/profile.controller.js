const jwt = require('jsonwebtoken');

const Profile = require('../models/Profile');


const validateProfileInput = require('../lib/validations/profile');
const success = require('../lib/status').sendSuccessStatus;
const failure = require('../lib/status').sendErrorStatus;

async function createProfile(req,res,next){

    const { errors, isValid } = validateProfileInput(req.body);

    if (!isValid) {
        return failure(res, 400, errors);
    }

    console.log('REq Uers\n', req.user);

    const profileFields = {
        user : req.user.id,
        handle : req.body.handle ? req.body.handle :'',
        company : req.body.company ? req.body.company :'',
        website : req.body.website ? req.body.website :'',
        location : req.body.location ? req.body.location :'',
        status : req.body.status ? req.body.status :'',
        githubUsername: req.body.githubUsername ? req.body.githubUsername :'',
        skills: (typeof req.body.skills !== undefined) ? req.body.skills.split(',') : '',
        social: {
            youtube: req.body.youtube ? req.body.youtube : null,
            twitter: req.body.twitter ? req.body.twitter : null,
            facebook: req.body.facebook ? req.body.facebook : null,
            linkedin : req.body.linkedin ? req.body.linkedin : null
        },
    };

    try {
        const profile = await Profile.findOne({user: req.user.id});
        if(profile){
            const result = await Profile.findOneAndUpdate({user:req.id},{$set:profileFields},{new : true});
            return success(res,200,{data:result});
        }else{
            const profile = await Profile.findOne({handle : profileFields.handle});
            if(profile) return failure(res,400,{error:'This handle already exists'});

            const newProfile = await new Profile(profileFields);
            const result = await newProfile.save();
            console.log('Result\n',result);
            if(result) return success(res,200,{data:result});
            else {
                return failure(res,400,{error:'unable to save profile'})
            }
        }

    }catch (error){
        return failure(res,400,{error:error})
    }

}



async function getCurrentProfile (req,res,next){
    const errors = {};

    try {
        const profile = await Profile.findOne({user: req.user.id});

        if (!profile) {
            errors.noProfile = 'profile not found';
            return failure(res, 404, errors);
        }
        return success(res,200,{success:true,data:profile})
    }catch(error){
        return failure(res,404,error);
    }


}


module.exports = {
    getCurrentProfile:getCurrentProfile,
    createProfile:createProfile
}