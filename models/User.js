const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: { type: String, required: true },

    // 🆕 Role-based access field
    role: {
      type: String,
      enum: ['user', 'vendor', 'admin','superadmin'],
      default: 'user',
    },
    verificationStatus: {
  type: String,
  enum: ['pending', 'approved', 'rejected'],
  default: 'pending',
},
contact: { type: String },

address: { type: String },
 likedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
 
  },
  {
    timestamps: true,
  }
);

// 🔐 Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
