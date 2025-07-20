// controllers/orderController.js

const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order with stock and price checks
// @route   POST /api/orders
// @access  Private
const createOrder = (async (req, res) => {
  const { orderItems, shippingAddress } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  let totalAmount = 0;
  const processedItems = [];

  for (const item of orderItems) {
    const product = await Product.findById(item.product);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    if (typeof product.countInStock !== 'number') {
      res.status(400);
      throw new Error(`Invalid stock value for ${product.name}`);
    }

    if (product.countInStock < item.quantity) {
      res.status(400);
      throw new Error(`Not enough stock for ${product.name}`);
    }

    const itemTotal = product.price * item.quantity;
    totalAmount += itemTotal;

    // 👇 Include price inside each order item
    processedItems.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price
    });

    // Update stock
    product.countInStock -= item.quantity;
    await product.save();
  }

  const order = new Order({
    user: req.user._id,
    orderItems: processedItems,
    shippingAddress,
    totalAmount // ✅ this must match schema field name
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});


// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private/Admin
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Allow access to admin or user who placed order
    if (req.user.role !== 'admin' && req.user._id.toString() !== order.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/user/my
// @access  Private
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (admin only)
// @route   GET /api/admin/orders
// @access  Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (admin only)
// @route   PUT /api/admin/orders/:id
// @access  Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
};
