import { Button } from "@/components/ui/enhanced-button";
import { Sprout, Target, TrendingUp } from "lucide-react";

const HeroSection = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary" />
        <div className="absolute bottom-40 right-20 w-24 h-24 rounded-full bg-accent" />
        <div className="absolute top-60 right-40 w-16 h-16 rounded-full bg-success" />
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Hero Badge */}
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-8">
            <Sprout className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Smart Agricultural Intelligence</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight">
            Predict Your Crop Yields
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Get accurate yield predictions using AI-powered analysis of your soil data, weather patterns, and farming conditions.
          </p>
          
          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="gradient-card p-6 rounded-xl border border-border/50 shadow-soft">
              <Target className="w-8 h-8 text-accent mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Accurate Predictions</h3>
              <p className="text-sm text-muted-foreground">AI-powered yield forecasting based on real-time data</p>
            </div>
            <div className="gradient-card p-6 rounded-xl border border-border/50 shadow-soft">
              <TrendingUp className="w-8 h-8 text-success mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Weather Integration</h3>
              <p className="text-sm text-muted-foreground">Live weather data for precise environmental analysis</p>
            </div>
            <div className="gradient-card p-6 rounded-xl border border-border/50 shadow-soft">
              <Sprout className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Soil Analysis</h3>
              <p className="text-sm text-muted-foreground">Advanced soil data processing for optimal recommendations</p>
            </div>
          </div>
          
          {/* CTA Button */}
          <Button 
            variant="hero" 
            size="xl" 
            onClick={onGetStarted}
            className="mb-8"
          >
            Start Yield Prediction
          </Button>
          
          <p className="text-sm text-muted-foreground">
            Join thousands of farmers optimizing their harvests
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;