const express = require('express');
const { body, validationResult } = require('express-validator');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { generateRecipe } = require('../services/geminiService');

const router = express.Router();

// Generate recipe using AI
router.post('/generate', auth, [
  body('ingredients').isArray({ min: 1 }).withMessage('At least one ingredient is required'),
  body('ingredients.*').isString().trim().notEmpty().withMessage('Ingredient cannot be empty'),
  body('cuisineType').optional().isString().trim(),
  body('dietaryPreferences').optional().isArray(),
  body('maxCookTime').optional().isInt({ min: 10, max: 300 }).withMessage('Cook time must be between 10 and 300 minutes'),
  body('difficulty').optional().isString(),
  body('servings').optional().isInt({ min: 1, max: 12 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { ingredients, cuisineType = '', dietaryPreferences = [], maxCookTime = 60, difficulty = 'medium', servings = 4 } = req.body;

    // Convert dietary preferences to the format expected by Gemini
    const preferences = {
      diet: dietaryPreferences.length > 0 ? dietaryPreferences[0] : 'none'
    };

    // Generate recipe using Gemini AI
    const recipeData = await generateRecipe(ingredients, preferences, cuisineType, maxCookTime, difficulty, servings);

    // Convert ingredients to the format expected by Recipe model
    const formattedIngredients = recipeData.ingredients.map(ingredient => {
      if (typeof ingredient === 'string') {
        return {
          name: ingredient,
          amount: 'as needed',
          category: 'other'
        }
      }
      return ingredient
    });

    // Save directly to Recipe collection (central database)
    const recipeToSave = {
      userId: req.user._id,
      title: recipeData.title,
      ingredients: formattedIngredients,
      instructions: recipeData.instructions,
      cookTime: recipeData.cookTime.toString(),
      estimatedCalories: recipeData.estimatedCalories || 0,
      cuisine: recipeData.cuisine || 'General',
      dietaryTags: recipeData.dietaryTags || [],
      difficulty: recipeData.difficulty?.toLowerCase() || 'medium',
      servings: recipeData.servings,
      isGenerated: true,
      originalIngredients: ingredients,
      generationParams: {
        inputIngredients: ingredients,
        cuisineType: cuisineType || '',
        dietaryPreferences: dietaryPreferences || [],
        maxCookTime: maxCookTime,
        difficulty: difficulty,
        servings: servings
      }
    };

    const savedRecipe = new Recipe(recipeToSave);
    await savedRecipe.save();

    // Add recipe to user's saved recipes
    const user = await User.findById(req.user._id);
    user.savedRecipes.push(savedRecipe._id);
    await user.save();

    res.json({
      message: 'Recipe generated and saved successfully',
      recipe: savedRecipe
    });
  } catch (error) {
    console.error('Recipe generation error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate recipe. Please try again.' 
    });
  }
});

// Save recipe
router.post('/save', auth, [
  body('title').trim().notEmpty().withMessage('Recipe title is required'),
  body('ingredients').isArray({ min: 1 }).withMessage('At least one ingredient is required'),
  body('instructions').isArray({ min: 1 }).withMessage('At least one instruction is required'),
  body('cookTime').notEmpty().withMessage('Cook time is required'),
  body('estimatedCalories').optional().isInt({ min: 0 }).withMessage('Calories must be a positive number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const recipeData = {
      ...req.body,
      userId: req.user._id
    };

    const recipe = new Recipe(recipeData);
    await recipe.save();

    // Add recipe to user's saved recipes
    const user = await User.findById(req.user._id);
    user.savedRecipes.push(recipe._id);
    await user.save();

    res.status(201).json({
      message: 'Recipe saved successfully',
      recipe
    });
  } catch (error) {
    console.error('Save recipe error:', error);
    res.status(500).json({ error: 'Failed to save recipe' });
  }
});

// Get user's saved recipes (all recipes - generated and manual)
router.get('/saved', auth, async (req, res) => {
  try {
    const recipes = await Recipe.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json(recipes);
  } catch (error) {
    console.error('Get saved recipes error:', error);
    res.status(500).json({ error: 'Failed to fetch saved recipes' });
  }
});

// Get user's generated recipes (for history view)
router.get('/generated', auth, async (req, res) => {
  try {
    const recipes = await Recipe.find({ 
      userId: req.user._id,
      isGenerated: true 
    }).sort({ createdAt: -1 });

    res.json(recipes);
  } catch (error) {
    console.error('Get generated recipes error:', error);
    res.status(500).json({ error: 'Failed to fetch generated recipes' });
  }
});

// Get specific recipe
router.get('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Check if user owns the recipe
    if (recipe.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ recipe });
  } catch (error) {
    console.error('Get recipe error:', error);
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});

// Get recipe by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Check if user owns the recipe
    if (recipe.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ recipe });
  } catch (error) {
    console.error('Get recipe error:', error);
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});

// Update recipe
router.put('/:id', auth, [
  body('title').optional().trim().notEmpty().withMessage('Recipe title cannot be empty'),
  body('ingredients').optional().isArray({ min: 1 }).withMessage('At least one ingredient is required'),
  body('instructions').optional().isArray({ min: 1 }).withMessage('At least one instruction is required'),
  body('cookTime').optional().notEmpty().withMessage('Cook time cannot be empty'),
  body('estimatedCalories').optional().isInt({ min: 0 }).withMessage('Calories must be a positive number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Check if user owns the recipe
    if (recipe.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update recipe
    Object.assign(recipe, req.body);
    await recipe.save();

    res.json({
      message: 'Recipe updated successfully',
      recipe
    });
  } catch (error) {
    console.error('Update recipe error:', error);
    res.status(500).json({ error: 'Failed to update recipe' });
  }
});

// Delete recipe
router.delete('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Check if user owns the recipe
    if (recipe.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Remove recipe from user's saved recipes
    const user = await User.findById(req.user._id);
    user.savedRecipes = user.savedRecipes.filter(
      id => id.toString() !== req.params.id
    );
    await user.save();

    // Delete recipe
    await Recipe.findByIdAndDelete(req.params.id);

    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
});



module.exports = router; 