const mongoose = require('mongoose');

const generatedRecipeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  ingredients: [{
    name: String,
    amount: String,
    category: String
  }],
  instructions: [{
    type: String,
    required: true
  }],
  cookTime: {
    type: Number,
    required: true
  },
  servings: {
    type: Number,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  cuisine: {
    type: String,
    default: 'General'
  },
  dietaryTags: [{
    type: String
  }],
  estimatedCalories: {
    type: Number,
    default: 0
  },
  nutritionalInfo: {
    type: Map,
    of: String
  },
  // Store the generation parameters for reference
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
  }
});

// Index for faster queries
generatedRecipeSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('GeneratedRecipe', generatedRecipeSchema); 