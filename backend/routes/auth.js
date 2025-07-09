const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registration
router.post('/register', async (req, res) => { // Fixed: added '/' before register
    const { username, email, password } = req.body;
    try {
        let user = await User.findOne({email});
        if (user) return res.status(400).json({message: 'User already exists'});
        
        user = new User({username, email, password});
        await user.save();
        
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.json({token, user: {id: user._id, username, email}}); // Fixed: res.json not res,json
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email});
        if (!user) return res.status(400).json({message: 'Invalid credentials'});
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({message: 'Invalid Credentials'}); // Fixed: added res.
        
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.json({token, user: {id: user._id, username: user.username, email}});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
});

module.exports = router;