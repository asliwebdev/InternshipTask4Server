const express = require('express')
const User = require('../models/userModel')
const authMiddleware = require('../middlewares/auth')
const router = express.Router()

// GET ALL THE USERS
router.get('/', authMiddleware, async (req, res) => {
    try {
        const users = await User.find({}, {password: 0});
        res.status(200).json({users});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error})
    }
})

// Refactor server code also to handle actions in one function instead of separate three ones
// by making single endpoint and depending on the actionType
router.patch('/action', authMiddleware, async (req, res) => {
    try {
      const { selectedUsers, actionType } = req.body;
      let message = '';
  
      switch (actionType) {
        case 'block':
          message = 'Users blocked successfully';
          await User.updateMany({ _id: { $in: selectedUsers } }, { $set: { status: 'blocked' } });
          break;
        case 'unblock':
          message = 'Users unblocked successfully';
          await User.updateMany({ _id: { $in: selectedUsers } }, { $set: { status: 'active' } });
          break;
        case 'delete':
          message = 'Users deleted successfully';
          await User.deleteMany({ _id: { $in: selectedUsers } });
          break;
        default:
          return res.status(400).json({ message: 'Invalid action type' });
      }
  
      res.status(200).json({ message });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error });
    }
  });

module.exports = router;
