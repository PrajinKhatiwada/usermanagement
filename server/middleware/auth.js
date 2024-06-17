import jwt from 'jsonwebtoken';
import ENV from '../config.js';

/** auth middleware */
export default function Auth(req, res, next) {
    try {
        // Check for authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Authorization header missing or malformed" });
        }

        // Extract token from header
        const token = authHeader.split(" ")[1];

        // Retrieve the user details of the logged-in user
        const decodedToken = jwt.verify(token, ENV.JWT_SECRET);

        req.user = decodedToken;

        next();
    } catch (error) {
        res.status(401).json({ error: "Authentication Failed!" });
    }
}

/** local variables middleware */
export function localVariables(req, res, next) {
    req.app.locals = {
        OTP: null,
        resetSession: false
    };
    next();
}
