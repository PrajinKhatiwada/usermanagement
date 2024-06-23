import UserModel from '../model/User.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '../config.js';
import otpGenerator from 'otp-generator';

/** middleware for verify user */
export async function verifyUser(req, res, next){
    try {
        const { username } = req.method === "GET" ? req.query : req.body;

        // check the user existence
        const exist = await UserModel.findOne({ username });
        if(!exist) return res.status(404).send({ error : "Can't find User!" });
        next();
    } catch (error) {
        console.error('Authentication Error:', error);
        return res.status(500).send({ error: "Authentication Error" });
    }
}

/** POST: Register user */
export async function register(req, res) {
    try {
        const { username, password, profile, email } = req.body;        

        // check if the username and email are unique
        const existUsername = UserModel.findOne({ username });
        const existEmail = UserModel.findOne({ email });

        const [usernameResult, emailResult] = await Promise.all([existUsername, existEmail]);

        if (usernameResult) {
            return res.status(400).send({ error: "Please use unique username" });
        }

        if (emailResult) {
            return res.status(400).send({ error: "Please use unique Email" });
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new UserModel({
                username,
                password: hashedPassword,
                profile: profile || '',
                email
            });

            const result = await user.save();
            return res.status(201).send({ msg: "User Registered Successfully" });
        }
    } catch (error) {
        console.error('Error in registration:', error);
        return res.status(500).send({ error: "Registration Failed" });
    }
}

/** POST: User login */
export async function login(req, res) {
    const { username, password } = req.body;

    try {
        const user = await UserModel.findOne({ username });
        if (!user) return res.status(404).send({ error: "Username not Found" });

        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) return res.status(400).send({ error: "Incorrect Password" });

        // create jwt token
        const token = jwt.sign({
            userId: user._id,
            username: user.username
        }, ENV.JWT_SECRET, { expiresIn: "24h" });

        return res.status(200).send({
            msg: "Login Successful!",
            username: user.username,
            token
        });
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).send({ error: "Login Failed" });
    }
}

/** GET: Get user by username */
export async function getUser(req, res) {
    const { username } = req.params;

    try {
        if (!username) return res.status(400).send({ error: "Invalid Username" });

        const user = await UserModel.findOne({ username }).exec();
        if (!user) return res.status(404).send({ error: "User Not Found" });

        const { password, ...rest } = user.toJSON();
        return res.status(200).send(rest);
    } catch (error) {
        console.error('Get User Error:', error);
        return res.status(500).send({ error: "Cannot Find User Data" });
    }
}

/** PUT: Update user */
export async function updateUser(req, res) {
    try {
        const { userId } = req.user;
        if (userId) {
            const body = req.body;
            const data = await UserModel.updateOne({ _id: userId }, body);
            return res.status(200).send({ msg: "Record Updated Successfully" });
        } else {
            return res.status(404).send({ error: "User Not Found" });
        }
    } catch (error) {
        console.error('Update User Error:', error);
        return res.status(500).send({ error: "Update Failed" });
    }
}

/** GET: Generate OTP */
export async function generateOTP(req, res) {
    try {
        req.app.locals.OTP = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        return res.status(200).send({ code: req.app.locals.OTP });
    } catch (error) {
        console.error('Generate OTP Error:', error);
        return res.status(500).send({ error: "OTP Generation Failed" });
    }
}

/** GET: Verify OTP */
export async function verifyOTP(req, res) {
    const { code } = req.query;

    try {
        if (parseInt(req.app.locals.OTP) === parseInt(code)) {
            req.app.locals.OTP = null;
            req.app.locals.resetSession = true;
            return res.status(200).send({ msg: 'Verified Successfully!' });
        } else {
            return res.status(400).send({ error: "Invalid OTP" });
        }
    } catch (error) {
        console.error('Verify OTP Error:', error);
        return res.status(500).send({ error: "OTP Verification Failed" });
    }
}

/** GET: Create Reset Session */
export async function createResetSession(req, res) {
    try {
        if (req.app.locals.resetSession) {
            return res.status(200).json({ flag: req.app.locals.resetSession });
        } else {
            return res.status(440).json({ error: "Session expired!" });
        }
    } catch (error) {
        console.error('Error in createResetSession:', error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

/** PUT: Reset Password */
export async function resetPassword(req, res) {
    try {
        if (!req.app.locals.resetSession) return res.status(440).send({ error: "Session expired!" });

        const { username, password } = req.body;

        try {
            const user = await UserModel.findOne({ username });
            if (!user) return res.status(404).send({ error: "Username not Found" });

            const hashedPassword = await bcrypt.hash(password, 10);

            await UserModel.updateOne({ username: user.username }, { password: hashedPassword });
            req.app.locals.resetSession = false; // reset session
            return res.status(200).send({ msg: "Password Reset Successfully" });
        } catch (error) {
            console.error('Error in resetPassword:', error);
            return res.status(500).send({ error: "Password Reset Failed" });
        }
    } catch (error) {
        console.error('Reset Password Error:', error);
        return res.status(500).send({ error: "Reset Password Failed" });
    }
}
