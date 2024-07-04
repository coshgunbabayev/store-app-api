import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { ObjectId } from 'mongodb';
import validator from 'validator';

import productDetails from '../json/productDetails.json'

const productSchema = new Schema(
    {
        user: {
            type: ObjectId,
            ref: 'User',
            required: true
        },

        name: {
            type: String,
            required: [true, 'Name area is required']
        },

        description: {
            type: String,
            required: [true, 'Description area is required'],
            minLength: [30, 'Description is too short, at least 30 characters']
        },

        image: {
            type: String,
            required: [true, 'Image area is required']
        },

        imageId: {
            type: String,
        },

        category: {
            type: String,
            required: [true, 'Category area is required'],
            validate: [
                validator.isIn(productDetails.categories),
                'Valid category is required'
            ]
        },

        brand: {
            type: String,
            required: [true, 'Brand area is required']
        },

        price: {
            type: Number,
            required: [true, 'Price area is required'],
            validate: [
                (value) => {
                    if (value <= 0 || isNaN(value)) {
                        return false;
                    };
                    return true;
                },
                'Price must be a number'
            ],
            min: [1, 'Price must be greater than 0']
        }
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);

export default Product;