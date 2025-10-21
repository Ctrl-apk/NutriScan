import { useState, useEffect, useContext } from 'react';
import { User, Heart, Activity, Target } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const ProfileForm = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    allergies: [],
    dietType: 'normal',
    healthGoals: [],
    age: '',
    weight: '',
    height: '',
    activityLevel: 'moderate',
  });
  const exportToPDF = () => {
  const content = `
    Health Profile
    ===============
    Diet: ${formData.dietType}
    Allergies: ${formData.allergies.join(', ')}
    Goals: ${formData.healthGoals.join(', ')}
    BMI: ${formData.weight && formData.height ? 
      (formData.weight / Math.pow(formData.height/100, 2)).toFixed(1) : 'N/A'}
  `;
  
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'health-profile.txt';
  a.click();
};

// Add button:
<button onClick={exportToPDF} className="...">
  Export Profile
</button>

  const [allergyInput, setAllergyInput] = useState('');
  const [goalInput, setGoalInput] = useState('');

  // Fetch existing profile
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get(`/profile/${user.email}`);
      if (data.healthProfile) {
        setFormData({
          allergies: data.healthProfile.allergies || [],
          dietType: data.healthProfile.dietType || 'normal',
          healthGoals: data.healthProfile.healthGoals || [],
          age: data.healthProfile.age || '',
          weight: data.healthProfile.weight || '',
          height: data.healthProfile.height || '',
          activityLevel: data.healthProfile.activityLevel || 'moderate',
        });
      }
    } catch (err) {
      console.error('Fetch profile error:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addAllergy = () => {
    if (allergyInput.trim() && !formData.allergies.includes(allergyInput.trim())) {
      setFormData({
        ...formData,
        allergies: [...formData.allergies, allergyInput.trim()],
      });
      setAllergyInput('');
    }
  };

  const removeAllergy = (allergy) => {
    setFormData({
      ...formData,
      allergies: formData.allergies.filter(a => a !== allergy),
    });
  };

  const addGoal = () => {
    if (goalInput.trim() && !formData.healthGoals.includes(goalInput.trim())) {
      setFormData({
        ...formData,
        healthGoals: [...formData.healthGoals, goalInput.trim()],
      });
      setGoalInput('');
    }
  };

  const removeGoal = (goal) => {
    setFormData({
      ...formData,
      healthGoals: formData.healthGoals.filter(g => g !== goal),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.put(`/profile/${user.email}`, formData);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <User className="w-8 h-8 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-800">Health Profile</h2>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Allergies */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Heart className="w-4 h-4 inline mr-2" />
            Allergies
          </label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={allergyInput}
              onChange={(e) => setAllergyInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., peanuts, gluten"
            />
            <button
              type="button"
              onClick={addAllergy}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.allergies.map((allergy, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm flex items-center space-x-1"
              >
                <span>{allergy}</span>
                <button
                  onClick={() => removeAllergy(allergy)}
                  className="hover:text-red-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Diet Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Diet Type</label>
          <select
            name="dietType"
            value={formData.dietType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="normal">Normal</option>
            <option value="vegan">Vegan</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="keto">Keto</option>
            <option value="paleo">Paleo</option>
            <option value="pescatarian">Pescatarian</option>
          </select>
        </div>

        {/* Health Goals */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Target className="w-4 h-4 inline mr-2" />
            Health Goals
          </label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., weight loss, muscle gain"
            />
            <button
              type="button"
              onClick={addGoal}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.healthGoals.map((goal, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center space-x-1"
              >
                <span>{goal}</span>
                <button
                  onClick={() => removeGoal(goal)}
                  className="hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Biometrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="25"
              min="1"
              max="120"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="70"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="170"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Activity className="w-4 h-4 inline mr-2" />
              Activity
            </label>
            <select
              name="activityLevel"
              value={formData.activityLevel}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
              <option value="very-active">Very Active</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
};

export default ProfileForm;