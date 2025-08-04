const express = require('express');
const { body, validationResult } = require('express-validator');
const MealPlan = require('../models/MealPlan');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Save meal plan
router.post('/save', auth, [
  body('weekStart').isISO8601().withMessage('Week start date must be a valid date'),
  body('weekEnd').isISO8601().withMessage('Week end date must be a valid date'),
  body('dailyPlan').isObject().withMessage('Daily plan must be an object'),
  body('notes').optional().isString().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { weekStart, weekEnd, dailyPlan, notes } = req.body;

    // Calculate total calories and cook time
    let totalCalories = 0;
    let totalCookTime = 0;

    // Validate that all recipe IDs exist and belong to the user
    for (const day in dailyPlan) {
      if (dailyPlan[day] && dailyPlan[day].length > 0) {
        const recipes = await Recipe.find({
          _id: { $in: dailyPlan[day] },
          userId: req.user._id
        });

        if (recipes.length !== dailyPlan[day].length) {
          return res.status(400).json({ error: 'Some recipes not found or access denied' });
        }

        // Sum up calories and cook time
        recipes.forEach(recipe => {
          totalCalories += recipe.estimatedCalories || 0;
          const cookTimeMinutes = parseInt(recipe.cookTime) || 0;
          totalCookTime += cookTimeMinutes;
        });
      }
    }

    const mealPlanData = {
      userId: req.user._id,
      weekStart: new Date(weekStart),
      weekEnd: new Date(weekEnd),
      dailyPlan,
      notes,
      totalCalories,
      totalCookTime
    };

    const mealPlan = new MealPlan(mealPlanData);
    await mealPlan.save();

    // Add meal plan to user's meal plans
    const user = await User.findById(req.user._id);
    user.mealPlans.push(mealPlan._id);
    await user.save();

    res.status(201).json({
      message: 'Meal plan saved successfully',
      mealPlan
    });
  } catch (error) {
    console.error('Save meal plan error:', error);
    res.status(500).json({ error: 'Failed to save meal plan' });
  }
});

// Get user's meal plans
router.get('/', auth, async (req, res) => {
  try {
    const mealPlans = await MealPlan.find({ userId: req.user._id })
      .sort({ weekStart: -1 });

    res.json(mealPlans);
  } catch (error) {
    console.error('Get meal plans error:', error);
    res.status(500).json({ error: 'Failed to fetch meal plans' });
  }
});

// Get meal plan by ID with full details
router.get('/:id', auth, async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id)
      .populate({
        path: 'dailyPlan.monday dailyPlan.tuesday dailyPlan.wednesday dailyPlan.thursday dailyPlan.friday dailyPlan.saturday dailyPlan.sunday',
        model: 'Recipe'
      });

    if (!mealPlan) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }

    // Check if user owns the meal plan
    if (mealPlan.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ mealPlan });
  } catch (error) {
    console.error('Get meal plan error:', error);
    res.status(500).json({ error: 'Failed to fetch meal plan' });
  }
});

// Update meal plan
router.put('/:id', auth, [
  body('weekStart').optional().isISO8601().withMessage('Week start date must be a valid date'),
  body('weekEnd').optional().isISO8601().withMessage('Week end date must be a valid date'),
  body('dailyPlan').optional().isObject().withMessage('Daily plan must be an object'),
  body('notes').optional().isString().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mealPlan = await MealPlan.findById(req.params.id);
    
    if (!mealPlan) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }

    // Check if user owns the meal plan
    if (mealPlan.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update meal plan
    Object.assign(mealPlan, req.body);
    await mealPlan.save();

    res.json({
      message: 'Meal plan updated successfully',
      mealPlan
    });
  } catch (error) {
    console.error('Update meal plan error:', error);
    res.status(500).json({ error: 'Failed to update meal plan' });
  }
});

// Delete meal plan
router.delete('/:id', auth, async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id);
    
    if (!mealPlan) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }

    // Check if user owns the meal plan
    if (mealPlan.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Remove meal plan from user's meal plans
    const user = await User.findById(req.user._id);
    user.mealPlans = user.mealPlans.filter(
      id => id.toString() !== req.params.id
    );
    await user.save();

    // Delete meal plan
    await MealPlan.findByIdAndDelete(req.params.id);

    res.json({ message: 'Meal plan deleted successfully' });
  } catch (error) {
    console.error('Delete meal plan error:', error);
    res.status(500).json({ error: 'Failed to delete meal plan' });
  }
});

// Add recipe to specific day
router.post('/:id/day/:day', auth, [
  body('recipeId').isMongoId().withMessage('Valid recipe ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { recipeId } = req.body;
    const { day } = req.params;

    const mealPlan = await MealPlan.findById(req.params.id);
    
    if (!mealPlan) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }

    // Check if user owns the meal plan
    if (mealPlan.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Validate recipe exists and belongs to user
    const recipe = await Recipe.findOne({
      _id: recipeId,
      userId: req.user._id
    });

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found or access denied' });
    }

    // Add recipe to the day
    await mealPlan.addRecipeToDay(day, recipeId);

    res.json({
      message: 'Recipe added to meal plan successfully',
      mealPlan
    });
  } catch (error) {
    console.error('Add recipe to meal plan error:', error);
    res.status(500).json({ error: 'Failed to add recipe to meal plan' });
  }
});

// Remove recipe from specific day
router.delete('/:id/day/:day/:recipeId', auth, async (req, res) => {
  try {
    const { recipeId } = req.params;

    const mealPlan = await MealPlan.findById(req.params.id);
    
    if (!mealPlan) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }

    // Check if user owns the meal plan
    if (mealPlan.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Remove recipe from the day
    await mealPlan.removeRecipeFromDay(req.params.day, recipeId);

    res.json({
      message: 'Recipe removed from meal plan successfully',
      mealPlan
    });
  } catch (error) {
    console.error('Remove recipe from meal plan error:', error);
    res.status(500).json({ error: 'Failed to remove recipe from meal plan' });
  }
});

module.exports = router; 