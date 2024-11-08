import multer from "multer";
import path from "path";
import fs from "fs";

// Define the upload directory
const uploadDir = "uploads/";

// Create the upload directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory
}

// Set up storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Set the destination folder for uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Rename the file to avoid conflicts
  },
});

// Initialize multer with field expectations
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|pdf/; // Allowed file types
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true); // Accept file
    }
    cb(new Error("Only images and PDFs are allowed!")); // Reject file
  },
}).fields([
  { name: "identityCard", maxCount: 1 },
  { name: "paymentProof", maxCount: 1 },
]);

export default upload;
