const express =require("express");
const mongoose= require('mongoose');
const cors = require('cors');
const dotenv =require("dotenv");

const path = require('path');
const app=express();

const connectDB = require('./config/db');

dotenv.config();
connectDB(); 


app.use(cors({
  origin: ["https://m-yfrontend.vercel.app"],
  credentials: true,
}));
app.use(express.json());

//User Routes

const userRoutes=require('./routes/userRoutes');
app.use('/api/users',userRoutes);

//Admin Routes

const adminRoutes=require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

//Product Routes

const productRoutes=require('./routes/productRoutes');
app.use('/api/products',productRoutes);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));




//Chat Routes

const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

// Add after other routes
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.get('/',(req,res) => {
    res.send("api is running............");
});

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() =>{
    console.log("Database Connected.....");
})
.catch(err =>{
    console.error("database error..",err.message);
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));


