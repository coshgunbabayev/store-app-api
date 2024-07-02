import jwt from 'jsonwebtoken';

import User from '../models/userModel.js';

import {
    sendVerificationCode
} from '../smtp/send.js'
import {
    generateVerificationCode
} from '../modules/randomGenerate.js';

const signupUser = async (req, res) => {
    try {
        const { name, surname, email, password } = req.body;
        const user = new User({
            name,
            surname,
            email,
            password
        });

        await user.save();

        await sendVerificationCode(user.email, user.verification.code);

        const token = jwt.sign(
            {
                userId: user._id,
                purpose: 'verify'
            },
            process.env.JWT_VERIFY_SECRET_KEY,
            {
                expiresIn: "15m"
            }
        );

        res.status(201).json({
            success: true,
            verificationToken: token
        });
    } catch (err) {
        let errors = new Object();

        if (err.name === 'ValidationError') {
            Object.keys(err.errors).forEach(key => {
                errors[key] = err.errors[key].message;
            });
        };

        if (err.name === 'MongoServerError' && err.code === 11000) {
            if (err.keyPattern.email) {
                errors.email = 'This email is already in use';
            };
        };

        res.status(400).json({
            success: false,
            errors
        });
    };
};

const verifyUser = async (req, res) => {
    const { token, code } = req.body;
    let user;

    try {
        var { userId, purpose } = jwt.verify(token, process.env.JWT_VERIFY_SECRET_KEY);

        if (purpose !== 'verify') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        };

        user = await User.findById(userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        };

        if (user.verification.status) {
            return res.status(400).json({
                success: false,
                message: 'User already verified'
            });
        };

        if (user.verification.code !== code) {
            user.verification.code = generateVerificationCode(6);
            await user.save();
            await sendVerificationCode(user.email, user.verification.code);

            return res.status(400).json({
                success: false,
                errors: {
                    code: 'Invalid verification code, we send a new verification code'
                }
            });
        } else {
            user.verification = {
                status: true
            };

            await user.save();

            return res.status(200).json({
                success: true
            });
        };
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    };
};

const loginUser = (req, res) => {
    // do something
};

const logoutUser = (req, res) => {
    // do something
};

export {
    signupUser,
    verifyUser,
    loginUser,
    logoutUser
};