const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); 

// @desc Register the user
// @rote POST /api/users/register
// @access public
const registerUser = asyncHandler(async (req, res) => {
    // Register user
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400);
        throw new Error('All fields are required');
    }
    // Check if user already exists
    const userAvailable = await User.findOne({email})
    if (userAvailable) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    
    // Create a new user
    const user = await User.create({ username, email, password: hashedPassword });
    console.log(`User created ${user}`);

    if(user) {
        res.status(201).json({ _id: user._id, email: user.email });
    } else {
        res.status(400)
        throw new Error('User data is not valid');
    }
    
    // Save user to the database
    res.status(200).json({ message: 'User registered successfully' });
} );

// @desc Login the user
// @rote POST /api/users/login
// @access public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // Login user
    if (!email || !password) {
        res.status(400);
        throw new Error('All fields are required');
    }

    const userAvailable = await User.findOne({email})
    // Compare password with hashed password
    if (userAvailable && (await bcrypt.compare(password, userAvailable.password))) {
        // Generate JWT token
        const accessToken = jwt.sign(
            { 
                user: {
                    username: userAvailable.username,
                    email: userAvailable.email,
                    id: userAvailable._id
                }
            },
            process.env.ACCESS_TOKEN_SECRET, 
            { expiresIn: '15m' }
        );
        res.status(200).json({ accessToken });
    } else {
        res.status(401);
        throw new Error('Invalid credentials');
    }
} );

// @desc Get user profile
// @rote GET /api/users/profile
// @access private
const getUserProfile = asyncHandler(async (req, res) => {
    // Get current user
    res.status(200).json(req.user);
} );

module.exports = { registerUser, loginUser, getUserProfile };