const express = require('express');
const Comment = require('../models/Comment');
const Recipe = require('../models/Recipe');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/recipe/:recipeId', async (req, res) => {
    try {
        const { recipeId } = req.params;
        
        const comments = await Comment.find({ recipe: recipeId })
            .populate('author', 'username')
            .sort({ createdAt: -1 });
        
        res.json(comments);
    } catch (err) {
        res.json({ message: err.message });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { recipeId, content } = req.body;
        const author = req.userId;

        const recipe = await Recipe.findById(recipeId);
        if(!recipe) {
            return res.json({ message: 'Recipe not found' });
        }
        
        const comment = new Comment({ recipe: recipeId, author, content });
        await comment.save();
        const populatedComment = await comment.populate('author', 'username');
        
        res.json(populatedComment);
    } catch(err) {
        res.json({ message: err.message });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if(!comment) {
            return res.json({ message: 'Comment not found' });
        }

        if(comment.author.toString() !== req.userId) {
            return res.json({ message: 'You are not authorized to delete this comment' });
        }

        await Comment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Comment deleted successfully' });
    } catch(err) {
        res.json({ message: err.message });
    }
});

module.exports = router;