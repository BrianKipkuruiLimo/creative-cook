import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import IngredientPicker from "@/components/IngredientPicker";
import RecipeCard from "@/components/RecipeCard";
import RecipeDetailModal from "@/components/RecipeDetailModal";
import { ChefHat, Users, Heart } from "lucide-react";
import heroImage from "@/assets/hero-cooking.jpg";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration
const mockRecipes = [
  {
    id: "1",
    title: "Mediterranean Chicken Bowl",
    description: "Fresh and healthy bowl with grilled chicken, vegetables, and herbs",
    ingredients: ["Chicken", "Tomatoes", "Olive Oil", "Herbs", "Bell Peppers"],
    instructions: [
      "Season and grill the chicken breast until fully cooked",
      "Chop tomatoes and bell peppers into bite-sized pieces", 
      "Mix vegetables with olive oil and fresh herbs",
      "Slice chicken and arrange over the vegetable mixture",
      "Serve immediately while warm"
    ],
    cookTime: "25 mins",
    servings: 2,
    difficulty: "Easy" as const
  },
  {
    id: "2", 
    title: "Creamy Mushroom Pasta",
    description: "Rich and satisfying pasta with sautéed mushrooms in cream sauce",
    ingredients: ["Pasta", "Mushrooms", "Cheese", "Garlic", "Herbs"],
    instructions: [
      "Cook pasta according to package directions until al dente",
      "Sauté sliced mushrooms with minced garlic until golden",
      "Add cream and cheese, stirring until melted and smooth", 
      "Toss cooked pasta with the mushroom cream sauce",
      "Garnish with fresh herbs and serve hot"
    ],
    cookTime: "20 mins",
    servings: 4,
    difficulty: "Medium" as const
  },
  {
    id: "3",
    title: "Asian-Style Beef Stir Fry", 
    description: "Quick and flavorful stir fry with tender beef and crisp vegetables",
    ingredients: ["Beef", "Bell Peppers", "Onions", "Garlic", "Rice"],
    instructions: [
      "Cut beef into thin strips and marinate briefly",
      "Heat oil in wok or large pan over high heat",
      "Stir-fry beef until just cooked, then remove",
      "Stir-fry vegetables until crisp-tender",
      "Return beef to pan, toss everything together, serve over rice"
    ],
    cookTime: "15 mins", 
    servings: 3,
    difficulty: "Easy" as const
  }
];

const Index = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<typeof mockRecipes[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recipes, setRecipes] = useState(mockRecipes);
  const { toast } = useToast();

  const handleRecipeClick = (recipe: typeof mockRecipes[0]) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleGenerateRecipes = async (ingredients: string[]) => {
    setIsLoading(true);
    
    // Show toast about needing Supabase
    toast({
      title: "Connect Supabase Required",
      description: "To generate AI recipes and save them, please connect to Supabase first!",
      duration: 5000,
    });

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Demo Recipes Loaded",
        description: `Showing sample recipes with your ${ingredients.length} ingredients!`,
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Hero Section */}
      <section 
        className="relative h-96 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${heroImage})` }}
      >
        <div className="text-center text-white space-y-4 max-w-2xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Transform Your Ingredients Into Amazing Recipes
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            Let AI help you create delicious meals with what you have
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Ingredient Picker */}
        <IngredientPicker onGenerateRecipes={handleGenerateRecipes} isLoading={isLoading} />

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-16">
          <Card className="text-center p-6 bg-gradient-card border-0 shadow-ingredient">
            <CardContent className="pt-6 space-y-3">
              <ChefHat className="h-12 w-12 text-primary mx-auto" />
              <h3 className="font-semibold text-lg">AI-Powered Recipes</h3>
              <p className="text-muted-foreground text-sm">
                Get personalized recipe suggestions based on your available ingredients
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 bg-gradient-card border-0 shadow-ingredient">
            <CardContent className="pt-6 space-y-3">
              <Users className="h-12 w-12 text-secondary mx-auto" />
              <h3 className="font-semibold text-lg">Personal Recipe Collection</h3>
              <p className="text-muted-foreground text-sm">
                Save and organize your favorite recipes in your personal collection
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 bg-gradient-card border-0 shadow-ingredient">
            <CardContent className="pt-6 space-y-3">
              <Heart className="h-12 w-12 text-accent mx-auto" />
              <h3 className="font-semibold text-lg">Reduce Food Waste</h3>
              <p className="text-muted-foreground text-sm">
                Make the most of your ingredients and reduce food waste
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Recipes */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Sample Recipes</h2>
            <p className="text-muted-foreground">
              Here's what our AI can create for you (connect Supabase for live generation!)
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={handleRecipeClick}
              />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <div className="text-center py-16 space-y-6">
          <h2 className="text-3xl font-bold text-foreground">Ready to Start Cooking?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect your project to Supabase to unlock AI-powered recipe generation, user accounts, and recipe storage.
          </p>
          <Button size="lg" className="bg-gradient-hero text-primary-foreground font-semibold px-8 py-3">
            Connect Supabase to Get Started
          </Button>
        </div>
      </div>

      {/* Recipe Detail Modal */}
      <RecipeDetailModal
        recipe={selectedRecipe}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Index;