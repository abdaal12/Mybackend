const User = require('../models/User');

const Product = require('../models/Product');

// @desc    Get all users
const getAllUsers = async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
};

// @desc    Get user by ID
const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Delete user
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete another admin' });
    }
     await user.deleteOne();

    res.json({ message: 'User removed successfully' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.role = req.body.role || user.role; // role: 'admin' | 'vendor' | 'user'
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify or reject vendor/admin user
// @route   PATCH /api/admin/users/:id/verify
// @access  SuperAdmin


const verifyUser = async (req, res) => {
  try {
    const { status } = req.body; // expected: "approved", "rejected"
    const validStatus = ["approved", "rejected"];

    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: 'Invalid verification status' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.verificationStatus = status;
    const updated = await user.save();

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllProductsForAdmin = async (req, res) => {
  try {
    const products = await Product.find().populate('seller', 'email name');
    const formatted = products.map(p => ({
      _id: p._id,
      name: p.name,
      category: p.category,
      price: p.price,
      sellerEmail: p.seller?.email || 'N/A',
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





module.exports = {
  getAllUsers,
  getUserById,
  deleteUser,
  updateUserRole,
  verifyUser,
  getAllProductsForAdmin,
};
