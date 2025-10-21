import mongoose from 'mongoose';

const moodRecommendationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mood: {
    type: String,
    enum: ['happy', 'sad', 'stressed', 'energetic', 'tired', 'anxious', 'calm'],
    required: true,
  },
  recommendations: [{
    foodName: String,
    nutrients: {
      carbs: Number,
      protein: Number,
      fat: Number,
      calories: Number,
    },
    reason: String,
    emoji: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

moodRecommendationSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('MoodRecommendation', moodRecommendationSchema);