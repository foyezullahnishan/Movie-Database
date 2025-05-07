// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Modified route to handle both public registration and admin user creation
// The controller will handle the permissions
router.post('/register', async (req, res, next) => {
  // Check if trying to create an admin user - if so, apply the protect middleware
  if (req.body.role === 'admin') {
    return protect(req, res, next);
  }
  // Otherwise, proceed as public access for regular users
  next();
}, registerUser);

router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;