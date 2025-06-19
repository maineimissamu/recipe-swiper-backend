const express = require('express');
const Recipe = require('../models/Recipe');

const router = express.Router();


router.get('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).populate('author', 'username');
        if(!recipe) {
            return res.json({ message: 'Recipe not found' });
        }
        res.json(recipe);
    } catch(err) {
        res.json({ message: err.message });
    }
})

router.post('/', async (req, res) => {
    try {
        const { title, description, image, ingredients, steps, cookingTime, servings, difficulty, category, author } = req.body;

        if(!title || !description || !image || !ingredients || !steps || !cookingTime || !servings || !difficulty || !category) {
            return res.json({ message: 'All fields are required' });
        }

        const newRecipe = new Recipe({ title, description, image, ingredients, steps, cookingTime, servings, difficulty, category, author });
        const savedRecipe = await newRecipe.save();
        res.json(savedRecipe);
    } catch(err) {
        res.json({ message: err.message });
    }
})
module.exports = router;