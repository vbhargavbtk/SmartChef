const { GoogleGenerativeAI } = require('@google/generative-ai');
const { generateMockRecipe, generateMockMealPlan } = require('./mockRecipeService');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateRecipe = async (ingredients, preferences = {}, cuisine = '', maxCookTime = 60) => {
  try {
    console.log('Generating recipe with:', { ingredients, preferences, cuisine, maxCookTime });
    
    // Try Gemini API first
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are SmartChef, a helpful AI chef. Given the ingredients: ${ingredients.join(', ')}, dietary preferences: ${preferences.diet || 'none'}, cuisine: ${cuisine || 'any'}, max cook time: ${maxCookTime} minutes, generate a recipe in JSON format:

{
  "title": "Recipe Title",
  "ingredients": [
    {
      "name": "Ingredient Name",
      "amount": "Amount needed",
      "category": "produce|dairy|meat|pantry|spices|other"
    }
  ],
  "instructions": [
    "Step 1 description",
    "Step 2 description"
  ],
  "cookTime": "XX minutes",
  "estimatedCalories": 500,
  "cuisine": "Cuisine type",
  "dietaryTags": ["vegan", "vegetarian", "gluten-free"],
  "difficulty": "easy|medium|hard",
  "servings": 4
}

Important guidelines:
- Use only the provided ingredients plus common pantry staples (salt, pepper, oil, etc.)
- Ensure the recipe is realistic and achievable
- Provide clear, step-by-step instructions
- Estimate calories accurately
- Categorize ingredients properly
- Make sure cook time is within the specified limit
- Add appropriate dietary tags
- Return ONLY valid JSON, no additional text`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from AI');
      }
      
      const recipeData = JSON.parse(jsonMatch[0]);
      
      // Validate required fields
      if (!recipeData.title || !recipeData.ingredients || !recipeData.instructions) {
        throw new Error('Missing required recipe fields');
      }
      
      return recipeData;
    } catch (geminiError) {
      console.log('Gemini API failed, using mock recipe service:', geminiError.message);
      // Fall back to mock service
      return await generateMockRecipe(ingredients, preferences, cuisine, maxCookTime);
    }
  } catch (error) {
    console.error('Recipe generation error:', error);
    throw new Error(`Failed to generate recipe: ${error.message}`);
  }
};

const generateMealPlan = async (preferences, days = 7) => {
  try {
    // Try Gemini API first
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are SmartChef, a meal planning assistant. Generate a ${days}-day meal plan based on these preferences: ${JSON.stringify(preferences)}.

Return the response in JSON format:
{
  "mealPlan": [
    {
      "day": "Monday",
      "meals": [
        {
          "type": "breakfast|lunch|dinner|snack",
          "title": "Meal Title",
          "estimatedCalories": 500,
          "cookTime": "30 minutes",
          "ingredients": ["ingredient1", "ingredient2"]
        }
      ]
    }
  ]
}

Guidelines:
- Include variety in meals
- Consider dietary restrictions
- Balance nutrition
- Keep cook times reasonable
- Return ONLY valid JSON`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from AI');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (geminiError) {
      console.log('Gemini API failed, using mock meal plan service:', geminiError.message);
      // Fall back to mock service
      return await generateMockMealPlan(preferences, days);
    }
  } catch (error) {
    console.error('Meal plan generation error:', error);
    throw new Error('Failed to generate meal plan. Please try again.');
  }
};

module.exports = {
  generateRecipe,
  generateMealPlan
}; 