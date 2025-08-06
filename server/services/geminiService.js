const { GoogleGenerativeAI } = require('@google/generative-ai');
const { generateMockRecipe } = require('./mockRecipeService');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateRecipe = async (ingredients, preferences = {}, cuisine = '', maxCookTime = 60, difficulty = 'medium', servings = 4) => {
  try {
    // Generating recipe with provided parameters
    
    // Try Gemini API first
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are YourSmartChef, a helpful AI chef. Given the ingredients: ${ingredients.join(', ')}, dietary preferences: ${preferences.diet || 'none'}, cuisine: ${cuisine || 'any'}, max cook time: ${maxCookTime} minutes, difficulty level: ${difficulty}, servings: ${servings}, generate a recipe in JSON format:

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
- Make sure cook time is within the specified limit (${maxCookTime} minutes maximum)
- Set difficulty level to "${difficulty}" (easy/medium/hard)
- Set servings to exactly ${servings}
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
      
      // Validate and enforce constraints
      const cookTimeMatch = recipeData.cookTime.match(/(\d+)/);
      const actualCookTime = cookTimeMatch ? parseInt(cookTimeMatch[1]) : 60;
      
      if (actualCookTime > maxCookTime) {
        recipeData.cookTime = `${maxCookTime} minutes`;
      }
      
      if (difficulty && difficulty !== 'any') {
        recipeData.difficulty = difficulty.toLowerCase();
      }
      
      if (servings) {
        recipeData.servings = servings;
      }
      
      // Recipe generated successfully with constraints applied
      
      return recipeData;
    } catch (geminiError) {
      // Gemini API failed, using mock recipe service as fallback
      // Fall back to mock service
      return await generateMockRecipe(ingredients, preferences, cuisine, maxCookTime, difficulty, servings);
    }
  } catch (error) {
    console.error('Recipe generation error:', error);
    throw new Error(`Failed to generate recipe: ${error.message}`);
  }
};



module.exports = {
  generateRecipe
}; 