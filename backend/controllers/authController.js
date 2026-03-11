const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const InMemoryDB = require('../lib/inMemoryDB');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

// Use in-memory DB if Mongoose is not connected
const getUserDB = () => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      console.log('? Using MongoDB for authentication');
      return User;
    }
  } catch (e) {}
  console.log('?? Using in-memory DB for authentication (development mode)');
  return InMemoryDB.users;
};

const findUserByEmailForLogin = async (email) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      // User.password is select:false in Mongo schema, so include it explicitly for login.
      return User.findOne({ email: email.toLowerCase() }).select('+password');
    }
  } catch (e) {}

  return InMemoryDB.users.findOne({ email: email.toLowerCase() });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('?? Register attempt:', { name, email });

    if (!name || !email || !password) {
      console.log('? Missing fields');
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    if (!isValidEmail(email)) {
      console.log('? Invalid email format:', email);
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    if (String(password).length < 6) {
      console.log('? Password too short');
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('? JWT_SECRET not configured');
      return res.status(500).json({ message: 'Server auth configuration is missing' });
    }

    const UserDB = getUserDB();
    const existingUser = await UserDB.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('? User already exists:', email);
      return res.status(400).json({ message: 'This email is already registered. Please sign in instead.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await UserDB.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    console.log('? User registered successfully:', user._id);

    const token = generateToken(user._id);
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('? Registration error:', error.message, error);
    if (error?.code === 11000) {
      return res.status(400).json({ message: 'This email is already registered. Please sign in instead.' });
    }
    return res.status(500).json({ message: 'Server error during registration. Please try again.' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('?? Login attempt:', { email });

    if (!email || !password) {
      console.log('? Missing email or password');
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('? JWT_SECRET not configured');
      return res.status(500).json({ message: 'Server auth configuration is missing' });
    }

    const user = await findUserByEmailForLogin(email);
    
    if (!user) {
      console.log('? User not found:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.password) {
      console.log('? Stored password hash missing for:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('? Password incorrect for:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('? Login successful:', user._id);
    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('? Login error:', error.message, error);
    return res.status(500).json({ message: 'Server error during login. Please try again.' });
  }
};

module.exports = { registerUser, loginUser };
