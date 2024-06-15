import UserModel from '../model/User.model.js'
import bcrypt from 'bcrypt'
import  jwt  from 'jsonwebtoken'
import ENV from '../config.js'
import otpGenerator from 'otp-generator'

/** Middleware for verifying user */

export async function verifyUser(req, res, next) {
    try {
        const { username } = req.method == "GET" ? req.query : req.body;
        // Check if the user exists
        let exist = await UserModel.findOne({ username });
        if (!exist) return res.status(404).send({ error: "Can't find User!" });
        next();
    } catch (error) {
        return res.status(404).send({ error: "Authentication Error" });
    }
}

export async function register(req, res) {
    try {
        const { username, password, profile, email } = req.body;
        console.log(username, password, profile, email);

        // Check for existing username
        const existingUserByUsername = await UserModel.findOne({ username });
        if (existingUserByUsername) {
            return res.status(400).json({ error: "Please use a unique username" });
        }

        // Check for existing email
        const existingUserByEmail = await UserModel.findOne({ email });
        if (existingUserByEmail) {
            return res.status(400).json({ error: "Please use a unique email" });
        }

        if (!password) {
            return res.status(400).json({ error: "Password is required" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new UserModel({
            username,
            password: hashedPassword,
            profile: profile || ' ',
            email
        });

        // Save the user and send the response
        await user.save();
        return res.status(201).json({ msg: "User Registered Successfully" });

    } catch (error) {
        console.error("Error during user registration:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

//export const registerMail = (req, res) => {
    // Your implementation for registerMail
// };

export async function login (req, res) {
    const { username, password } = req.body; // Destructure username and password from request body

    try {
        UserModel.findOne({ username })
            .then(user => {
                if (!user) {
                    return res.status(404).send({ error: "Username not found" });
                }

                bcrypt.compare(password, user.password)
                    .then(passwordCheck => {
                        if (!passwordCheck) {
                            return res.status(400).send({ error: "Password does not match" });
                        }

                        // Create jwt token
                        const token = jwt.sign({
                            userID: user._id,
                            username: user.username
                        }, ENV.JWT_SECRET, { expiresIn: "24h" });

                        return res.status(201).send({
                            msg: "Login Successful",
                            username: user.username,
                            token
                        });
                    })
                    .catch(error => {
                        return res.status(500).send({ error: "Error comparing passwords" });
                    });
            })
            .catch(error => {
                return res.status(500).send({ error: "Error finding user" });
            });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}
export async function getUser(req, res) {
    const { username } = req.params;

    try {
        if (!username) {
            return res.status(400).send({ error: "Invalid Username" });
        }

        const user = await UserModel.findOne({ username });
        console.log(username);

        if (!user) {
            return res.status(404).send({ error: "Couldn't find the User" });
        }

        // Remove password from user
        // Mongoose returns unnecessary data with the object so convert it into JSON
        const { password, ...rest } = user.toObject();

        return res.status(200).send(rest);

    } catch (error) {
        console.error("Error retrieving user data:", error);
        return res.status(500).send({ error: "Cannot find User data" });
    }
}

export async function updateUser(req, res) {
    try {
        const { id } = req.query; // Destructure directly from req.query
        console.log(id);  // Corrected variable name for logging
        
        if (id) {
            const body = req.body;

            // Updating the data
            const result = await UserModel.updateOne({ _id: id }, body);
            
            if (result.nModified === 0) {
                return res.status(404).send({ error: "User not found or no changes made." });
            }

            return res.status(200).send({ msg: "Record Updated!" });
        } else {
            return res.status(400).send({ error: "User ID not provided." });
        }
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
}
export async function generateOTP(req,res){
    req.app.locals.OTP=await otpGenerator.generate(4,{lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false});
   res.status(201).send({code:req.app.locals.OTP})
}

export async function verifyOTP(req,res){
    const{ code } =req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP=null;// reset OTP value
        req.app.locals.resetSession = true;  // set the session for reset password
       
        return res.status(201).send({msg:'Verify Successfully!'})

    }
    return res.status(400).send({ error:"Invalid OTP code " })
}

// successfully redirect user when OTP is valid

export async function createResetSession(req,res){
    if(app.req.locals.resetSession){
        req.app.locals.resetSession=false;//allow access to this route only once
        return res.status(201).send({msg:"access granted !"})
    }
    return res.status(401).send({error:"Session Expired !"})

}

// update the password when we have valid session

export async function resetPassword(req, res) {
    try {
        if(!req.app.locals.resetSession) return res.status(401).send({error:"Session Expired !"})
        const { username, password } = req.body;

        // Find the user by username
        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(404).send({ error: "Username not found" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user's password
        await UserModel.updateOne({ username: user.username }, { password: hashedPassword });

        return res.status(201).send({ msg: "Password Updated" });
    } catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
}
