import express from 'express';

import {
    signupUser,
    verifyUser,
    loginUser,
    logoutUser,
    getUser
} from '../controllers/userController.js';

const router = express.Router();

router.route('/signup')
    .post(signupUser);

router.route('/verify')
    .post(verifyUser);

router.route('/login')
    .post(loginUser);

router.route('/logout')
    .delete(logoutUser);

router.route('/:username')
    .get(getUser);

export default router;