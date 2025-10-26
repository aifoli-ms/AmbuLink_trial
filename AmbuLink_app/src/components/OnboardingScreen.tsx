import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Heart, MapPin, Mic, Shield } from 'lucide-react';
import { useState } from 'react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [gpsConsent, setGpsConsent] = useState(false);
  const [voiceConsent, setVoiceConsent] = useState(false);

  const steps = [
    {
      icon: Heart,
      title: "Welcome to AmbuLink",
      description: "Get emergency ambulance help in seconds. Simple, fast, reliable.",
      color: "text-sky-500"
    },
    {
      icon: MapPin,
      title: "We need your location",
      description: "To send the nearest ambulance to you quickly and accurately.",
      color: "text-green-500",
      consent: 'gps'
    },
    {
      icon: Mic,
      title: "Voice assistance (optional)",
      description: "Describe your emergency by voice. We'll understand and help faster.",
      color: "text-purple-500",
      consent: 'voice'
    }
  ];

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const canProceed = () => {
    if (currentStep === 1) return gpsConsent;
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex flex-col items-center justify-between p-6">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center text-center"
        >
          <div className={`${currentStepData.color} mb-8`}>
            <currentStepData.icon size={80} strokeWidth={1.5} />
          </div>

          <h1 className="mb-4">{currentStepData.title}</h1>
          <p className="text-gray-600 mb-8 max-w-sm">
            {currentStepData.description}
          </p>

          {currentStepData.consent === 'gps' && (
            <div className="flex items-start space-x-3 mb-6 bg-white p-4 rounded-lg shadow-sm border border-sky-100">
              <Checkbox
                id="gps-consent"
                checked={gpsConsent}
                onCheckedChange={(checked) => setGpsConsent(checked as boolean)}
              />
              <label htmlFor="gps-consent" className="text-sm text-gray-700 cursor-pointer">
                I allow AmbuLink to access my location for emergency services
              </label>
            </div>
          )}

          {currentStepData.consent === 'voice' && (
            <div className="flex items-start space-x-3 mb-6 bg-white p-4 rounded-lg shadow-sm border border-purple-100">
              <Checkbox
                id="voice-consent"
                checked={voiceConsent}
                onCheckedChange={(checked) => setVoiceConsent(checked as boolean)}
              />
              <label htmlFor="voice-consent" className="text-sm text-gray-700 cursor-pointer">
                I allow AmbuLink to use voice recognition (optional)
              </label>
            </div>
          )}
        </motion.div>
      </div>

      <div className="w-full max-w-md space-y-4">
        <div className="flex justify-center space-x-2 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? 'w-8 bg-sky-500'
                  : index < currentStep
                  ? 'w-2 bg-sky-300'
                  : 'w-2 bg-gray-200'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="w-full h-14 bg-sky-500 hover:bg-sky-600 text-white"
        >
          {currentStep === steps.length - 1 ? "Get Started" : "Continue"}
        </Button>

        {currentStep > 0 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="w-full text-gray-500 hover:text-gray-700"
          >
            Back
          </button>
        )}
      </div>

      <div className="mt-6 flex items-center text-xs text-gray-500">
        <Shield size={14} className="mr-1" />
        Your privacy is protected. Data is encrypted.
      </div>
    </div>
  );
}
