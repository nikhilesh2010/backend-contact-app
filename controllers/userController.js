const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); 

// @desc Register the user
// @route POST /api/users/register
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

    if (user) {
        return res.status(201).json({ _id: user._id, email: user.email });
    } else {
        res.status(400)
        throw new Error('User data is not valid');
    }
} );

// @desc Login the user
// @route POST /api/users/login
// @access public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // Login user
    if (!email || !password) {
        res.status(400);
        throw new Error('All fields are required');
    }

    const user = await User.findOne({ email });

    // If the user is not found, return invalid credentials
    if (!user) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    // Compare the provided password with the stored password
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If the password is invalid, return invalid credentials
    if (!passwordMatch) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    // Ensure access token secret is defined
    if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error('Token secret is missing');
    }

    // Generate JWT token
    const accessToken = jwt.sign(
        { user: { username: user.username, email: user.email, id: user._id } },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' }
    );

    // Return the access token
    return res.status(200).json({ accessToken });
} );

// @desc Get user profile
// @route GET /api/users/profile
// @access private
const getUserProfile = asyncHandler(async (req, res) => {
    // Get current user
    res.status(200).json(req.user);
} );

module.exports = { registerUser, loginUser, getUserProfile };