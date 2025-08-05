const generateMockRecipe = async (ingredients, preferences = {}, cuisine = '', maxCookTime = 60, difficulty = 'medium', servings = 4) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Use the actual provided ingredients to create a recipe
  const providedIngredients = ingredients.map(ing => ing.toLowerCase());
  
  // Create recipe based on provided ingredients
  let recipeTitle = '';
  let recipeIngredients = [];
  let recipeInstructions = [];
  let recipeCuisine = cuisine || 'General';
  
  // Add the provided ingredients to the recipe
  providedIngredients.forEach(ingredient => {
    if (ingredient.includes('mushroom')) {
      recipeIngredients.push({ name: "Mushrooms", amount: "200g", category: "produce" });
    } else if (ingredient.includes('onion')) {
      recipeIngredients.push({ name: "Onion", amount: "1 medium", category: "produce" });
    } else if (ingredient.includes('tomato')) {
      recipeIngredients.push({ name: "Tomatoes", amount: "2 medium", category: "produce" });
    } else if (ingredient.includes('chicken')) {
      recipeIngredients.push({ name: "Chicken breast", amount: "300g", category: "meat" });
    } else if (ingredient.includes('rice')) {
      recipeIngredients.push({ name: "Rice", amount: "1 cup", category: "pantry" });
    } else if (ingredient.includes('paneer')) {
      recipeIngredients.push({ name: "Paneer", amount: "200g", category: "dairy" });
    } else if (ingredient.includes('mirchi') || ingredient.includes('chili')) {
      recipeIngredients.push({ name: "Green chilies", amount: "2-3", category: "produce" });
    } else {
      // For any other ingredient, add it as is
      recipeIngredients.push({ name: ingredient.charAt(0).toUpperCase() + ingredient.slice(1), amount: "as needed", category: "other" });
    }
  });

  // Add common pantry staples
  recipeIngredients.push(
    { name: "Oil", amount: "2 tbsp", category: "pantry" },
    { name: "Salt", amount: "to taste", category: "spices" },
    { name: "Black pepper", amount: "to taste", category: "spices" }
  );

  // Generate recipe based on ingredients
  if (providedIngredients.some(ing => ing.includes('mushroom'))) {
    recipeTitle = "Sautéed Mushroom Delight";
    recipeInstructions = [
      "Clean and slice mushrooms",
      "Heat oil in a pan over medium heat",
      "Add sliced mushrooms and sauté for 5-7 minutes",
      "Add salt and pepper to taste",
      "Cook until mushrooms are golden brown",
      "Serve hot as a side dish or main course"
    ];
  } else if (providedIngredients.some(ing => ing.includes('onion'))) {
    recipeTitle = "Caramelized Onion Dish";
    recipeInstructions = [
      "Slice onions thinly",
      "Heat oil in a pan over low heat",
      "Add sliced onions and cook slowly",
      "Stir occasionally for 20-25 minutes",
      "Add salt to taste",
      "Cook until onions are caramelized and golden"
    ];
  } else if (providedIngredients.some(ing => ing.includes('tomato'))) {
    recipeTitle = "Fresh Tomato Salsa";
    recipeInstructions = [
      "Dice tomatoes finely",
      "Chop onions if available",
      "Mix tomatoes and onions in a bowl",
      "Add salt and pepper to taste",
      "Let it sit for 10 minutes",
      "Serve as a fresh salsa or side dish"
    ];
  } else if (providedIngredients.some(ing => ing.includes('mushroom') && ing.includes('onion'))) {
    recipeTitle = "Mushroom and Onion Stir-Fry";
    recipeInstructions = [
      "Clean and slice mushrooms",
      "Slice onions thinly",
      "Heat oil in a wok or large pan",
      "Add onions and sauté until translucent",
      "Add mushrooms and cook for 5-7 minutes",
      "Add salt and pepper to taste",
      "Serve hot with rice or bread"
    ];
  } else {
    // Generic recipe for any ingredients
    recipeTitle = `${providedIngredients.map(ing => ing.charAt(0).toUpperCase() + ing.slice(1)).join(' ')} Stir-Fry`;
    recipeInstructions = [
      "Prepare all ingredients",
      "Heat oil in a wok or large pan",
      "Add ingredients one by one",
      "Stir-fry for 5-7 minutes",
      "Add salt and pepper to taste",
      "Serve hot"
    ];
  }

  // Use the generated recipe based on provided ingredients
  const generatedRecipe = {
    title: recipeTitle,
    ingredients: recipeIngredients,
    instructions: recipeInstructions,
    cookTime: `${Math.min(maxCookTime, 30)} minutes`,
    estimatedCalories: 250,
    cuisine: recipeCuisine,
    dietaryTags: ["vegetarian"],
    difficulty: difficulty.toLowerCase(),
    servings: servings
  };

  // Adjust ingredients based on servings
  if (servings !== 4) {
    const multiplier = servings / 4;
    generatedRecipe.ingredients = generatedRecipe.ingredients.map(ingredient => {
      const newIngredient = { ...ingredient };
      if (ingredient.amount && ingredient.amount.includes(' ')) {
        const parts = ingredient.amount.split(' ');
        const amount = parseFloat(parts[0]);
        if (!isNaN(amount)) {
          const newAmount = (amount * multiplier).toFixed(1);
          newIngredient.amount = `${newAmount} ${parts.slice(1).join(' ')}`;
        }
      }
      return newIngredient;
    });
  }

  // Generated recipe with constraints applied successfully

  return generatedRecipe;
};



module.exports = {
  generateMockRecipe
}; 