const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find().populate('author', 'username');
        res.json(recipes);
    } catch(err) {
        res.json({ message: err.message });
    }
});

module.exports = router;