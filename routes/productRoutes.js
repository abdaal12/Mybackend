const express = require('express');
const router = express.Router();

// Controllers
const {
  createProduct,
  getAllProducts,
  getMyProducts,
  updateProduct,
  deleteProduct,
  getProductById,
  searchProducts,
} = require('../controllers/productController');



// Middleware
const { protect } = require('../middleware/authMiddleware');
const { isAdmin, isVendor } = require('../middleware/roleMiddleware');
const upload = require("../middleware/uploadMIddleware");

// PUBLIC ROUTES
router.get('/', getAllProducts);                  // Fetch all products
router.get('/search', searchProducts);
router.get('/:id', getProductById);              // Get product by ID


// PROTECTED ROUTES (Require JWT)
router.post("/", protect, isVendor, upload.single("image"), createProduct);   // Create new product
router.get('/my/products', protect, getMyProducts); // Fetch products created by logged-in user
router.put('/:id', protect, updateProduct);      // Update product by owner only
router.delete('/:id', protect, deleteProduct);   // Delete product by owner only

module.exports = router;
