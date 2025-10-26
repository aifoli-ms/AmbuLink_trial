  /**
   * Handles the audio upload and transcript polling.
   * This function is designed to work with the server's
   * /upload-audio and /transcripts/find/:prefix endpoints.
   */
  import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Mic, Check, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Textarea } from './ui/textarea';

interface VoiceInputScreenProps {
  onConfirm: () => void;
  onBack: () => void;
}

export function VoiceInputScreen({ onConfirm, onBack }: VoiceInputScreenProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedInfo, setDetectedInfo] = useState<{
    urgency: string;
    location: string;
    condition: string;
  } | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    // Clean up if component unmounts while recording
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startBrowserRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = 'audio/webm';
      const mediaRecorder = new MediaRecorder(stream, { mimeType });

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e: BlobEvent) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        await uploadAudio(blob);
        // stop all tracks
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
    } catch (err) {
      console.error('Microphone access denied or not available', err);
      setIsListening(false);
    }
  };

  const stopBrowserRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const uploadAudio = async (blob: Blob) => {
    // 1. Set processing state
    setIsProcessing(true);
    
    try {
      // 2. Prepare and send the audio file
      const fd = new FormData();
      fd.append('file', blob, 'voice.webm');

      const res = await fetch('http://localhost:3001/upload-audio', {
        method: 'POST',
        body: fd,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      // Set a temporary message while processing
      setTranscription(`Uploaded: ${data.filename}. Processing...`);

      // 3. Get the unique prefix from the server's response
      const prefix = data.filename ? String(data.filename).split('_')[0] : null;
      
      if (prefix) {
        // 4. Start polling for the specific transcript file
        const pollForTranscript = async (attempts = 0) => {
          try {
            // --- THIS IS THE KEY CHANGE ---
            // Poll the new, specific endpoint using the prefix
            const tRes = await fetch(`http://localhost:3001/transcripts/find/${prefix}`);
            
            if (tRes.ok) {
              // Status 200 OK: File was found!
              const tData = await tRes.json();
              // Set the transcript text on the page
              setTranscription(tData.transcript || 'Transcript loaded.');
              
              // (Optional) Simulate AI detection after transcript is loaded
              setTimeout(() => {
                setDetectedInfo({
                  urgency: 'High',
                  location: 'Accra Mall, East Legon',
                  condition: 'Unconscious person',
                });
                setIsProcessing(false);
              }, 500);
              
              return; // Stop polling
            }
            
            // If tRes.ok is false (e.g., 404 Not Found), it means the
            // file isn't ready yet. The code will skip the 'catch'
            // and hit the retry logic below.

          } catch (e) {
            // This catches network errors (e.g., server is down)
            console.warn('Polling network error:', e);
          }

          // 5. Retry logic
          if (attempts < 60) { // Poll for 60 seconds
            // Wait 1 second and try again
            setTimeout(() => pollForTranscript(attempts + 1), 1000);
          } else {
            // Give up after 60 seconds
            console.warn('Transcript not found after 60 seconds.');
            setTranscription('Processing timed out. Please try again.');
            setIsProcessing(false);
          }
        };

        // Start the polling process
        pollForTranscript();

      } else {
        // This case should not happen if upload was successful
        console.error('Could not extract prefix from upload response.');
        setIsProcessing(false);
      }

    } catch (err) {
      console.error('Upload error', err);
      setTranscription('Upload failed.');
      setIsProcessing(false);
    }

    // --- DELETING FROM HERE ---
    // This code was moved *inside* the pollForTranscript
    // success block, so it's redundant here and causes an error.
    /*
      // TODO: send the uploaded file to your speech-to-text AI or run processing
      // Simulate AI processing and detection after successful upload
      setTimeout(() => {
        setDetectedInfo({
          urgency: 'High',
          location: 'Accra Mall, East Legon',
          condition: 'Unconscious person',
        });
        setIsProcessing(false);
      }, 1000);
    } catch (err) { // This 'catch' doesn't have a 'try'
      console.error('Upload error', err);
      setIsProcessing(false);
    }
    */
    // --- DELETING TO HERE ---
  };

  const handleToggleListen = async () => {
    if (!isListening) {
      // start
      setIsListening(true);
      setTranscription('');
      setDetectedInfo(null);
      await startBrowserRecording();
    } else {
      // stop
      setIsListening(false);
      stopBrowserRecording();
    }
  };

  const handleReset = () => {
    setTranscription('');
    setDetectedInfo(null);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col p-6">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full mx-auto">
        <h2 className="mb-2 text-center">Describe the Emergency</h2>
        <p className="text-sm text-gray-600 mb-8 text-center">
          Speak clearly. Our AI will understand and help.
        </p>

        {/* Microphone Button */}
        <div className="mb-8">
          <motion.button
            onClick={handleToggleListen}
            disabled={isProcessing || !!detectedInfo}
            className={`relative w-48 h-48 rounded-full flex items-center justify-center text-white transition-all ${
              isListening
                ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-2xl'
                : detectedInfo
                ? 'bg-gradient-to-br from-green-500 to-green-600'
                : 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg'
            }`}
            animate={{
              scale: isListening ? [1, 1.05, 1] : 1,
            }}
            transition={{
              duration: 1.5,
              repeat: isListening ? Infinity : 0,
              ease: 'easeInOut',
            }}
          >
            {/* Pulse animation when listening */}
            {isListening && (
              <motion.div
                className="absolute inset-0 rounded-full bg-red-400"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 0, 0.6],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            )}

            {isProcessing ? (
              <Loader2 size={64} className="animate-spin" />
            ) : detectedInfo ? (
              <Check size={64} strokeWidth={2.5} />
            ) : isListening ? (
              <Mic size={64} strokeWidth={2} className="relative z-10" />
            ) : (
              <Mic size={64} strokeWidth={2} />
            )}
          </motion.button>

          <p className="text-center mt-4 text-sm">
            {isListening ? (
              <span className="text-red-600">Listening...</span>
            ) : isProcessing ? (
              <span className="text-purple-600">Processing your request...</span>
            ) : detectedInfo ? (
              <span className="text-green-600">Information captured</span>
            ) : (
              <span className="text-gray-600">Tap to speak</span>
            )}
          </p>
        </div>

        {/* Transcription Display */}
        {transcription && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mb-6"
          >
            <label className="text-sm text-gray-600 mb-2 block">What we heard:</label>
            <Textarea
              value={transcription}
              onChange={(e) => setTranscription(e.target.value)}
              className="w-full min-h-24 border-purple-200 focus:border-purple-400"
              placeholder="Your transcription will appear here..."
            />
          </motion.div>
        )}

        {/* AI Detected Information */}
        {detectedInfo && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
          >
            <p className="text-sm text-green-800 mb-3">AI detected:</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Urgency:</span>
                <span className="text-sm text-red-600">{detectedInfo.urgency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Location:</span>
                <span className="text-sm">{detectedInfo.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Condition:</span>
                <span className="text-sm">{detectedInfo.condition}</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-md mx-auto space-y-3">
        {detectedInfo ? (
          <>
            <Button
              onClick={onConfirm}
              className="w-full h-14 bg-green-600 hover:bg-green-700 text-white"
            >
              Confirm & Request Ambulance
            </Button>
            <Button onClick={handleReset} variant="outline" className="w-full h-12">
              Record Again
            </Button>
          </>
        ) : (
          <Button onClick={onBack} variant="outline" className="w-full h-12">
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
