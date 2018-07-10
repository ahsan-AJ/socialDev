const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateRegisterInput(data) {
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword : '';


    if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
        errors.name = 'Name must be between  2 and 30 Characters'
    }
    if (Validator.isEmpty(data.name)) {
        errors.name = "Name is required";
    }
    if (Validator.isEmpty(data.email)) {
        errors.name = "Email is required";
    }
    if (Validator.isEmpty(data.password)) {
        errors.name = "Password is required";
    }
    if (Validator.isEmpty(data.confirmPassword)) {
        errors.name = "Confirm Password is required";
    }

    if(!Validator.equals(data.password,data.confirmPassword)) {
        error.confirmPassword = "Password must match"
    }



    return {
        errors,
        isValid: isEmpty(errors)
    }


}