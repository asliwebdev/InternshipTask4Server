const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a name']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Please enter a email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password']
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    registrationTime: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'blocked'],
        default: 'active'
    }
  },
  {
    timestamps: true
  }    
)

const User = mongoose.model('User', userSchema)
module.exports = User;

