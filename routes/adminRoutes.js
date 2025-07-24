const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  deleteUser,
  updateUserRole,
  verifyUser,
  getAllProductsForAdmin,

} = require('../controllers/adminController');


const { protect} = require('../middleware/authMiddleware');
const { isSuperAdmin } = require('../middleware/roleMiddleware');

router.get('/users', protect,isSuperAdmin, getAllUsers);
router.get('/users/:id', protect, isSuperAdmin, getUserById);
router.delete('/users/:id', protect, isSuperAdmin, deleteUser);
router.put('/users/:id', protect, isSuperAdmin, updateUserRole);
router.patch('/users/:id',verifyUser) 


router.get('/products',  getAllProductsForAdmin);



module.exports = router;
