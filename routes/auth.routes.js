const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async(req, res) => {
    try{
        const {username, email, password} = req.body;

        if(!username || !email || !password) {
            return res.json({message: 'All fields are required'});
        }

        const existingUser = await User.findOne({$or: [{email}, {username}]});

        if(existingUser) {
            return res.json({message: 'User already exists'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({username, email, password: hashedPassword});

        const savedUser = await newUser.save();

        const token = jwt.sign({id: savedUser._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.json({message: 'User registered successfully', user: savedUser, token});

    } catch(err) {
        res.json({message: err.message})
    }
});

router.post('/login', async(req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.json({message: 'All fields are required'});
        }

        const user = await User.findOne({email});
        if(!user) {
            return res.json({message: 'User not found'});
        }

        const passwordToVerify = await bcrypt.compare(password, user.password);

        if(!passwordToVerify) {
            return res.json({message: 'Invalid password'});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.json({message: 'Login successful', user, token});
    } catch(err) {
        res.json({message: err.message})
    }
});

module.exports = router;