import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authenticated user first
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    
    // Create Supabase client with the user's auth token
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    const {
      name,
      phone,
      location,
      crop,
      area_ha,
      soil_ph,
      soil_moisture,
      organic_matter
    } = await req.json();

    console.log("Processing yield prediction for user:", user.id);

    // Simple ML model for demonstration
    // In production, this would call a real ML service
    const calculateYield = (
      areaHa: number,
      soilPh: number,
      soilMoisture: number,
      organicMatter: number,
      crop: string
    ) => {
      // Base yield factors by crop type
      const cropFactors: Record<string, number> = {
        'Maize': 4.5,
        'Wheat': 3.2,
        'Rice': 5.8,
        'Beans': 2.1,
        'Potato': 25.0,
        'Tomato': 45.0
      };

      const baseFactor = cropFactors[crop] || 3.0;
      
      // Soil pH optimization (6.0-7.0 is ideal)
      const phFactor = 1 - Math.abs(soilPh - 6.5) * 0.1;
      
      // Soil moisture factor (20-40% is ideal)
      const moistureFactor = soilMoisture < 20 ? 0.7 : 
                            soilMoisture > 40 ? 0.8 : 1.0;
      
      // Organic matter factor (2-4% is ideal)
      const organicFactor = organicMatter < 2 ? 0.8 : 
                           organicMatter > 4 ? 0.9 : 1.1;
      
      const yield_per_hectare = baseFactor * phFactor * moistureFactor * organicFactor;
      const confidence = Math.min(95, 70 + (phFactor + moistureFactor + organicFactor - 2) * 10);
      
      return {
        yield_per_hectare: Math.round(yield_per_hectare * 100) / 100,
        confidence: Math.round(confidence)
      };
    };

    // Create farm record
    const { data: farm, error: farmError } = await supabaseClient
      .from('farms')
      .insert({
        user_id: user.id,
        name: `${name}'s ${crop} Farm`,
        location,
        crop_type: crop,
        area_hectares: area_ha,
        soil_ph,
        soil_moisture,
        organic_matter
      })
      .select()
      .single();

    if (farmError) {
      console.error("Farm creation error:", farmError);
      throw farmError;
    }

    // Generate prediction
    const prediction = calculateYield(area_ha, soil_ph, soil_moisture, organic_matter, crop);
    
    // Mock weather data (in production, fetch from weather API)
    const weatherSummary = {
      temperature: 22 + Math.random() * 8, // 22-30°C
      rainfall: 10 + Math.random() * 40,   // 10-50mm
      humidity: 60 + Math.random() * 30,   // 60-90%
      location: location
    };

    // Save prediction
    const { data: savedPrediction, error: predictionError } = await supabaseClient
      .from('predictions')
      .insert({
        farm_id: farm.id,
        user_id: user.id,
        yield_per_hectare: prediction.yield_per_hectare,
        confidence_score: prediction.confidence,
        weather_summary: weatherSummary,
        model_version: 'v1.0'
      })
      .select()
      .single();

    if (predictionError) {
      console.error("Prediction save error:", predictionError);
      throw predictionError;
    }

    return new Response(JSON.stringify({
      success: true,
      prediction: {
        id: savedPrediction.id,
        yield_per_hectare: prediction.yield_per_hectare,
        confidence_score: prediction.confidence,
        weather_summary: weatherSummary,
        farm_id: farm.id,
        total_yield: Math.round(prediction.yield_per_hectare * area_ha * 100) / 100
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error in predict-yield function:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "Internal server error" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});