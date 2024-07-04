import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

import Product from '../models/productModel.js';
import Comment from '../models/commentModel.js';
import averageCalculation from '../modules/averageCalculation.js';


const getProducts = async (req, res) => {
    const products = await Product.find({})
        .populate('user', '-password -_id');

    products.reverse();

    res.status(200).json({
        success: true,
        products
    });
};

const createProduct = async (req, res) => {
    try {
        const { name, description, category, brand, price } = req.body;
        let result;

        if (req.file) {
            result = await cloudinary.uploader.upload(
                req.file.path, {
                use_filename: true,
                folder: "store-app-api"
            });

            fs.unlink(req.file.path, (err) => {
                if (err) return console.error(err.message);
            });
        } else {
            result = {
                secure_url: "",
                public_id: ""
            };
        };

        const product = new Product({
            user: req.user._id,
            name,
            description,
            image: result.secure_url,
            imageId: result.public_id,
            category,
            brand,
            price: Number(price)
        });

        await product.save();

        res.status(201).json({
            success: true,
            product
        });
    } catch (err) {
        let errors = new Object();

        if (err.name === 'ValidationError') {
            Object.keys(err.errors).forEach(key => {
                errors[key] = err.errors[key].message;
            });
        };

        res.status(400).json({
            success: false,
            errors
        });
    };
};

const getProductsForCategory = async (req, res) => {
    const products = await Product.find({
        category: req.params.category
    });

    products.reverse();

    res.status(200).json({
        success: true,
        products
    });
};

const getProduct = async (req, res) => {
    let product;
    try {
        product = await Product.findById(req.params.id)
            .populate('user', '-password -_id');
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: 'Product not found'
        });
    };

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    };

    const comments = Comment.find({ product: product._id });

    product.averageScore = averageCalculation(comments, score);

    res.status(200).json({
        success: true,
        product
    });
};

const deleteProduct = async (req, res) => {
    let product;
    try {
        product = await Product.findById(req.params.id)
            .populate('user');
    } catch (err) {
        return res.status(400).json({
            success: false
        });
    };

    if (!product) {
        return res.status(404).json({
            success: false
        });
    };

    if (product.user._id.equals(req.user._id)) {
        return res.status(400).json({
            success: false
        });
    };

    await Product.findByIdAndDelete(product._id);

    res.status(200).json({
        success: true
    });
};

const getComment = async (req, res) => {
    let comment;
    try {
        comment = await Comment.findById(req.params.id)
            .populate('user', '-password -_id');
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: 'Comment not found'
        });
    };

    if (!comment) {
        return res.status(404).json({
            success: false,
            message: 'Comment not found'
        });
    };

    res.status(200).json({
        success: true,
        comment
    });
};

const shareComment = async (req, res) => {
    let product;
    try {
        product = await Product.findById(req.params.id);
    } catch (err) {
        return res.status(400).json({
            success: false
        });
    };

    if (!product) {
        return res.status(404).json({
            success: false
        });
    };

    try {
        const { text, score } = req.body;
        let result;

        if (req.file) {
            result = await cloudinary.uploader.upload(
                req.file.path, {
                use_filename: true,
                folder: "store-app-api"
            });

            fs.unlink(req.file.path, (err) => {
                if (err) return console.error(err.message);
            });
        } else {
            result = {
                secure_url: null,
                public_id: null
            };
        };

        const comment = new Comment({
            user: req.user._id,
            product: product._id,
            image: result.secure_url,
            imageId: result.public_id,
            text: text,
            score: Number(score)
        });

        res.status(201).json({
            success: true,
            comment
        })

    } catch (err) {
        let errors = new Object();

        if (err.name === 'ValidationError') {
            Object.keys(err.errors).forEach(key => {
                errors[key] = err.errors[key].message;
            });
        };

        res.status(400).json({
            success: false,
            errors
        });
    };
};

const deleteComment = async (req, res) => {
    let comment;
    try {
        comment = await Comment.findById(req.params.id)
            .populate('user', '-password');
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: 'Comment not found'
        });
    };

    if (!comment) {
        return res.status(404).json({
            success: false,
            message: 'Comment not found'
        });
    }; 

    if (comment.user._id.equals(req.user._id)) {
        return res.status(400).json({
            success: false,
            message: 'Comment owner is not authorized'
        });
    };

    await Comment.findByIdAndDelete(comment._id);

    res.status(200).json({
        success: true
    });
};

const getComments = async (req, res) => {
    let product;
    try {
        product = await Product.findById(req.params.id)
            .populate('user', '-password -_id');
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: 'Product not found'
        });
    };

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    };

    const comments = await Comment.find({
        product: product._id
    }).populate('user', '-password -_id');

    comments.reverse();

    res.status(200).json({
        success: true,
        comments
    });
};

export {
    getProducts,
    createProduct,
    getProductsForCategory,
    getProduct,
    deleteProduct,
    getComment,
    shareComment,
    deleteComment,
    getComments
};