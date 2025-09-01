import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";

interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  cookTime: string;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface RecipeCardProps {
  recipe: Recipe;
  onClick: (recipe: Recipe) => void;
}

const RecipeCard = ({ recipe, onClick }: RecipeCardProps) => {
  const difficultyColor = {
    Easy: 'bg-secondary text-secondary-foreground',
    Medium: 'bg-accent text-accent-foreground',
    Hard: 'bg-destructive text-destructive-foreground'
  };

  return (
    <Card 
      className="cursor-pointer transition-all duration-300 hover:shadow-recipe hover:-translate-y-1 bg-gradient-card border-0"
      onClick={() => onClick(recipe)}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg font-semibold text-foreground line-clamp-2">
            {recipe.title}
          </CardTitle>
          <Badge className={difficultyColor[recipe.difficulty]}>
            {recipe.difficulty}
          </Badge>
        </div>
        <CardDescription className="text-muted-foreground line-clamp-2">
          {recipe.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{recipe.cookTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{recipe.servings} servings</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {ingredient}
            </Badge>
          ))}
          {recipe.ingredients.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{recipe.ingredients.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;