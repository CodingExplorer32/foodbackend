// middleware/multer.js
import multer from 'multer';
import path from 'path';

// ✅ Only allow image file extensions


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/temp/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

export const upload = multer({
  storage
});
