const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    ingredients: [{
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: String,
            required: true
        },
        unit: {
            type: String,
            required: true
        }
    }],
    steps: [{
        stepNumber: {
            type: Number,
            required: true
        },
        instruction: {
            type: String,
            required: true
        }
    }],
    cookingTime: {
        type: Number,
        required: true
    },
    servings: {
        type: Number,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        enum: ['Salty', 'Sweet'],
        required: true
    },
    totalLikes: {
        type: Number,
        default: 0
    },
    totalDislikes: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);