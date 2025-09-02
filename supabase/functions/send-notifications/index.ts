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
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { type, message, phone, email } = await req.json();

    console.log(`Sending ${type} notification to user:`, user.id);

    // Get user profile for contact info
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('phone, subscription_tier')
      .eq('user_id', user.id)
      .single();

    // Mock notification sending (in production, integrate with SMS/Email services)
    const notifications = [];

    if (type === 'sms' && (phone || profile?.phone)) {
      // In production, integrate with SMS service like Twilio or Africa's Talking
      notifications.push({
        type: 'sms',
        recipient: phone || profile.phone,
        message: message,
        status: 'sent',
        timestamp: new Date().toISOString()
      });
    }

    if (type === 'email' && (email || user.email)) {
      // In production, integrate with email service like Resend or SendGrid
      notifications.push({
        type: 'email',
        recipient: email || user.email,
        message: message,
        status: 'sent',
        timestamp: new Date().toISOString()
      });
    }

    // Check subscription tier for premium features
    const isPremium = profile?.subscription_tier === 'premium';
    
    if (!isPremium && type === 'sms') {
      throw new Error("SMS notifications require premium subscription");
    }

    return new Response(JSON.stringify({
      success: true,
      notifications,
      message: `Notifications sent successfully`,
      premium_features_used: type === 'sms'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error in send-notifications function:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "Failed to send notifications" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});