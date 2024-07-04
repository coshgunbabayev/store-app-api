import express from 'express';

import {
    getProducts,
    createProduct,
    getProductsForCategory,
    getProduct,
    deleteProduct,
    getComment,
    shareComment,
    deleteComment,
    getComments
} from '../controllers/productController.js';

import authenticate from '../middlewares/authenticate.js';
import Image from '../middlewares/image.js';

const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(authenticate, Image.single("image"), createProduct);

router.route('/:category')
    .get(getProductsForCategory);

router.route('/:id')
    .get(getProduct)
    .delete(authenticate, deleteProduct);

router.route('/comment/:id')
    .get(getComment)
    .post(authenticate, Image.single("image"), shareComment)
    .delete(authenticate, deleteComment);

router.route('/:id/comments')
    .get(getComments);

export default router;