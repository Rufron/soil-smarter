import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import PredictionForm from "@/components/PredictionForm";
import ResultsDisplay from "@/components/ResultsDisplay";
import SubscriptionModal from "@/components/SubscriptionModal";

type AppState = "hero" | "form" | "results";

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>("hero");
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const handleGetStarted = () => {
    setCurrentState("form");
  };

  const handlePrediction = (result: any) => {
    setPredictionResult(result);
    setCurrentState("results");
  };

  const handleBackToForm = () => {
    setCurrentState("form");
  };

  const handleBackToHero = () => {
    setCurrentState("hero");
    setPredictionResult(null);
  };

  const handleSubscribe = () => {
    setShowSubscriptionModal(true);
  };

  const renderCurrentView = () => {
    switch (currentState) {
      case "hero":
        return <HeroSection onGetStarted={handleGetStarted} />;
      case "form":
        return <PredictionForm onPrediction={handlePrediction} />;
      case "results":
        return (
          <ResultsDisplay 
            result={predictionResult} 
            onBack={handleBackToForm}
            onSubscribe={handleSubscribe}
          />
        );
      default:
        return <HeroSection onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <>
      {renderCurrentView()}
      <SubscriptionModal 
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </>
  );
};

export default Index;
