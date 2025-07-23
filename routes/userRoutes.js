const express= require('express');
const router= express.Router();

const {createUser,getAllUsers,loginUser,getUserProfile,updateUserProfile}=require('../controllers/userController');

//Middleware

const { protect } = require('../middleware/authMiddleware');

router.post('/',createUser);
router.get('/',getAllUsers);
router.post('/login', loginUser); 
router.get('/profile', protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);


module.exports=router;