const User= require('../models/User');
const generateToken = require('../utils/generateToken');

//create new user

const createUser=async(req,res)=>{
    
        const{
            name,email,password}=req.body;
            const userExists=await User.findOne({email});
            if(userExists){
                res.status(400);
                throw new Error("user already exists");
            }
        const user = await User.create({name,email,password});

        if(user){
            res.status(201).json
            ({_id: user._id,name: user.name, email: user.email, token:
                 generateToken(user._id),
                });
        }
        else{
            res.status(400);
            throw new Error("Invalid user data");
        }
    };

    //Get all users

    const getAllUsers = async(req,res)=>{
        try{
            const users=await User.find();
            res.json(users);
        }
        catch(err){
            res.status(500).json({message:err.message});

        }
    };


// 👤 Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && await user.matchPassword(password)) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
     
      res.status(401).json({ message: "invalid credentials" });
      
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



//User Profile

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.contact = req.body.contact || user.contact;
      user.address = req.body.address || user.address;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        contact: updatedUser.contact,
        address: updatedUser.address,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getLikedProducts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('likedProducts');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user.likedProducts);
  } catch (error) {
    console.error('Error fetching liked products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  createUser,
  getAllUsers,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getLikedProducts,
};



      