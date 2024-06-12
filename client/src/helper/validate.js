import toast from "react-hot-toast"



/**  validate login page username */

  export async function usernameValidate(values){
    const errors=usernameVerify({},values);
    return errors;
  }


/**  username validation */
function usernameVerify(error={},values){
    if(!values.username){
        error.username=toast.error('Username Required....');
    }else if(values.username.includes("")){
        error.username=toast.error('Invalid Username...');
    }
    return error;
}

/**  validate login page password */

export async function passwordValidate(values){
    const errors=passwordVerify({},values);
    return errors;
  }

/** Password  validation */
function passwordVerify(error = {},values){

    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (!values.password) {
        error.password = toast.error('Password Required...!');
    } else if (values.password.includes(" ")) {
        error.password = toast.error('Password should not contain spaces');
    } else if (values.password.length < 4) {
        error.password = toast.error('Password must be more than four characters');
    } else if (!specialChar.test(values.password)) {
        error.password = toast.error('Password must contain at least one special character');
    }

    return error;
}

/**  validate login page password */

export async function resetPasswordValidation(values){
    const errors=passwordVerify({},values);
   
    if(values.password !== values.confirm_pwd){
        errors.exist=toast.error("Password not match ...!")
    }
    return errors;
}


/**  validate register form  */

export async function registerValidation(values){
    const errors=usernameVerify({},values);
    passwordVerify(errors,values);
    emailVerify(errors,values);

    return errors;
   
}
/**  validate email */
function emailVerify(error = {},values){

    if(!values.email){
        error.email=toast.error("Email Required...!")
    }else if(values.email.includes(" ")){
        error.email=toast.error("Wrong Email...!")
    }else if(! /^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(values.email)){
        error.email=toast.error("Invalid email address ...!")
    }


    return error;
}

/**  validate profile page */
export async function profileValidation(values){
    const errors=emailVerify({},values);
    return errors;
}