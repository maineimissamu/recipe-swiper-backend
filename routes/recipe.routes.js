const express = require('express');
const Recipe = require('../models/Recipe');
const authMiddleware = require('../middleware/auth');
const RecipeInteraction = require('../models/RecipeInteraction');

const router = express.Router();


router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).populate('author', 'username');
        if(!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        const isAuthor = recipe.author._id.toString() === req.userId;

        const isLiked = await RecipeInteraction.findOne({
            recipe: req.params.id,
            user: req.userId,
            interaction: 'like'
        })

        if(!isAuthor && !isLiked) {
            return res.status(403).json({ message: 'You are not authorized to view this recipe' });
        }

        res.json(recipe);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
})

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, description, image, ingredients, steps, cookingTime, servings, difficulty, category } = req.body;
        const author = req.userId;

        if(!title || !description || !image || !ingredients || !steps || !cookingTime || !servings || !difficulty || !category) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newRecipe = new Recipe({ title, description, image, ingredients, steps, cookingTime, servings, difficulty, category, author });
        const savedRecipe = await newRecipe.save();
        res.status(201).json(savedRecipe);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/user/recipes', authMiddleware, async (req, res) => {
    try {
        const recipes = await Recipe.find({ author: req.userId })
            .populate('author', 'username')
            .sort({ createdAt: -1 });
        res.json(recipes);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if(!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        if(recipe.author.toString() !== req.userId) {
            return res.status(403).json({ message: 'You are not authorized to update this recipe' });
        }

        const { title, description, image, ingredients, steps, cookingTime, servings, difficulty, category } = req.body;

        if(!title || !description || !image || !ingredients || !steps || !cookingTime || !servings || !difficulty || !category) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, { title, description, image, ingredients, steps, cookingTime, servings, difficulty, category }, { new: true });
        res.json(updatedRecipe);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
})

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if(!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        if(recipe.author.toString() !== req.userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this recipe' });
        }

        await Recipe.findByIdAndDelete(req.params.id);

        await RecipeInteraction.deleteMany({ recipe: req.params.id });

        res.json({ message: 'Recipe deleted successfully' });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
})

module.exports = router;