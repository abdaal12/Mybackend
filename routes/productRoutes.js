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
  likeProduct,
} = require('../controllers/productController');


// Middleware
const { protect } = require('../middleware/authMiddleware');
const { isVendor } = require('../middleware/roleMiddleware');
const upload = require('../middleware/upload');

// PUBLIC ROUTES
router.get('/', getAllProducts);                  // Fetch all products
router.get('/search', searchProducts);
router.get('/:id', getProductById);              // Get product by ID
router.put("/like/:id", protect, likeProduct);

// PROTECTED ROUTES (Require JWT)
router.post( "/",  protect,upload.single("image"), createProduct );
router.get('/my/products', protect, getMyProducts); // Fetch products created by logged-in user
router.put('/:id', protect, updateProduct);      // Update product by owner only
router.delete('/:id', protect, deleteProduct);   // Delete product by owner only

module.exports = router;
