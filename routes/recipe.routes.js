const express = require('express');
const Recipe = require('../models/Recipe');
const authMiddleware = require('../middleware/auth');
const RecipeInteraction = require('../models/RecipeInteraction');

const router = express.Router();


router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).populate('author', 'username');
        if(!recipe) {
            return res.json({ message: 'Recipe not found' });
        }

        const isAuthor = recipe.author._id.toString() === req.userId;

        const isLiked = await RecipeInteraction.findOne({
            recipe: req.params.id,
            user: req.userId,
            interaction: 'like'
        })

        if(!isAuthor && !isLiked) {
            return res.json({ message: 'You are not authorized to view this recipe' });
        }

        res.json(recipe);
    } catch(err) {
        res.json({ message: err.message });
    }
})

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, description, image, ingredients, steps, cookingTime, servings, difficulty, category } = req.body;
        const author = req.userId;

        if(!title || !description || !image || !ingredients || !steps || !cookingTime || !servings || !difficulty || !category) {
            return res.json({ message: 'All fields are required' });
        }

        const newRecipe = new Recipe({ title, description, image, ingredients, steps, cookingTime, servings, difficulty, category, author });
        const savedRecipe = await newRecipe.save();
        res.json(savedRecipe);
    } catch(err) {
        res.json({ message: err.message });
    }
});

router.get('/user/recipes', authMiddleware, async (req, res) => {
    try {
        const recipes = await Recipe.find({ author: req.userId })
            .populate('author', 'username')
            .sort({ createdAt: -1 });
        res.json(recipes);
    } catch(err) {
        res.json({ message: err.message });
    }
});

module.exports = router;