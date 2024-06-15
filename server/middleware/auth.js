import jwt from 'jsonwebtoken';
import ENV from '../config.js';

export default async function Auth(req, res, next) {
    try {
        // Access authorization header to validate request
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: "Authorization header missing!" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Token missing!" });
        }

        // Verify token and retrieve user details
        const decodedToken = jwt.verify(token, ENV.JWT_SECRET);
        req.user = decodedToken;
        
        next();  // Move to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ error: "Authentication failed!" });
    }
}

export function localVariables(req,res,next){

    req.app.locals={
        OTP:null,
        resetSession:false
    }
    next()
}