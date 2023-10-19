require('dotenv').config();

const express = require('express')
const router = express.Router()
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

// REGISTRATION
router.post('/register', async (req, res) => {
  try {
    const {name, email, password, passwordConfirm} = req.body;

    // Check is the password confirm same with password
    if(passwordConfirm !== password) {
      return res.status(400).json({message: 'Password is not confirmed. Please double check!'})
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({email})
    if(existingUser) {
      return res.status(400).json({message: 'Email is already registered. Please login!'});
   }
    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const user = new User({
      name, 
      email, 
      password: hashedPassword,
    })
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
              expiresIn: '1d',
        });

    const simplifiedUser = {
      name: user.name,
      email: user.email,
      _id: user._id
    }

    res.status(201).json({message: 'Successfully Registered', token, user: simplifiedUser});
   } catch (error) {
      console.error(error)
      res.status(500).json({ message: error});
  }
})

 // LOGIN
router.post('/login', async (req, res) => {
  try {
    const{email, password} = req.body;
  
    // Check is the user exists
    const user = await User.findOne({email}); 
    if(!user) {
      return res.status(404).json({message: 'You are not registered. Please register first!'});
    }
  
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
      return res.status(401).json({message: "Password didn't match. Please double check!"});
    }

    // Check the user is not blocked
    if(user.status === 'blocked') {
      return res.status(403).json({message: 'Sorry! You are blocked, you cannot access'})
    }
  
    // Update last login time
     user.lastLogin = new Date();
     await user.save();
  
     const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY, {
         expiresIn: '1d'
     });
  
     const simplifiedUser = {
      name: user.name,
      email: user.email,
      _id: user._id
     }
  
     res.status(200).json({message: "Welcome back user", token, user: simplifiedUser})
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error});
  }
  
})

module.exports = router;