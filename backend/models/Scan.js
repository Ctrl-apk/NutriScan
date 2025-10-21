import mongoose from 'mongoose';

const scanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  productName: {
    type: String,
    default: 'Unknown Product',
    trim: true
  },
  imagePath: {
    type: String,
    default: null
  },
  extractedText: {
    type: String,
    required: true
  },
  results: {
    total: { type: Number, default: 0 },
    safe: { type: Number, default: 0 },
    moderate: { type: Number, default: 0 },
    harmful: { type: Number, default: 0 },
    details: [{
      name: { type: String, required: true },
      risk: {
        type: String,
        enum: ['Safe', 'Moderate', 'Harmful'],
        required: true
      }
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

scanSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Scan', scanSchema);