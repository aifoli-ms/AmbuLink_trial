import { useState } from 'react';
import { OnboardingScreen } from './components/OnboardingScreen';
import { EmergencyRequestScreen } from './components/EmergencyRequestScreen';
import { VoiceInputScreen } from './components/VoiceInputScreen';
import { ConfirmationScreen } from './components/ConfirmationScreen';
import { TrackingScreen } from './components/TrackingScreen';
import { OfflineFallbackScreen } from './components/OfflineFallbackScreen';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';

type Screen = 
  | 'onboarding' 
  | 'emergency-request' 
  | 'voice-input' 
  | 'confirmation' 
  | 'tracking' 
  | 'offline'
  | 'complete';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');

  const handleOnboardingComplete = () => {
    setCurrentScreen('emergency-request');
  };

  const handleRequestAmbulance = () => {
    toast.success('Processing your emergency request...');
    setTimeout(() => {
      setCurrentScreen('confirmation');
    }, 1000);
  };

  const handleVoiceInput = () => {
    setCurrentScreen('voice-input');
  };

  const handleVoiceConfirm = () => {
    toast.success('Emergency details confirmed');
    setTimeout(() => {
      setCurrentScreen('confirmation');
    }, 800);
  };

  const handleTrackAmbulance = () => {
    setCurrentScreen('tracking');
  };

  const handleOfflineMode = () => {
    setCurrentScreen('offline');
  };

  const handleBackToMain = () => {
    setCurrentScreen('emergency-request');
  };

  const handleTrackingComplete = () => {
    setCurrentScreen('complete');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile container */}
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl relative">
        {currentScreen === 'onboarding' && (
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        )}

        {currentScreen === 'emergency-request' && (
          <EmergencyRequestScreen
            onRequestAmbulance={handleRequestAmbulance}
            onVoiceInput={handleVoiceInput}
            onOfflineMode={handleOfflineMode}
          />
        )}

        {currentScreen === 'voice-input' && (
          <VoiceInputScreen
            onConfirm={handleVoiceConfirm}
            onBack={handleBackToMain}
          />
        )}

        {currentScreen === 'confirmation' && (
          <ConfirmationScreen onTrack={handleTrackAmbulance} />
        )}

        {currentScreen === 'tracking' && (
          <TrackingScreen onComplete={handleTrackingComplete} />
        )}

        {currentScreen === 'offline' && (
          <OfflineFallbackScreen onBack={handleBackToMain} />
        )}

        {currentScreen === 'complete' && (
          <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center justify-center p-6">
            <div className="text-center max-w-md">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">✓</span>
              </div>
              <h1 className="mb-4">Ambulance Arrived</h1>
              <p className="text-gray-600 mb-8">
                You're in safe hands now. The paramedics will take care of you.
              </p>
              <button
                onClick={() => setCurrentScreen('emergency-request')}
                className="text-sky-600 hover:text-sky-700"
              >
                Return to Home
              </button>
            </div>
          </div>
        )}
      </div>

      <Toaster position="top-center" />
    </div>
  );
}
