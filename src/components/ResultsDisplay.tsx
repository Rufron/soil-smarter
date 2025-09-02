import { Button } from "@/components/ui/enhanced-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart3, 
  CloudRain, 
  Thermometer, 
  Target, 
  Save, 
  Crown,
  ArrowLeft,
  MapPin,
  User,
  Sprout
} from "lucide-react";

interface PredictionResult {
  yield: string;
  weather: {
    temperature: string;
    rainfall: string;
  };
  confidence: string;
  farmData: any;
}

interface ResultsDisplayProps {
  result: PredictionResult;
  onBack: () => void;
  onSubscribe: () => void;
}

const ResultsDisplay = ({ result, onBack, onSubscribe }: ResultsDisplayProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">
              Yield Prediction Results
            </h1>
            <p className="text-muted-foreground">
              Based on your farm data and current weather conditions
            </p>
          </div>

          {/* Main Result Card */}
          <Card className="shadow-strong border-border/50 gradient-card">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-success/10 border border-success/20">
                  <Target className="w-8 h-8 text-success" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-success">
                {result.yield} tonnes per hectare
              </CardTitle>
              <CardDescription className="text-lg">
                Estimated crop yield for {result.farmData.crop}
              </CardDescription>
              <Badge variant="secondary" className="mx-auto mt-2 bg-success/10 text-success border-success/20">
                {result.confidence}% Confidence
              </Badge>
            </CardHeader>
          </Card>

          {/* Weather & Farm Details */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Weather Summary */}
            <Card className="shadow-medium border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CloudRain className="w-5 h-5 text-accent" />
                  Weather Conditions
                </CardTitle>
                <CardDescription>
                  Current conditions used for prediction
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/10">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-accent" />
                    <span className="font-medium">Temperature</span>
                  </div>
                  <span className="text-lg font-bold text-accent">{result.weather.temperature}°C</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-2">
                    <CloudRain className="w-4 h-4 text-primary" />
                    <span className="font-medium">Expected Rainfall</span>
                  </div>
                  <span className="text-lg font-bold text-primary">{result.weather.rainfall}mm</span>
                </div>
              </CardContent>
            </Card>

            {/* Farm Summary */}
            <Card className="shadow-medium border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-success" />
                  Farm Details
                </CardTitle>
                <CardDescription>
                  Your submitted farm information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{result.farmData.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{result.farmData.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-muted-foreground" />
                  <span>{result.farmData.crop}</span>
                  {result.farmData.area && (
                    <Badge variant="outline" className="ml-auto">
                      {result.farmData.area} ha
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <Card className="shadow-medium border-border/50">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="outline" 
                  onClick={onBack}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  New Prediction
                </Button>
                <Button 
                  variant="secondary" 
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save to History
                </Button>
                <Button 
                  variant="success" 
                  onClick={onSubscribe}
                  className="flex items-center gap-2"
                >
                  <Crown className="w-4 h-4" />
                  Upgrade to Premium
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Premium Features Teaser */}
          <Card className="shadow-medium border-success/20 bg-success/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <Crown className="w-5 h-5" />
                Premium Features Available
              </CardTitle>
              <CardDescription>
                Unlock advanced features to maximize your farming success
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-success/10 border border-success/20">
                  <h4 className="font-semibold mb-2">SMS Alerts</h4>
                  <p className="text-sm text-muted-foreground">Weather warnings and farming tips</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-success/10 border border-success/20">
                  <h4 className="font-semibold mb-2">Detailed Reports</h4>
                  <p className="text-sm text-muted-foreground">Downloadable analysis and recommendations</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-success/10 border border-success/20">
                  <h4 className="font-semibold mb-2">Monthly Forecasts</h4>
                  <p className="text-sm text-muted-foreground">Long-term yield predictions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;