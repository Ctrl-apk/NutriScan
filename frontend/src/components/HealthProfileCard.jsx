import { Heart, Activity, Target, TrendingUp } from 'lucide-react';

const HealthProfileCard = ({ profile }) => {
  if (!profile) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <p className="text-gray-600 text-center">No health profile set</p>
      </div>
    );
  }

  const calculateBMI = () => {
    if (profile.weight && profile.height) {
      const heightInMeters = profile.height / 100;
      return (profile.weight / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return null;
  };

  const bmi = calculateBMI();
  const getBMICategory = (bmi) => {
    if (!bmi) return '';
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  const getBMIColor = (bmi) => {
    if (!bmi) return 'gray';
    if (bmi < 18.5) return 'blue';
    if (bmi < 25) return 'green';
    if (bmi < 30) return 'yellow';
    return 'red';
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl p-6 border-2 border-green-200">
      <div className="flex items-center space-x-3 mb-6">
        <Heart className="w-8 h-8 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-800">Health Summary</h2>
      </div>

      <div className="space-y-4">
        {/* Diet Type */}
        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Diet Type</span>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold capitalize">
            {profile.dietType || 'Not set'}
          </span>
        </div>

        {/* Activity Level */}
        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Activity Level</span>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold capitalize">
            {profile.activityLevel?.replace('-', ' ') || 'Not set'}
          </span>
        </div>

        {/* BMI Card */}
        {bmi && (
          <div className={`p-4 bg-${getBMIColor(bmi)}-50 border-2 border-${getBMIColor(bmi)}-200 rounded-lg`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">BMI</span>
              <span className={`text-2xl font-bold text-${getBMIColor(bmi)}-600`}>{bmi}</span>
            </div>
            <div className="text-xs text-gray-600">
              {getBMICategory(bmi)} • {profile.weight}kg / {profile.height}cm
            </div>
          </div>
        )}

        {/* Allergies */}
        {profile.allergies && profile.allergies.length > 0 && (
          <div className="p-3 bg-white rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Heart className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-gray-700">Allergies</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.allergies.map((allergy, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium"
                >
                  {allergy}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Health Goals */}
        {profile.healthGoals && profile.healthGoals.length > 0 && (
          <div className="p-3 bg-white rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Health Goals</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.healthGoals.map((goal, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium"
                >
                  {goal}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthProfileCard;