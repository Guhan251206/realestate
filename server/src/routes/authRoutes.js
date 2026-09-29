const express = require('express');
const { register, login, profile, updateProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/register', upload.single('profilePicture'), register);
router.post('/login', login);
router.get('/profile', authMiddleware, profile);
router.patch('/profile', authMiddleware, upload.single('profilePicture'), updateProfile);

module.exports = router;
