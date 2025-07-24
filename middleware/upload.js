// middleware/upload.js
import multer from "multer";
const storage = multer.memoryStorage(); // store in memory for upload to Cloudinary
const upload = multer({ storage });
export default upload;
