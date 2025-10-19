// This file is: server/models/Vitals.model.js

import mongoose from 'mongoose';

const VitalsSchema = new mongoose.Schema(
  {
    // This links the vitals entry to a specific User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bloodPressure: {
      type: String, // Storing as string (e.g., "120/80")
      trim: true,
    },
    bloodSugar: {
      type: Number, // Storing as number (e.g., 95)
    },
    weight: {
      type: Number, // Storing as number (e.g., 70)
    },
    notes: {
      type: String, // For any extra notes
      trim: true,
    },
  },
  {
    // Adds createdAt and updatedAt timestamps
    timestamps: true, 
  }
);

const Vitals = mongoose.model('Vitals', VitalsSchema);

export default Vitals;