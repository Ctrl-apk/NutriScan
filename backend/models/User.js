import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  
  // ========== NEW HEALTH PROFILE FIELDS ==========
  healthProfile: {
    allergies: {
      type: [String],
      default: [],
      // Example: ["peanuts", "gluten", "dairy"]
    },
    dietType: {
      type: String,
      enum: ['normal', 'vegan', 'vegetarian', 'keto', 'paleo', 'pescatarian'],
      default: 'normal',
    },
    healthGoals: {
      type: [String],
      default: [],
      // Example: ["weight-loss", "muscle-gain", "heart-health"]
    },
    age: {
      type: Number,
      min: 1,
      max: 120,
    },
    weight: {
      type: Number, // in kg
      min: 1,
    },
    height: {
      type: Number, // in cm
      min: 1,
    },
    activityLevel: {
      type: String,
      enum: ['sedentary', 'light', 'moderate', 'active', 'very-active'],
      default: 'moderate',
    },
  },
  // ===============================================
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);