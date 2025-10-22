import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Mic, MicOff, PhoneOff, Volume2, VolumeX, MoreVertical, UserPlus } from 'lucide-react';

interface AudioCallModalProps {
  user: any;
  currentUser: any;
  onClose: () => void;
}

export function AudioCallModal({ user, currentUser, onClose }: AudioCallModalProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    // Simulate connection
    const connectTimer = setTimeout(() => {
      setIsConnected(true);
    }, 2000);

    return () => clearTimeout(connectTimer);
  }, []);

  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isConnected]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
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
              <Avatar className="w-32 h-32 border-4 border-white mb-4">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl">{user.name}</h2>
              <p className="text-white/80">
                {isConnected ? formatDuration(callDuration) : 'Calling...'}
              </p>
            </div>

            {/* Connection Animation */}
            {!isConnected && (
              <div className="flex justify-center gap-2">
                <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}

            {/* Audio Visualizer (Simulated) */}
            {isConnected && !isMuted && (
              <div className="flex items-center justify-center gap-1 h-16">
                {[...Array(15)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-white rounded-full animate-pulse"
                    style={{
                      height: `${Math.random() * 60 + 10}%`,
                      animationDelay: `${i * 50}ms`,
                      animationDuration: `${Math.random() * 500 + 500}ms`
                    }}
                  />
                ))}
              </div>
            )}

            {/* Call Controls */}
            <div className="flex items-center justify-center gap-4 pt-4">
              {/* Add Participant */}
              <Button
                variant="outline"
                size="lg"
                className="rounded-full w-14 h-14 bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30"
              >
                <UserPlus className="w-6 h-6 text-white" />
              </Button>

              {/* Mute Button */}
              <Button
                variant="outline"
                size="lg"
                className={`rounded-full w-14 h-14 backdrop-blur-sm border-white/30 ${
                  isMuted 
                    ? 'bg-red-600/80 hover:bg-red-700/80' 
                    : 'bg-white/20 hover:bg-white/30'
                }`}
                onClick={() => setIsMuted(!isMuted)}
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
                className="rounded-full w-16 h-16 bg-red-600 border-red-600 hover:bg-red-700"
                onClick={onClose}
              >
                <PhoneOff className="w-7 h-7 text-white" />
              </Button>

              {/* Speaker Button */}
              <Button
                variant="outline"
                size="lg"
                className={`rounded-full w-14 h-14 backdrop-blur-sm border-white/30 ${
                  !isSpeakerOn 
                    ? 'bg-red-600/80 hover:bg-red-700/80' 
                    : 'bg-white/20 hover:bg-white/30'
                }`}
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              >
                {isSpeakerOn ? (
                  <Volume2 className="w-6 h-6 text-white" />
                ) : (
                  <VolumeX className="w-6 h-6 text-white" />
                )}
              </Button>

              {/* More Options */}
              <Button
                variant="outline"
                size="lg"
                className="rounded-full w-14 h-14 bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30"
              >
                <MoreVertical className="w-6 h-6 text-white" />
              </Button>
            </div>

            {/* Status Indicators */}
            <div className="flex items-center justify-center gap-4 text-sm text-white/80">
              {isMuted && (
                <div className="flex items-center gap-1">
                  <MicOff className="w-4 h-4" />
                  <span>Muted</span>
                </div>
              )}
              {!isSpeakerOn && (
                <div className="flex items-center gap-1">
                  <VolumeX className="w-4 h-4" />
                  <span>Speaker Off</span>
                </div>
              )}
              {isConnected && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>Connected</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
