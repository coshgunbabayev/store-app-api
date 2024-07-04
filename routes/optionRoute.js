import express from 'express';

import {
    getCategories
} from '../controllers/optionController.js';

const router = express.Router();

router.route('/categories')
    .get(getCategories);

export default router;