export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: error.details.map(detail => detail.message),
      });
    }
    
    next();
  };
};

// Common validation schemas
export const schemas = {
  ingredient: {
    validate: (data) => {
      if (!data.ingredient || data.ingredient.trim().length === 0) {
        return { error: { details: [{ message: 'Ingredient is required' }] } };
      }
      if (data.ingredient.length > 100) {
        return { error: { details: [{ message: 'Ingredient name too long' }] } };
      }
      return {};
    }
  },
  mood: {
    validate: (data) => {
      const validMoods = ['happy', 'sad', 'stressed', 'energetic', 'tired', 'anxious', 'calm'];
      if (!validMoods.includes(data.mood)) {
        return { error: { details: [{ message: 'Invalid mood' }] } };
      }
      return {};
    }
  },
};