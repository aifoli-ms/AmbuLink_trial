import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Phone, Share2, MapPin, Clock, User, CheckCircle } from 'lucide-react';
import { Card } from './ui/card';

interface ConfirmationScreenProps {
  onTrack: () => void;
}

export function ConfirmationScreen({ onTrack }: ConfirmationScreenProps) {
  const handleShareLocation = () => {
    // Simulate WhatsApp share
    const message = encodeURIComponent("AmbuLink Emergency: I need an ambulance at Accra Mall, East Legon. Track me: https://maps.google.com/?q=5.6037,0.1870");
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col p-6">
      <div className="flex-1 flex flex-col items-center max-w-md w-full mx-auto">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="mb-6"
        >
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle size={56} className="text-white" strokeWidth={2} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="mb-2">Ambulance Confirmed</h1>
          <p className="text-gray-600">Help is on the way. Stay calm.</p>
        </motion.div>

        {/* Ambulance Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full space-y-4 mb-8"
        >
          <Card className="p-5 border-green-200 bg-white shadow-lg">
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <Clock className="text-green-600 flex-shrink-0 mt-1" size={20} />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Estimated arrival</p>
                  <p className="text-green-600">5-7 minutes</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-start space-x-4">
                  <User className="text-gray-600 flex-shrink-0 mt-1" size={20} />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Ambulance crew</p>
                    <p className="">Kwame Mensah (Paramedic)</p>
                    <p className="text-sm text-gray-600">Unit: AMB-324</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-start space-x-4">
                  <MapPin className="text-gray-600 flex-shrink-0 mt-1" size={20} />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Your location</p>
                    <p className="text-sm">Accra Mall, East Legon, Accra</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Important Notice */}
          <Card className="p-4 bg-sky-50 border-sky-200">
            <p className="text-sm text-sky-900">
              <strong>What to do now:</strong> Stay at your location. The ambulance crew can see where you are and will call if needed.
            </p>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full space-y-3"
        >
          <Button
            onClick={onTrack}
            className="w-full h-14 bg-green-600 hover:bg-green-700 text-white"
          >
            Track Ambulance Live
          </Button>

          <Button
            onClick={() => window.open('tel:0242402183', '_self')}
            variant="outline"
            className="w-full h-12 border-green-600 text-green-600 hover:bg-green-50 flex items-center justify-center space-x-2"
          >
            <Phone size={18} />
            <span>Call Ambulance Crew</span>
          </Button>

          <Button
            onClick={handleShareLocation}
            variant="outline"
            className="w-full h-12 flex items-center justify-center space-x-2"
          >
            <Share2 size={18} />
            <span>Share Location via WhatsApp</span>
          </Button>
        </motion.div>
      </div>

      <p className="text-center text-xs text-gray-500 mt-6">
        Emergency ID: AMB-20251025-0342
      </p>
    </div>
  );
}
