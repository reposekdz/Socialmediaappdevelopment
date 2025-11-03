import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Mic, MicOff, PhoneOff, Volume2, VolumeX, UserPlus } from 'lucide-react';
import { getWebRTCInstance } from '../utils/webrtc';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';

interface RealAudioCallModalProps {
  user: any;
  currentUser: any;
  onClose: () => void;
}

export function RealAudioCallModal({ user, currentUser, onClose }: RealAudioCallModalProps) {
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const webrtcRef = useRef(getWebRTCInstance());
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    startCall();

    return () => {
      endCall();
    };
  }, []);

  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isConnected]);

  // Audio visualization
  useEffect(() => {
    if (isConnected && remoteAudioRef.current?.srcObject) {
      setupAudioVisualization();
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isConnected]);

  const setupAudioVisualization = () => {
    try {
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;

      const stream = remoteAudioRef.current?.srcObject as MediaStream;
      if (stream) {
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);

        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        
        const updateAudioLevel = () => {
          if (analyserRef.current) {
            analyserRef.current.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
            setAudioLevel(average);
            requestAnimationFrame(updateAudioLevel);
          }
        };

        updateAudioLevel();
      }
    } catch (error) {
      console.error('Audio visualization error:', error);
    }
  };

  const startCall = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      // Start the call
      const callId = await webrtcRef.current.startCall(user.id, 'audio');

      // Monitor for remote stream
      const checkRemoteStream = setInterval(() => {
        const remoteStream = webrtcRef.current.getRemoteStream();
        if (remoteStream && remoteStream.getTracks().length > 0) {
          if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = remoteStream;
            setIsConnected(true);
            setIsConnecting(false);
            clearInterval(checkRemoteStream);
            toast.success('Connected!');
          }
        }
      }, 500);

      // Stop checking after 30 seconds
      setTimeout(() => {
        clearInterval(checkRemoteStream);
        if (!isConnected) {
          setError('Connection timeout. Please try again.');
          setIsConnecting(false);
        }
      }, 30000);

    } catch (error: any) {
      console.error('Error starting call:', error);
      setError(error.message || 'Failed to start call');
      setIsConnecting(false);
      toast.error(error.message || 'Failed to start call');
    }
  };

  const endCall = async () => {
    try {
      await webrtcRef.current.endCall();
    } catch (error) {
      console.error('Error ending call:', error);
    }
    onClose();
  };

  const toggleMicrophone = () => {
    webrtcRef.current.toggleMicrophone(!isMuted);
    setIsMuted(!isMuted);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={true} onOpenChange={endCall}>
      <DialogContent className="max-w-md p-0 bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 border-0">
        <div className="relative p-8 text-white">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }} />
          </div>

          <div className="relative space-y-8">
            {/* User Avatar */}
            <div className="flex flex-col items-center">
              <motion.div
                animate={{
                  scale: isConnected && audioLevel > 50 ? [1, 1.05, 1] : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <Avatar className="w-32 h-32 border-4 border-white mb-4 shadow-2xl">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                </Avatar>
              </motion.div>
              <h2 className="text-2xl mb-2">{user.name}</h2>
              {error ? (
                <>
                  <p className="text-red-200 mb-4">{error}</p>
                  <Button 
                    onClick={startCall} 
                    variant="outline" 
                    className="border-white text-white hover:bg-white/20"
                  >
                    Try Again
                  </Button>
                </>
              ) : (
                <p className="text-white/80">
                  {isConnecting ? 'Calling...' : formatDuration(callDuration)}
                </p>
              )}
            </div>

            {/* Connection Animation */}
            {isConnecting && !error && (
              <div className="flex justify-center gap-2">
                <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}

            {/* Audio Visualizer */}
            {isConnected && !isMuted && (
              <div className="flex items-center justify-center gap-1 h-16">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-white rounded-full"
                    animate={{
                      height: [`${20 + (audioLevel / 255) * (Math.random() * 40)}px`, 
                               `${10 + (audioLevel / 255) * (Math.random() * 50)}px`,
                               `${20 + (audioLevel / 255) * (Math.random() * 40)}px`]
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: i * 0.05,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Call Controls */}
            <div className="flex items-center justify-center gap-4 pt-4">
              {/* Mute Button */}
              <Button
                variant="outline"
                size="lg"
                className={`rounded-full w-14 h-14 backdrop-blur-sm border-white/30 ${
                  isMuted 
                    ? 'bg-red-600/80 hover:bg-red-700/80' 
                    : 'bg-white/20 hover:bg-white/30'
                }`}
                onClick={toggleMicrophone}
              >
                {isMuted ? (
                  <MicOff className="w-6 h-6 text-white" />
                ) : (
                  <Mic className="w-6 h-6 text-white" />
                )}
              </Button>

              {/* End Call Button */}
              <Button
                variant="outline"
                size="lg"
                className="rounded-full w-16 h-16 bg-red-600 border-red-600 hover:bg-red-700 shadow-2xl"
                onClick={endCall}
              >
                <PhoneOff className="w-7 h-7 text-white" />
              </Button>
            </div>

            {/* Status Indicators */}
            <div className="flex items-center justify-center gap-4 text-sm text-white/80">
              {isMuted && (
                <div className="flex items-center gap-1 bg-black/30 px-3 py-1 rounded-full">
                  <MicOff className="w-4 h-4" />
                  <span>Muted</span>
                </div>
              )}
              {isConnected && (
                <div className="flex items-center gap-1 bg-black/30 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>Connected</span>
                </div>
              )}
              {isConnected && audioLevel > 30 && (
                <div className="flex items-center gap-1 bg-black/30 px-3 py-1 rounded-full">
                  <Volume2 className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">Speaking</span>
                </div>
              )}
            </div>
          </div>

          {/* Hidden audio element for remote stream */}
          <audio ref={remoteAudioRef} autoPlay />
        </div>
      </DialogContent>
    </Dialog>
  );
}
