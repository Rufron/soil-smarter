import { useState } from "react";
import { Button } from "@/components/ui/enhanced-button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, MessageSquare, FileText, TrendingUp, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionModal = ({ isOpen, onClose }: SubscriptionModalProps) => {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "premium">("premium");

  const handleSubscribe = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan: selectedPlan },
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Payment Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const plans = [
    {
      id: "basic",
      name: "Basic Plan",
      price: "KSh 500",
      period: "/month",
      description: "Essential features for small-scale farmers",
      features: [
        "5 yield predictions per month",
        "Basic weather integration",
        "Email notifications",
        "Standard support"
      ],
      badge: null,
      buttonVariant: "outline" as const
    },
    {
      id: "premium",
      name: "Premium Plan",
      price: "KSh 1,200",
      period: "/month",
      description: "Advanced features for professional farming",
      features: [
        "Unlimited yield predictions",
        "Advanced weather forecasting",
        "SMS alerts & notifications",
        "Downloadable detailed reports",
        "Monthly yield forecasts",
        "Priority support",
        "Fertilizer recommendations",
        "Irrigation planning"
      ],
      badge: "Most Popular",
      buttonVariant: "success" as const
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-success/10 border border-success/20">
              <Crown className="w-6 h-6 text-success" />
            </div>
          </div>
          <DialogTitle className="text-3xl font-bold text-primary">
            Choose Your Plan
          </DialogTitle>
          <DialogDescription className="text-lg">
            Unlock premium features to maximize your farming success
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative cursor-pointer transition-smooth shadow-medium border-2 ${
                selectedPlan === plan.id 
                  ? "border-success shadow-strong" 
                  : "border-border/50 hover:border-success/50"
              } ${plan.badge ? "gradient-card" : ""}`}
              onClick={() => setSelectedPlan(plan.id as "basic" | "premium")}
            >
              {plan.badge && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-success text-success-foreground">
                  {plan.badge}
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="flex items-baseline justify-center gap-1 mt-4">
                  <span className="text-3xl font-bold text-primary">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment Integration Notice */}
        <Card className="mt-6 border-warning/20 bg-warning/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-warning mt-0.5" />
              <div>
                <h4 className="font-semibold mb-2 text-warning">Backend Integration Required</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  To enable secure payments with IntaSend and store subscription data, you'll need to connect this app to Supabase first.
                </p>
                <p className="text-sm font-medium">
                  Features that require backend integration:
                </p>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                  <li>• Secure payment processing with IntaSend</li>
                  <li>• User account management and subscription tracking</li>
                  <li>• Prediction history storage</li>
                  <li>• SMS notifications and alerts</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button 
            variant={plans.find(p => p.id === selectedPlan)?.buttonVariant || "default"}
            onClick={handleSubscribe} 
            className="flex-1"
          >
            <Crown className="w-4 h-4 mr-2" />
            Subscribe to {plans.find(p => p.id === selectedPlan)?.name}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionModal;