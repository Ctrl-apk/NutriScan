import User from '../models/User.js';

/**
 * @desc    Get user health profile
 * @route   GET /api/profile/:email
 * @access  Private
 */
export const getProfile = async (req, res) => {
  try {
    const { email } = req.params;

    // Verify user is accessing their own profile
    if (req.user.email !== email) {
      return res.status(403).json({ 
        message: 'Not authorized to view this profile' 
      });
    }

    const user = await User.findOne({ email }).select('name email healthProfile');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      name: user.name,
      email: user.email,
      healthProfile: user.healthProfile || {},
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

/**
 * @desc    Update or create user health profile
 * @route   PUT /api/profile/:email
 * @access  Private
 */
export const updateProfile = async (req, res) => {
  try {
    const { email } = req.params;
    const { allergies, dietType, healthGoals, age, weight, height, activityLevel } = req.body;

    // Verify user is updating their own profile
    if (req.user.email !== email) {
      return res.status(403).json({ 
        message: 'Not authorized to update this profile' 
      });
    }

    // Build health profile object
    const healthProfileData = {};
    if (allergies !== undefined) healthProfileData.allergies = allergies;
    if (dietType) healthProfileData.dietType = dietType;
    if (healthGoals !== undefined) healthProfileData.healthGoals = healthGoals;
    if (age) healthProfileData.age = age;
    if (weight) healthProfileData.weight = weight;
    if (height) healthProfileData.height = height;
    if (activityLevel) healthProfileData.activityLevel = activityLevel;

    // Update user
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { healthProfile: healthProfileData } },
      { new: true, runValidators: true }
    ).select('name email healthProfile');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      healthProfile: user.healthProfile,
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

/**
 * @desc    Calculate BMI from profile data
 * @route   GET /api/profile/:email/bmi
 * @access  Private
 */
export const calculateBMI = async (req, res) => {
  try {
    const { email } = req.params;

    if (req.user.email !== email) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const user = await User.findOne({ email }).select('healthProfile');

    if (!user || !user.healthProfile.weight || !user.healthProfile.height) {
      return res.status(400).json({ 
        message: 'Weight and height are required to calculate BMI' 
      });
    }

    const heightInMeters = user.healthProfile.height / 100;
    const bmi = user.healthProfile.weight / (heightInMeters * heightInMeters);
    
    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';

    res.json({
      bmi: bmi.toFixed(1),
      category,
      weight: user.healthProfile.weight,
      height: user.healthProfile.height,
    });
  } catch (error) {
    console.error('BMI Calculation Error:', error);
    res.status(500).json({ message: 'Server error calculating BMI' });
  }
};