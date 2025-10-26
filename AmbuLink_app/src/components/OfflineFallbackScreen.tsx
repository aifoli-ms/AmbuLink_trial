import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Phone, MessageSquare, WifiOff, MapPin, Copy, Check } from 'lucide-react';
import { Card } from './ui/card';
import { useState } from 'react';
import { Textarea } from './ui/textarea';

interface OfflineFallbackScreenProps {
  onBack: () => void;
}

export function OfflineFallbackScreen({ onBack }: OfflineFallbackScreenProps) {
  const [location, setLocation] = useState('Accra Mall, East Legon, Accra');
  const [copied, setCopied] = useState(false);

  const emergencyNumber = '0302772813';
  const smsMessage = `AMBULANCE NEEDED\nLocation: ${location}\nRequester: AmbuLink App\nTime: ${new Date().toLocaleTimeString()}`;

  const handleCopyLocation = () => {
    navigator.clipboard.writeText(location);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendSMS = () => {
    const encodedMessage = encodeURIComponent(smsMessage);
    window.open(`sms:${emergencyNumber}?body=${encodedMessage}`, '_self');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col p-6">
      <div className="flex-1 flex flex-col items-center max-w-md w-full mx-auto">
        {/* Offline Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="mb-6 mt-8"
        >
          <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center">
            <WifiOff size={56} className="text-white" strokeWidth={2} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="mb-2">No Internet Connection</h2>
          <p className="text-gray-600 max-w-sm">
            Don't worry. You can still get help using phone calls or SMS.
          </p>
        </motion.div>

        {/* Location Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full mb-6"
        >
          <Card className="p-4 bg-white border-orange-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-2">
                <MapPin className="text-orange-500 flex-shrink-0 mt-1" size={18} />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Your saved location</p>
                  <p className="text-sm">{location}</p>
                </div>
              </div>
              <button
                onClick={handleCopyLocation}
                className="text-orange-500 hover:text-orange-600 flex-shrink-0"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
            {copied && (
              <p className="text-xs text-green-600">Location copied!</p>
            )}
          </Card>
        </motion.div>

        {/* SMS Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full mb-6"
        >
          <label className="text-sm text-gray-600 mb-2 block">SMS message to send:</label>
          <Textarea
            value={smsMessage}
            readOnly
            className="w-full min-h-32 bg-gray-50 border-gray-200 text-sm"
          />
        </motion.div>

        {/* Emergency Instructions */}
        <Card className="w-full p-4 bg-sky-50 border-sky-200 mb-8">
          <p className="text-sm text-sky-900 mb-3">
            <strong>How to get help offline:</strong>
          </p>
          <ol className="text-sm text-sky-800 space-y-2 list-decimal list-inside">
            <li>Call the emergency number below</li>
            <li>Or send the pre-filled SMS</li>
            <li>Clearly state your location when speaking</li>
            <li>Stay where you are until help arrives</li>
          </ol>
        </Card>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full space-y-3"
        >
          <Button
            onClick={() => window.open(`tel:${emergencyNumber}`, '_self')}
            className="w-full h-16 bg-red-600 hover:bg-red-700 text-white flex flex-col items-center justify-center"
          >
            <Phone size={24} className="mb-1" />
            <span className="text-lg">Call {emergencyNumber}</span>
            <span className="text-xs text-red-100">Emergency Ambulance Line</span>
          </Button>

          <Button
            onClick={handleSendSMS}
            variant="outline"
            className="w-full h-14 border-orange-500 text-orange-600 hover:bg-orange-50 flex items-center justify-center space-x-2"
          >
            <MessageSquare size={20} />
            <span>Send Emergency SMS</span>
          </Button>

          <Button
            onClick={onBack}
            variant="ghost"
            className="w-full h-12"
          >
            Back to Main Screen
          </Button>
        </motion.div>
      </div>

      <p className="text-center text-xs text-gray-500 mt-6">
        Works without internet • No data required
      </p>
    </div>
  );
}
