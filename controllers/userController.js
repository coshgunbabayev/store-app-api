import jwt from 'jsonwebtoken';

import User from '../models/userModel.js';
import {
    sendVerificationCode
} from '../smtp/send.js'

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

const loginUser = (req, res) => {
    // do something
};

const logoutUser = (req, res) => {
    // do something
};

export {
    signupUser,
    loginUser,
    logoutUser
};