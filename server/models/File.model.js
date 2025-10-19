// This file is: server/models/File.model.js

import mongoose from 'mongoose';

const FileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // The secure URL we get back from Cloudinary
    cloudinaryUrl: {
      type: String,
      required: true,
    },
    // The public ID from Cloudinary (for deleting/managing)
    cloudinaryPublicId: {
      type: String,
      required: true,
    },
    originalFilename: {
      type: String,
      required: true,
    },
    fileType: {
      type: String, // e.g., 'application/pdf', 'image/jpeg'
      required: true,
    },
  },
  { timestamps: true }
);

const File = mongoose.model('File', FileSchema);
export default File;