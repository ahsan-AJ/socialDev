const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        minlength : 2,
        maxlength : 30
    },
    email : {
        type : String,
        required : true,
        maxlength : 30,
        unique : true
    },
    password : {
        type : String,
        required : true,
        minlength : 6,
        maxlength : 10
    },
    avatar : {
        type : String,
    },
    date : {
        type : Date,
        default : Date.now
    }
});

UserSchema.methods.comparePassword = function(candidatePassword){

    return bcrypt.compare(candidatePassword,this.password)

};

UserSchema.pre('save',async function(next){
    let user = this;
    try {
        let salt = await bcrypt.genSalt(12);
        let hash = await bcrypt.hash(user.password,salt);

        user.password = hash;
        next();
    }
    catch(error){
        console.log(error);
        next(error);
    }
})


module.exports = mongoose.model('User',UserSchema);