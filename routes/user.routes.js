const express = require('express');
const User = require('../models/User');

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if(!user) {
            return res.json({ message: 'User not found' });
        }
        res.json(user);
    } catch(err) {
        res.json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { username, email, password } = req.body;


        if(!username || !email || !password) {
            return res.json({ message: 'All fields are required' });
        }

        const newUser = new User({ username, email, password });
        const savedUser = await newUser.save();
        const { password: _, ...userWithoutPassword } = savedUser.toObject();
        res.json(userWithoutPassword);

    } catch(err) {
        res.json({ message: err.message });
    }
});

module.exports = router;