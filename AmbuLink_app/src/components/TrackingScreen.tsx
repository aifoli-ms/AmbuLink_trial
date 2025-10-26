import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Phone, Navigation, MapPin, Clock, Volume2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Progress } from './ui/progress';
import { Card } from './ui/card';

interface TrackingScreenProps {
  onComplete: () => void;
}

export function TrackingScreen({ onComplete }: TrackingScreenProps) {
  const [eta, setEta] = useState(5);
  const [distance, setDistance] = useState(2.3);
  const [voiceUpdate, setVoiceUpdate] = useState('Ambulance is 2.3 km away');
  const [progress, setProgress] = useState(25);

  useEffect(() => {
    // Simulate ambulance getting closer
    const interval = setInterval(() => {
      setEta((prev) => {
        const newEta = Math.max(0, prev - 1);
        if (newEta === 0) {
          clearInterval(interval);
          setTimeout(onComplete, 1000);
        }
        return newEta;
      });
      
      setDistance((prev) => Math.max(0, prev - 0.4));
      setProgress((prev) => Math.min(100, prev + 15));
    }, 2000);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    // Update voice guidance
    if (eta === 2) {
      setVoiceUpdate('Ambulance turning at Legon junction');
    } else if (eta === 1) {
      setVoiceUpdate('Ambulance arriving in 1 minute');
    }
  }, [eta]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Map View */}
      <div className="relative h-[60vh] bg-gradient-to-br from-blue-100 via-green-50 to-sky-100">
        {/* Simulated Map */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full max-w-2xl">
            {/* Your location */}
            <motion.div
              className="absolute"
              style={{ top: '60%', left: '70%' }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-12 h-12 bg-blue-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <MapPin size={20} className="text-white" />
              </div>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-3 py-1 rounded-full shadow-md text-xs">
                You are here
              </div>
            </motion.div>

            {/* Ambulance location */}
            <motion.div
              className="absolute"
              style={{ top: '30%', left: '30%' }}
              animate={{
                top: ['30%', '45%', '57%'],
                left: ['30%', '50%', '68%'],
              }}
              transition={{ duration: 10, ease: "linear" }}
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="w-14 h-14 bg-red-500 rounded-lg shadow-xl flex items-center justify-center transform rotate-45"
                >
                  <div className="transform -rotate-45 text-white text-xl">🚑</div>
                </motion.div>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-red-500 text-white px-3 py-1 rounded-full shadow-md text-xs">
                  Ambulance
                </div>
              </div>
            </motion.div>

            {/* Route line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <motion.path
                d="M 30% 30% Q 45% 45%, 70% 60%"
                stroke="#3B82F6"
                strokeWidth="3"
                strokeDasharray="10,5"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2 }}
              />
            </svg>
          </div>
        </div>

        {/* ETA Badge */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-xl px-6 py-3 flex items-center space-x-3">
          <Clock className="text-green-600" size={24} />
          <div>
            <p className="text-xs text-gray-500">Arriving in</p>
            <p className="text-green-600 text-lg">{eta} minutes</p>
          </div>
        </div>
      </div>

      {/* Bottom Info Panel */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-6 shadow-2xl p-6 relative z-10">
        <div className="max-w-md mx-auto space-y-4">
          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Journey progress</span>
              <span className="text-gray-900">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Voice Update Card */}
          <Card className="bg-purple-50 border-purple-200 p-4">
            <div className="flex items-start space-x-3">
              <div className="bg-purple-500 rounded-full p-2">
                <Volume2 size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-purple-600 mb-1">Live voice guidance</p>
                <p className="text-sm text-purple-900">{voiceUpdate}</p>
              </div>
            </div>
          </Card>

          {/* Driver Info */}
          <Card className="p-4 border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1">Kwame Mensah</p>
                <p className="text-xs text-gray-500">Paramedic • Unit AMB-324</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Distance</p>
                <p className="text-sm">{distance.toFixed(1)} km</p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <Button
              onClick={() => window.open('tel:0302772813', '_self')}
              className="w-full h-14 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center space-x-2"
            >
              <Phone size={20} />
              <span>Call Ambulance Crew</span>
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 flex items-center justify-center space-x-2"
            >
              <Navigation size={18} />
              <span>Send Updated Location</span>
            </Button>
          </div>

          <p className="text-center text-xs text-gray-500 pt-4">
            Stay where you are. The crew knows your location.
          </p>
        </div>
      </div>
    </div>
  );
}
