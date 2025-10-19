// This file is: server/models/AiInsight.model.js

import mongoose from 'mongoose';

const AiInsightSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Links this insight to the specific file
    file: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File',
      required: true,
    },
    summary: { type: String }, // [cite: 11]
    romanUrduSummary: { type: String }, // [cite: 11]
    abnormalValues: [String], // [cite: 28]
    doctorQuestions: [String], // [cite: 30]
    foodSuggestions: { type: String }, // [cite: 31]
    remedySuggestions: { type: String }, // [cite: 32]
  },
  { timestamps: true }
);

const AiInsight = mongoose.model('AiInsight', AiInsightSchema);
export default AiInsight;