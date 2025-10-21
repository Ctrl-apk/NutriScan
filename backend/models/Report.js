import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  reason: {
    type: String,
    required: [true, 'Reason for reporting is required'],
    trim: true,
    maxlength: [500, 'Reason cannot exceed 500 characters'],
  },
  category: {
    type: String,
    enum: ['allergen', 'harmful-ingredient', 'misleading-label', 'expired', 'other'],
    default: 'other',
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reportedByEmail: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'resolved', 'dismissed'],
    default: 'pending',
  },
  adminNotes: {
    type: String,
    default: '',
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index for faster queries
reportSchema.index({ reportedBy: 1, createdAt: -1 });
reportSchema.index({ status: 1 });

export default mongoose.model('Report', reportSchema);