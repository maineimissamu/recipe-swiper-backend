const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async(req, res) => {
    try{
        const {username, email, password} = req.body;

        if(!username || !email || !password) {
            return res.status(400).json({message: 'All fields are required'});
        }

        const existingUser = await User.findOne({$or: [{email}, {username}]});

        if(existingUser) {
            return res.status(409).json({message: 'User already exists'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({username, email, password: hashedPassword});

        const savedUser = await newUser.save();

        const token = jwt.sign({id: savedUser._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.status(201).json({message: 'User registered successfully', user: savedUser, token});

    } catch(err) {
        res.status(500).json({message: err.message})
    }
});

router.post('/login', async(req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({message: 'All fields are required'});
        }

        const user = await User.findOne({email});
        if(!user) {
            return res.status(401).json({message: 'Invalid credentials'});
        }

        const passwordToVerify = await bcrypt.compare(password, user.password);

        if(!passwordToVerify) {
            return res.status(401).json({message: 'Invalid credentials'});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.json({message: 'Login successful', user, token});
    } catch(err) {
        res.status(500).json({message: err.message})
    }
});

module.exports = router;