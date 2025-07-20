// routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');

const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', protect, createOrder);

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private/Admin
router.get('/:id', protect, getOrderById);

// @route   GET /api/orders/user/my
// @desc    Get logged-in user's orders
// @access  Private
router.get('/user/my', protect, getUserOrders);

// @route   GET /api/admin/orders
// @desc    Get all orders (admin only)
// @access  Admin
router.get('/admin/orders', protect, isAdmin, getAllOrders);

// @route   PUT /api/admin/orders/:id
// @desc    Update order status (admin only)
// @access  Admin
router.put('/admin/orders/:id', protect, isAdmin, updateOrderStatus);

module.exports = router;
