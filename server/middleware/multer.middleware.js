// This file is: server/middleware/multer.middleware.js

import multer from 'multer';

// We'll store the file in memory as a buffer
const storage = multer.memoryStorage();

const multerUpload = multer({
  storage: storage,
  // Optional: Add file filter for security
  fileFilter: (req, file, cb) => {
    // Accept common image types and PDFs
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'application/pdf'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, and PDF are allowed.'), false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 10, // 10 MB file size limit
  },
});

export default multerUpload;