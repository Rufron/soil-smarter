import { useState } from "react";
import { Button } from "@/components/ui/enhanced-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MapPin, User, Phone, Sprout, BarChart3, TestTube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  name: string;
  phone: string;
  location: string;
  crop: string;
  area: string;
  soilPh: string;
  soilMoisture: string;
  organicMatter: string;
}

interface PredictionFormProps {
  onPrediction: (result: any) => void;
}

const PredictionForm = ({ onPrediction }: PredictionFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    location: "",
    crop: "",
    area: "",
    soilPh: "",
    soilMoisture: "",
    organicMatter: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to generate yield predictions.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Validation
    if (!formData.name || !formData.phone || !formData.location || !formData.crop) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('predict-yield', {
        body: {
          name: formData.name,
          phone: formData.phone,
          location: formData.location,
          crop: formData.crop,
          area_ha: parseFloat(formData.area) || 1,
          soil_ph: parseFloat(formData.soilPh) || 6.5,
          soil_moisture: parseFloat(formData.soilMoisture) || 25,
          organic_matter: parseFloat(formData.organicMatter) || 2.5
        }
      });

      if (error) throw error;

      const result = {
        yield: data.prediction.yield_per_hectare.toFixed(2),
        weather: {
          temperature: data.prediction.weather_summary.temperature.toFixed(1),
          rainfall: data.prediction.weather_summary.rainfall.toFixed(0),
          humidity: data.prediction.weather_summary.humidity.toFixed(0)
        },
        confidence: data.prediction.confidence_score.toFixed(0),
        totalYield: data.prediction.total_yield.toFixed(2),
        farmId: data.prediction.farm_id,
        farmData: formData,
      };
      
      onPrediction(result);
      
      toast({
        title: "Prediction Complete!",
        description: `Estimated yield: ${result.yield} t/ha with ${result.confidence}% confidence`,
      });
    } catch (error: any) {
      toast({
        title: "Prediction Failed",
        description: error.message || "There was an error generating your yield prediction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 py-12">
      <div className="container mx-auto px-6 max-w-2xl">
        <Card className="shadow-medium border-border/50">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold text-primary mb-2">
              Crop Yield Prediction
            </CardTitle>
            <CardDescription className="text-lg">
              Enter your farm details to get an accurate yield prediction
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Farmer Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Farmer Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="shadow-soft"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="+254 123 456 789"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="shadow-soft"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Farm Location & Crop */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-accent" />
                  <h3 className="font-semibold text-lg">Farm Details</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location (City/Town) *</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Eldoret, Nakuru"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="shadow-soft"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="crop">Crop Type *</Label>
                    <Select value={formData.crop} onValueChange={(value) => handleInputChange("crop", value)}>
                      <SelectTrigger className="shadow-soft">
                        <SelectValue placeholder="Select crop type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maize">Maize</SelectItem>
                        <SelectItem value="wheat">Wheat</SelectItem>
                        <SelectItem value="beans">Beans</SelectItem>
                        <SelectItem value="potatoes">Potatoes</SelectItem>
                        <SelectItem value="rice">Rice</SelectItem>
                        <SelectItem value="barley">Barley</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="area">Farm Area (Hectares)</Label>
                  <Input
                    id="area"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 1.5"
                    value={formData.area}
                    onChange={(e) => handleInputChange("area", e.target.value)}
                    className="shadow-soft"
                  />
                </div>
              </div>

              <Separator />

              {/* Soil Data */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <TestTube className="w-5 h-5 text-success" />
                  <h3 className="font-semibold text-lg">Soil Analysis</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="soilPh">pH Level</Label>
                    <Input
                      id="soilPh"
                      type="number"
                      step="0.1"
                      min="3"
                      max="9"
                      placeholder="e.g., 6.5"
                      value={formData.soilPh}
                      onChange={(e) => handleInputChange("soilPh", e.target.value)}
                      className="shadow-soft"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="soilMoisture">Soil Moisture (%)</Label>
                    <Input
                      id="soilMoisture"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      placeholder="e.g., 22.0"
                      value={formData.soilMoisture}
                      onChange={(e) => handleInputChange("soilMoisture", e.target.value)}
                      className="shadow-soft"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organicMatter">Organic Matter (%)</Label>
                    <Input
                      id="organicMatter"
                      type="number"
                      step="0.1"
                      min="0"
                      max="20"
                      placeholder="e.g., 2.1"
                      value={formData.organicMatter}
                      onChange={(e) => handleInputChange("organicMatter", e.target.value)}
                      className="shadow-soft"
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                variant="hero" 
                size="lg" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Analyzing Data...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Predict Yield
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PredictionForm;