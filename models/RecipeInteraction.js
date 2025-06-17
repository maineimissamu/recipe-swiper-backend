const mongoose = require('mongoose');

const recipeInteractionSchema = new mongoose.Schema({
    recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    interaction: {
        type: String,
        enum: ['like', 'dislike'],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('RecipeInteraction', recipeInteractionSchema);