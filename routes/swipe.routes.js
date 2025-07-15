const express = require('express');
const Recipe = require('../models/Recipe');
const RecipeInteraction = require('../models/RecipeInteraction')
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

router.get('/', async(req, res) => {
    try {
        
        const recipeCount = await Recipe.countDocuments();
        const random = Math.floor(Math.random() * recipeCount);

        const randomRecipe = await Recipe.findOne().skip(random);

        if(!randomRecipe) {
            return res.status(404).json({message: 'No recipes available'});
        }

        res.json({recipe: randomRecipe});
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

router.post('/like', authMiddleware, async(req, res) => {
    try {
        const { recipeId } = req.body;
        const userId = req.userId;

        if(!userId || !recipeId) {
            return res.status(400).json({message: 'User ID and recipe ID are required'});
        }

        const alreadyInteracted = await RecipeInteraction.findOne({recipe: recipeId, user: userId});
        if(alreadyInteracted) {
            return res.status(409).json({message: 'You have already interacted with this recipe'});
        }

        const interaction = new RecipeInteraction({recipe: recipeId, user: userId, interaction: 'like'});
        await interaction.save();

        await Recipe.findByIdAndUpdate(recipeId, {$inc: {totalLikes: 1}});
        await User.findByIdAndUpdate(userId, {$push: {likedRecipes: recipeId}});

        res.json({message: 'Recipe liked successfully'});
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

router.post('/dislike', authMiddleware, async(req, res) => {
    try {

        const { recipeId } = req.body;
        const userId = req.userId;

        if(!userId || !recipeId) {
            return res.status(400).json({message: 'User ID and recipe ID are required'});
        }
        
        const alreadyInteracted = await RecipeInteraction.findOne({recipe: recipeId, user: userId});
        
        if(alreadyInteracted) {
            return res.status(409).json({message: 'You have already interacted with this recipe'});
        }

        const interaction = new RecipeInteraction({recipe: recipeId, user: userId, interaction: 'dislike'});
        await interaction.save();

        await Recipe.findByIdAndUpdate(recipeId, {$inc: {totalDislikes: 1}});
        await User.findByIdAndUpdate(userId, {$push: {dislikedRecipes: recipeId}});

        res.json({message: 'Recipe disliked successfully'});
    } catch(err) {
        res.status(500).json({message: err.message})
    }
});

router.get('/liked', authMiddleware, async(req, res) => {
    try {
        const userId = req.userId;
        
        const likedInteractions = await RecipeInteraction.find({
            user: userId,
            interaction: 'like'
        }).populate('recipe');

        const likedRecipes = likedInteractions.map(interaction => interaction.recipe);

        res.json({likedRecipes});
    } catch(err) {
        res.status(500).json({message: err.message})
    }
});

module.exports = router;