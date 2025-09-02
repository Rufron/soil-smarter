import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { Crown, Lock, Zap } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

interface PremiumFeatureGateProps {
  children: ReactNode;
  feature: string;
  description?: string;
  onUpgrade?: () => void;
  fallback?: ReactNode;
}

export const PremiumFeatureGate = ({ 
  children, 
  feature, 
  description, 
  onUpgrade,
  fallback 
}: PremiumFeatureGateProps) => {
  const { isPremium, loading } = useSubscription();

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-muted rounded-lg"></div>
      </div>
    );
  }

  if (isPremium) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Card className="border-dashed border-2 border-muted-foreground/25 bg-muted/10">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-3">
          <div className="p-3 rounded-full bg-warning/10 border border-warning/20">
            <Lock className="w-6 h-6 text-warning" />
          </div>
        </div>
        <CardTitle className="text-lg flex items-center justify-center gap-2">
          <Crown className="w-5 h-5 text-primary" />
          Premium Feature: {feature}
        </CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="text-center">
        <Badge variant="outline" className="mb-4 border-warning/50 text-warning">
          <Zap className="w-3 h-3 mr-1" />
          Requires Premium Plan
        </Badge>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Upgrade to Premium to unlock this feature and get unlimited access to advanced farming tools.
          </p>
          <Button 
            onClick={onUpgrade}
            className="mt-4"
            variant="default"
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Premium
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};