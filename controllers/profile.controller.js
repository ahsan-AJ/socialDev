const jwt = require('jsonwebtoken');

const Profile = require('../models/Profile');
const User = require('../models/User');


const validateProfileInput = require('../lib/validations/profile');
const validateExperienceInput = require('../lib/validations/experience');
const validateEducationInput = require('../lib/validations/education');
const success = require('../lib/status').sendSuccessStatus;
const failure = require('../lib/status').sendErrorStatus;

async function createProfile(req,res,next){

    const { errors, isValid } = validateProfileInput(req.body);

    if (!isValid) {
        return failure(res, 400, errors);
    }

    // console.log('REq Uers\n', req.user);

    const profileFields = {
        user : req.user.id,
        handle : req.body.handle ? req.body.handle :'',
        company : req.body.company ? req.body.company :'',
        website : req.body.website ? req.body.website :'',
        bio : req.body.bio ? req.body.bio : '',
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

            const result = await Profile.findOneAndUpdate({user:req.user.id},{$set:profileFields},{new : true});

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
        const profile = await Profile.findOne({user: req.user.id}).populate('User', ['name','avatar']);

        if (!profile) {
            errors.noProfile = 'profile not found';
            return failure(res, 404, errors);
        }
        return success(res,200,{success:true,data:profile})
    }catch(error){
        return failure(res,404,error);
    }


}


async function getProfileByHandle(req,res,next) {
    const errors = {};

    try{
        const profile = await  Profile.findOne({handle:req.params.handle}).populate('User', ['name', 'avatar']);
        if(!profile) {
            errors.noProfile = 'there is no profile with this particular handle';
            return failure(res,404,errors);
        }

        return success(res,200,{profile})

    }catch(error) {
        errors.error = error.message;
        return failure(res,400,errors);
    }

}


async function getProfileByUserId(req,res,next) {
    const errors = {};

    try{
        const profile = await  Profile.findOne({user:req.params.user_id}).populate('User', ['name', 'avatar']);
        if(!profile) {
            errors.noProfile = 'there is no profile with this particular id';
            return failure(res,404,errors);
        }

        return success(res,200,{profile})

    }catch(error) {
        errors.message = error.message;
        return failure(res,400,errors);
    }

}


async function getAllProfiles(req,res,next){
    const errors = {};
    try{
        const profiles = await  Profile.find().populate('User', ['name', 'avatar']);
        if(!profiles) {
            errors.noProfile = 'profiles not found';
            return failure(res,404,errors);
        }

        return success(res,200,{profiles})

    }catch(error) {
        errors.message = error.message;
        return failure(res,400,errors);
    }
}


async function addExperience(req,res,next){

    const { errors, isValid } = validateExperienceInput(req.body);

    if (!isValid) {
        return failure(res, 400, errors);
    }


    try{
        const profile = await  Profile.findOne({user: req.user.id});
        if(!profile) {
            errors.noProfile = 'profile not found';
            return failure(res,404,errors);
        }
        const newExp = {
            title: req.body.title,
            company: req.body.company,
            location: req.body.location,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description
        }

        // Add to experience array

        profile.experience.unshift(newExp);
        const result = await profile.save();
        return success(res,200,{message:'experience added ', result})

    }catch(error) {
        errors.message = error.message;
        return failure(res,400,errors);
    }

}

async function removeExperience(req,res,next) {
    const errors = {}
    const expId = req.params.id;
    try{
        const profile = await  Profile.findOne({user: req.user.id});
        if(!profile) {
            errors.noProfile = 'profile not found';
            return failure(res,404,errors);
        }

        const removeIndex = profile.experience
            .map((item) => item.id)
            .indexOf(expId);

        profile.experience.splice(removeIndex,1);

        const result = await profile.save();
        return success(res,200,{message:'experience deleted', result})

    }catch(error) {
        errors.message = error.message;
        return failure(res,400,errors);
    }

}


async function addEducation(req,res,next){
    const { errors, isValid } = validateEducationInput(req.body);


    if (!isValid) {
        console.log(errors);
        return failure(res, 400, errors);
    }
    try{
        const profile = await  Profile.findOne({user: req.user.id});
        if(!profile) {
            errors.noProfile = 'profile not found';
            return failure(res,404,errors);
        }
        const newEdu = {
            school: req.body.school,
            degree: req.body.degree,
            fieldOfStudy: req.body.fieldOfStudy,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description
        }

        // Add to experience array

        profile.education.unshift(newEdu);
        const result = await profile.save();
        return success(res,200,{message:'education added',result})

    }catch(error) {
        errors.message = error.message;
        return failure(res,400,errors);
    }
}


async function removeEducation(req,res,next) {
    const errors = {};
    const eduId = req.params.id;
    try{
        const profile = await  Profile.findOne({user: req.user.id});
        if(!profile) {
            errors.noProfile = 'profile not found';
            return failure(res,404,errors);
        }

        const removeIndex = profile.education
            .map((item) => item.id)
            .indexOf(eduId);

        profile.education.splice(removeIndex,1);

        const result = await profile.save();
        return success(res,200,{message:'education deleted', result})

    }catch(error) {
        errors.message = error.message;
        return failure(res,400,errors);
    }
}

async function deleteProfile(req,res,next) {
    const errors = {};
    Profile.findOneAndRemove({user: req.user.id})
             .then(() => {
                 return User.findOneAndRemove({_id :req.user.id})
             })
             .then(() => {
                 return success(res,200,{message:'user deleted'})
             })
             .catch((error) => {
                 errors.message = error.message;
                 return failure(res,400,errors);
             })
}
module.exports = {
    getCurrentProfile:getCurrentProfile,
    createProfile:createProfile,
    getProfileByHandle:getProfileByHandle,
    getProfileByUserId:getProfileByUserId,
    getAllProfiles:getAllProfiles,
    addExperience:addExperience,
    addEducation:addEducation,
    removeExperience:removeExperience,
    removeEducation:removeEducation,
    deleteProfile:deleteProfile


}