import express from 'express';

import {
    signupUser,
    loginUser,
    logoutUser
} from '../controllers/userController.js';

const router = express.Router();

router.route('/signup')
    .post(signupUser);

router.route('/login')
    .post(loginUser);

router.route('/logout')
    .delete(logoutUser);

export default router;