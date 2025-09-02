import "https://deno.land/x/xhr@0.1.0/mod.ts";
import "https://deno.land/std@0.168.0/dotenv/load.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// ...existing code...

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      console.error('Missing OpenAI API key');
      return new Response(JSON.stringify({ error: 'Missing OpenAI API key' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { ingredients, preferences } = await req.json();
    
    if (!ingredients || ingredients.length === 0) {
      return new Response(JSON.stringify({ error: 'No ingredients provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = `Create a delicious recipe using these ingredients: ${ingredients.join(', ')}.
    ${preferences ? `Additional preferences: ${preferences}` : ''}
    
    Please respond with a JSON object containing:
    - title: A creative name for the recipe
    - description: A brief, appetizing description
    - ingredients: Array of ingredients with quantities
    - instructions: Array of step-by-step cooking instructions
    - cookTime: Estimated cooking time (e.g., "25 mins")
    - servings: Number of servings (as integer)
    - difficulty: One of "Easy", "Medium", or "Hard"
    
    Make sure the recipe is practical and delicious!`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o', // <-- FIXED MODEL NAME
        messages: [
          { 
            role: 'system', 
            content: 'You are a professional chef AI that creates amazing recipes. Always respond with valid JSON only.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, response.statusText, errorText);
      return new Response(JSON.stringify({ error: 'Failed to generate recipe', details: errorText }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('OpenAI response:', data); // <-- LOG RESPONSE FOR DEBUGGING
    const generatedContent = data.choices[0].message.content;
    
    try {
      const recipe = JSON.parse(generatedContent);
      
      // Validate the recipe structure
      if (!recipe.title || !recipe.ingredients || !recipe.instructions) {
        throw new Error('Invalid recipe structure');
      }
      
      return new Response(JSON.stringify({ recipe }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Error parsing generated recipe:', parseError);
      console.error('Generated content:', generatedContent);
      
      return new Response(JSON.stringify({ error: 'Failed to parse generated recipe', details: generatedContent }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in generate-recipe function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});