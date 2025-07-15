const express = require('express');
const Comment = require('../models/Comment');
const Recipe = require('../models/Recipe');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/recipe/:recipeId', authMiddleware, async (req, res) => {
    try {
        const { recipeId } = req.params;
        
        const recipe = await Recipe.findById(recipeId);
        if(!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        const comments = await Comment.find({ recipe: recipeId })
            .populate('author', 'username')
            .sort({ createdAt: -1 });
        
        res.json(comments);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { recipeId, content } = req.body;
        const author = req.userId;

        if(!recipeId || !content) {
            return res.status(400).json({ message: 'Recipe ID and content are required' });
        }

        const recipe = await Recipe.findById(recipeId);
        if(!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        
        const comment = new Comment({ recipe: recipeId, author, content });
        await comment.save();
        const populatedComment = await comment.populate('author', 'username');
        
        res.status(201).json(populatedComment);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:commentId', authMiddleware, async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.userId;

        const comment = await Comment.findById(commentId);
        if(!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if(comment.author.toString() !== userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this comment' });
        }

        await Comment.findByIdAndDelete(commentId);
        res.json({ message: 'Comment deleted successfully' });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;