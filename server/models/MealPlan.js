const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weekStart: {
    type: Date,
    required: true
  },
  weekEnd: {
    type: Date,
    required: true
  },
  dailyPlan: {
    monday: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe'
    }],
    tuesday: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe'
    }],
    wednesday: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe'
    }],
    thursday: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe'
    }],
    friday: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe'
    }],
    saturday: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe'
    }],
    sunday: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe'
    }]
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  totalCalories: {
    type: Number,
    default: 0
  },
  totalCookTime: {
    type: Number,
    default: 0 // in minutes
  },
  isActive: {
    type: Boolean,
    default: true
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
mealPlanSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to get meal plan summary
mealPlanSchema.methods.getSummary = function() {
  return {
    id: this._id,
    weekStart: this.weekStart,
    weekEnd: this.weekEnd,
    totalCalories: this.totalCalories,
    totalCookTime: this.totalCookTime,
    isActive: this.isActive,
    notes: this.notes
  };
};

// Method to get recipes for a specific day
mealPlanSchema.methods.getDayRecipes = function(day) {
  const dayKey = day.toLowerCase();
  return this.dailyPlan[dayKey] || [];
};

// Method to add recipe to a day
mealPlanSchema.methods.addRecipeToDay = function(day, recipeId) {
  const dayKey = day.toLowerCase();
  if (!this.dailyPlan[dayKey]) {
    this.dailyPlan[dayKey] = [];
  }
  if (!this.dailyPlan[dayKey].includes(recipeId)) {
    this.dailyPlan[dayKey].push(recipeId);
  }
  return this.save();
};

// Method to remove recipe from a day
mealPlanSchema.methods.removeRecipeFromDay = function(day, recipeId) {
  const dayKey = day.toLowerCase();
  if (this.dailyPlan[dayKey]) {
    this.dailyPlan[dayKey] = this.dailyPlan[dayKey].filter(
      id => id.toString() !== recipeId.toString()
    );
  }
  return this.save();
};

module.exports = mongoose.model('MealPlan', mealPlanSchema); 