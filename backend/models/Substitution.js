import mongoose from 'mongoose';

const substitutionSchema = new mongoose.Schema({
  ingredient: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  substitutes: [{
    name: String,
    healthScore: Number, // 1-10
    reason: String,
    dietCompatible: [String], // ['vegan', 'keto', etc.]
  }],
  category: {
    type: String,
    enum: ['sweetener', 'fat', 'protein', 'carb', 'preservative', 'flavor', 'other'],
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

substitutionSchema.index({ ingredient: 1 });
substitutionSchema.index({ 'substitutes.dietCompatible': 1 });

export default mongoose.model('Substitution', substitutionSchema);