const Product = require("../models/Product");

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private
 */
 cloudinary=require("../config/cloudinary.js");


const createProduct = async (req, res) => {
  try {
    const { name, brand, category, description, price, countInStock } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    // Upload image to Cloudinary
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "Mystore" },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        stream.end(buffer);
      });
    };

    const result = await streamUpload(req.file.buffer);

    const product = new Product({
      name,
      brand,
      category,
      description,
      price,
      countInStock,
      image: result.secure_url,
      user: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Error in createProduct:", error);
    res.status(500).json({ error: "Server error" });
  }
};



const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("user", "name email");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc    Get products created by current user
 * @route   GET /api/products/my/products
 * @access  Private
 */
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc    Get a single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "user", // assuming `user` is the seller field
      "name email phone"
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/**
 * @desc    Update a product (only by owner)
 * @route   PUT /api/products/:id
 * @access  Private
 */
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // Check if the logged-in user is the owner
    if (product.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to update this product" });
    }

    const fields = [
      "name",
      "brand",
      "category",
      "description",
      "image",
      "price",
      "countInStock",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc    Delete a product (only by owner)
 * @route   DELETE /api/products/:id
 * @access  Private
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    // Only allow deletion if vendor owns it or user is admin
    if (
      product.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

  await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// @desc    Search products by name
// @route   GET /api/products/search?keyword=phone
// @access  Public
const searchProducts = (async (req, res) => {
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i', // case-insensitive
        },
      }
    : {};

  const products = await Product.find({ ...keyword });

  res.json(products);
});

//Like Product

const likeProduct = async (req, res) => {
  const userId = req.user.id; // assuming user is authenticated and ID is available
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);

    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check if user already liked
    if (product.likedBy.includes(userId)) {
      return res.status(400).json({ message: "You already liked this product." });
    }

    product.likes += 1;
    product.likedBy.push(userId);
    await product.save();

    res.status(200).json({ message: "Liked", likes: product.likes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getMyProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
   likeProduct,
};
