const generateMockRecipe = async (ingredients, preferences = {}, cuisine = '', maxCookTime = 60) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const mockRecipes = {
    chicken: {
      title: "Spicy Garlic Chicken Stir-Fry",
      ingredients: [
        { name: "Chicken breast", amount: "2 pieces", category: "meat" },
        { name: "Garlic", amount: "4 cloves", category: "produce" },
        { name: "Ginger", amount: "1 inch", category: "produce" },
        { name: "Soy sauce", amount: "3 tbsp", category: "pantry" },
        { name: "Vegetable oil", amount: "2 tbsp", category: "pantry" },
        { name: "Bell peppers", amount: "2 medium", category: "produce" },
        { name: "Onion", amount: "1 medium", category: "produce" }
      ],
      instructions: [
        "Cut chicken into bite-sized pieces and season with salt and pepper",
        "Heat oil in a large wok or skillet over high heat",
        "Add minced garlic and ginger, stir-fry for 30 seconds until fragrant",
        "Add chicken pieces and cook until golden brown, about 5-7 minutes",
        "Add sliced bell peppers and onion, stir-fry for 3-4 minutes",
        "Pour in soy sauce and stir to combine",
        "Cook for another 2 minutes until vegetables are tender-crisp",
        "Serve hot with steamed rice"
      ],
      cookTime: "25 minutes",
      estimatedCalories: 350,
      cuisine: "Asian",
      dietaryTags: ["high-protein", "gluten-free"],
      difficulty: "easy",
      servings: 4
    },
    tomato: {
      title: "Fresh Tomato Basil Pasta",
      ingredients: [
        { name: "Fresh tomatoes", amount: "4 large", category: "produce" },
        { name: "Basil leaves", amount: "1 cup", category: "produce" },
        { name: "Spaghetti", amount: "1 pound", category: "pantry" },
        { name: "Olive oil", amount: "3 tbsp", category: "pantry" },
        { name: "Garlic", amount: "3 cloves", category: "produce" },
        { name: "Parmesan cheese", amount: "1/2 cup", category: "dairy" },
        { name: "Salt and pepper", amount: "to taste", category: "spices" }
      ],
      instructions: [
        "Bring a large pot of salted water to boil and cook spaghetti according to package directions",
        "Meanwhile, dice tomatoes and mince garlic",
        "Heat olive oil in a large skillet over medium heat",
        "Add minced garlic and cook until fragrant, about 1 minute",
        "Add diced tomatoes and cook for 5-7 minutes until they start to break down",
        "Tear basil leaves and add to the skillet",
        "Drain pasta and add to the skillet with tomato mixture",
        "Toss to combine and add grated parmesan cheese",
        "Season with salt and pepper to taste",
        "Serve immediately with extra basil and parmesan on top"
      ],
      cookTime: "20 minutes",
      estimatedCalories: 450,
      cuisine: "Italian",
      dietaryTags: ["vegetarian"],
      difficulty: "easy",
      servings: 4
    },
    beef: {
      title: "Classic Beef Tacos",
      ingredients: [
        { name: "Ground beef", amount: "1 pound", category: "meat" },
        { name: "Taco seasoning", amount: "1 packet", category: "spices" },
        { name: "Tortillas", amount: "8 medium", category: "pantry" },
        { name: "Lettuce", amount: "1 head", category: "produce" },
        { name: "Tomatoes", amount: "2 medium", category: "produce" },
        { name: "Onion", amount: "1 medium", category: "produce" },
        { name: "Cheese", amount: "1 cup shredded", category: "dairy" },
        { name: "Sour cream", amount: "1/2 cup", category: "dairy" }
      ],
      instructions: [
        "Heat a large skillet over medium-high heat",
        "Add ground beef and cook until browned, breaking it up with a spoon",
        "Drain excess fat and add taco seasoning with 1/2 cup water",
        "Simmer for 5 minutes until sauce thickens",
        "Warm tortillas in a dry skillet or microwave",
        "Chop lettuce, tomatoes, and onion",
        "Assemble tacos with beef, vegetables, cheese, and sour cream",
        "Serve immediately with your favorite hot sauce"
      ],
      cookTime: "15 minutes",
      estimatedCalories: 380,
      cuisine: "Mexican",
      dietaryTags: ["high-protein"],
      difficulty: "easy",
      servings: 4
    }
  };

  // Find a recipe based on ingredients
  let selectedRecipe = null;
  for (const ingredient of ingredients) {
    if (mockRecipes[ingredient.toLowerCase()]) {
      selectedRecipe = mockRecipes[ingredient.toLowerCase()];
      break;
    }
  }

  // If no specific recipe found, use a default
  if (!selectedRecipe) {
    selectedRecipe = mockRecipes.chicken;
  }

  // Customize based on preferences
  if (preferences.diet === 'Vegetarian' || preferences.diet === 'Vegan') {
    selectedRecipe = mockRecipes.tomato;
  }

  if (cuisine && cuisine.toLowerCase() === 'italian') {
    selectedRecipe = mockRecipes.tomato;
  }

  if (cuisine && cuisine.toLowerCase() === 'mexican') {
    selectedRecipe = mockRecipes.beef;
  }

  return selectedRecipe;
};

const generateMockMealPlan = async (preferences, days = 7) => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const mockMeals = [
    {
      day: "Monday",
      meals: [
        {
          type: "breakfast",
          title: "Avocado Toast with Eggs",
          estimatedCalories: 350,
          cookTime: "10 minutes",
          ingredients: ["bread", "avocado", "eggs", "salt", "pepper"]
        },
        {
          type: "lunch",
          title: "Grilled Chicken Salad",
          estimatedCalories: 400,
          cookTime: "15 minutes",
          ingredients: ["chicken breast", "lettuce", "tomatoes", "cucumber", "olive oil"]
        },
        {
          type: "dinner",
          title: "Salmon with Roasted Vegetables",
          estimatedCalories: 450,
          cookTime: "25 minutes",
          ingredients: ["salmon", "broccoli", "carrots", "olive oil", "lemon"]
        }
      ]
    }
  ];

  return { mealPlan: mockMeals };
};

module.exports = {
  generateMockRecipe,
  generateMockMealPlan
}; 