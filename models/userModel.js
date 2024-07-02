import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

import {
    isValidPassword
} from '../modules/isValid.js';

import {
    generateVerificationCode
} from '../modules/randomGenerate.js';

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name area is required']
    },

    surname: {
        type: String,
        required: [true, 'Surname area is required']
    },

    email: {
        type: String,
        required: [true, 'Email area is required'],
        validate: [validator.isEmail, 'Valid email is required'],
        unique: true
    },

    password: {
        type: String,
        required: [true, 'Password area is required'],
        minLength: [8, 'Password is too short, at least 8 characters'],
        validate: [isValidPassword, 'Invalid password. Password must contain at least one number, one lowercase letter, one uppercase letter, and should not contain spaces.']
    },

    verification: {
        status: {
            type: Boolean,
            default: false
        },

        code: {
            type: String,
            default: generateVerificationCode(6)
        }
    }
});

userSchema.pre("save", function (next) {
    const user = this;
    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) return console.log(err.message);
        user.password = hash;
        next();
    });
});

const User = mongoose.model('User', userSchema);

export default User;