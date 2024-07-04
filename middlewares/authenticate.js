import jwt from 'jsonwebtoken';

import User from '../models/userModel.js';

const authenticate = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({
            success: false,
            errors: {
                token: 'User not logged in'
            }
        });
    };

    let decoded;

    try {
        decoded = await jwt.verify(token, process.env.JWT_AUTH_SECRET_KEY);
    } catch (err) {
        return res.status(401).json({
            success: false,
            errors: {
                token: 'User not logged in'
            }
        });
    };

    if (decoded.purpose !== "auth") {
        return res.status(401).json({
            success: false,
            errors: {
                token: 'User not logged in'
            }
        });
    };

    const user = await User.findOne({
        _id: decoded.userId,
        verification: {
            status: true
        }
    })

    if (!user) {
        return res.status(401).json({
            success: false,
            errors: {
                token: 'User not logged in'
            }
        });
    };

    req.user = user;

    next();
};

export default authenticate;