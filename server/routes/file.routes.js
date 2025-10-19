// This file is: server/routes/file.routes.js

import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import multerUpload from '../middleware/multer.middleware.js';
import cloudinary from '../config/cloudinary.config.js';
import File from '../models/File.model.js';
import streamifier from 'streamifier';

const router = express.Router();

// @route   POST /api/files/upload
// @desc    Upload a new report file
// @access  Private
router.post(
  '/upload',
  authMiddleware, // 1. Check if user is logged in
  multerUpload.single('reportFile'), // 2. Use Multer to grab the file (key is 'reportFile')
  async (req, res) => {

    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded.' });
    }

    try {
      // 3. Upload the file (from memory buffer) to Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `healthmate/${req.user.id}`, // Store in a user-specific folder
          resource_type: 'image', // Detect if it's PDF, image, etc.
          access_mode: 'public',
        },
        async (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return res.status(500).json({ msg: 'Error uploading to cloud storage.' });
          }

          // 4. File is uploaded! Now, save its info to our MongoDB
          const newFile = new File({
            user: req.user.id,
            cloudinaryUrl: result.secure_url,
            cloudinaryPublicId: result.public_id,
            originalFilename: req.file.originalname,
            fileType: req.file.mimetype,
          });

          await newFile.save();

          // 5. Send the saved file info back to the frontend
          // We'll trigger the Gemini analysis in a separate step
          res.status(201).json({
            msg: 'File uploaded successfully. Analysis will begin shortly.',
            file: newFile,
          });
        }
      );

      // Pipe the file buffer from multer into the Cloudinary upload stream
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

export default router;