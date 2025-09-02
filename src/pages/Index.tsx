import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import IngredientPicker from "@/components/IngredientPicker";
import RecipeCard from "@/components/RecipeCard";
import RecipeDetailModal from "@/components/RecipeDetailModal";
import { ChefHat, Users, Heart, LogOut, User } from "lucide-react";
import heroImage from "@/assets/hero-cooking.jpg";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

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
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recipes, setRecipes] = useState<any[]>([]);
  const { toast } = useToast();
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Load user's recipes
  useEffect(() => {
    if (user) {
      loadUserRecipes();
    }
  }, [user]);

  const loadUserRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecipes(data || []);
    } catch (error) {
      console.error('Error loading recipes:', error);
      toast({
        title: "Error loading recipes",
        description: "Failed to load your recipes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRecipeClick = (recipe: any) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleGenerateRecipes = async (ingredients: string[]) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Call OpenAI edge function to generate recipe
      const response = await supabase.functions.invoke('generate-recipe', {
        body: { ingredients, preferences: '' }
      });

      if (response.error) throw response.error;

      const { recipe } = response.data;
      
      // Save the generated recipe to the database
      const { data, error } = await supabase
        .from('recipes')
        .insert({
          user_id: user.id,
          title: recipe.title,
          description: recipe.description,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          cook_time: recipe.cookTime,
          servings: recipe.servings,
          difficulty: recipe.difficulty,
          is_ai_generated: true
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      setRecipes(prev => [data, ...prev]);
      
      toast({
        title: "Recipe Generated!",
        description: `Created "${recipe.title}" with your ingredients!`,
      });
    } catch (error) {
      console.error('Error generating recipe:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate recipe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while auth is being checked
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold">AI Recipe Generator</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="text-sm text-muted-foreground">{user?.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="relative h-80 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${heroImage})` }}
      >
        <div className="text-center text-white space-y-4 max-w-2xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Your Personal Recipe Collection
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            Generate AI-powered recipes from your ingredients
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

        {/* Recipes Section */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Your Recipe Collection</h2>
            <p className="text-muted-foreground">
              {recipes.length === 0 
                ? "Generate your first AI recipe using the ingredient picker above!"
                : `You have ${recipes.length} delicious recipe${recipes.length !== 1 ? 's' : ''}`
              }
            </p>
          </div>
          
          {recipes.length === 0 ? (
            <div className="text-center py-12">
              <ChefHat className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No recipes yet</h3>
              <p className="text-muted-foreground mb-6">
                Add some ingredients above and generate your first AI-powered recipe!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={handleRecipeClick}
                />
              ))}
            </div>
          )}
        </section>
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