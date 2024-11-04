const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const validateToken = require('../middleware/validateTokenHandler');
const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/profile', validateToken, getUserProfile);

router.post('/logout', (req, res) => {
    // Logout user
    res.status(200).json({ message: 'User logged out successfully' });
})

module.exports = router;

// router.post('/register', (req, res) => {
//     // Register user
//     res.status(200).json({ message: 'User registered successfully' });
// })