const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const profilePicture = req.file
      ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
      : '';

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      profilePicture,
    });

    const token = generateToken(user._id.toString());

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id.toString());

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during login' });
  }
};

const profile = async (req, res) => {
  return res.status(200).json({ user: req.user });
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name } = req.body;
    if (name && name.trim().length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters' });
    }

    if (name) user.name = name.trim();
    if (req.file) {
      user.profilePicture = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    await user.save();

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during profile update' });
  }
};

module.exports = { register, login, profile, updateProfile };
