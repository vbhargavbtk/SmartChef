const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Recipe title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  ingredients: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: ['produce', 'dairy', 'meat', 'pantry', 'spices', 'other'],
      default: 'other'
    }
  }],
  instructions: [{
    type: String,
    required: true,
    trim: true
  }],
  cookTime: {
    type: String,
    required: true,
    trim: true
  },
  estimatedCalories: {
    type: Number,
    required: true,
    min: [0, 'Calories cannot be negative']
  },
  cuisine: {
    type: String,
    trim: true,
    default: 'General'
  },
  dietaryTags: [{
    type: String,
    enum: ['vegan', 'vegetarian', 'keto', 'gluten-free', 'dairy-free', 'paleo', 'low-carb', 'high-protein']
  }],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  servings: {
    type: Number,
    default: 4,
    min: [1, 'Servings must be at least 1']
  },
  isGenerated: {
    type: Boolean,
    default: true
  },
  originalIngredients: [String], // Store the original ingredients used for generation
  generationParams: {
    inputIngredients: [String],
    cuisineType: String,
    dietaryPreferences: [String],
    maxCookTime: Number,
    difficulty: String,
    servings: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
recipeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for formatted cook time
recipeSchema.virtual('formattedCookTime').get(function() {
  return this.cookTime;
});

// Method to get recipe summary
recipeSchema.methods.getSummary = function() {
  return {
    id: this._id,
    title: this.title,
    cookTime: this.cookTime,
    estimatedCalories: this.estimatedCalories,
    cuisine: this.cuisine,
    difficulty: this.difficulty,
    servings: this.servings,
    dietaryTags: this.dietaryTags
  };
};

module.exports = mongoose.model('Recipe', recipeSchema); 