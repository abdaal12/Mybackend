// middleware/upload.js
const multer=require("multer");
const storage = multer.memoryStorage(); // store in memory for upload to Cloudinary
const upload = multer({ storage });
module.exports=  upload;
