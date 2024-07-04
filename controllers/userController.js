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
    let decoded;

    try {
        decoded = await jwt.verify(token, process.env.JWT_VERIFY_SECRET_KEY);
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    };

    if (decoded.purpose !== 'verify') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    };

    const user = await User.findById(decoded.userId);

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
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });
    };

    

    if (!await bcrypt.compare(password, user.password)) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });
    };

    const token = jwt.sign(
        {
            userId: user._id,
            purpose: 'auth'
        },
        process.env.JWT_AUTH_SECRET_KEY,
        {
            expiresIn: "7d"
        }
    );

    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });

    res.status(200).json({
        success: true
    });
};

const logoutUser = (req, res) => {
    res.clearCookie('token');

    res.status(200).json({
        success: true
    });
};

const getUser = async (req, res) => {
    let user;
    try {
        user = await User.findOne({
            username: req.user.username,
            verification: {
                status: true
            }
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
        });
    };

    if (!user) {
        return res.status(400).json({
            success: false
        });
    };

    res.status(200).json({
        success: true,
        user
    });
};

export {
    signupUser,
    verifyUser,
    loginUser,
    logoutUser,
    getUser
};