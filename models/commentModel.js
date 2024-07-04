import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { ObjectId } from 'mongodb';
import validator from 'validator';


const commentSchema = new Schema(
    {
        user: {
            type: ObjectId,
            ref: 'User',
            required: true
        },

        product: {
            type: ObjectId,
            ref: 'Product',
            required: true
        },

        image: {
            type: String,
            default: null
        },

        imageId: {
            type: String,
            default: null
        },

        text: {
            type: String,
            required: [true, 'Text area is required'],
            maxLength: [500, 'Text area maximum length is 500']
        },
        
        score: {
            type: Number,
            required: [true, 'Score area is required'],
            validate: [
                (value) => {
                    if (value <= 0 || value > 5 || isNaN(value)) {
                        return false;
                    };
                    return true;
                },
                'Valid score is required, minimum value is 1 and maximum value is 5'
            ]
        }
    },
    {
        timestamps: true
    }
);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;