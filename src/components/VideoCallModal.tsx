import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  Monitor, 
  MoreVertical,
  Users,
  MessageSquare,
  Grid3x3,
  Maximize
} from 'lucide-react';

interface VideoCallModalProps {
  user: any;
  currentUser: any;
  onClose: () => void;
}

export function VideoCallModal({ user, currentUser, onClose }: VideoCallModalProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);

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
      <DialogContent className="max-w-6xl h-[90vh] p-0 bg-gray-900 border-0">
        <div className="relative h-full flex flex-col">
          {/* Video Area */}
          <div className="flex-1 relative bg-gray-800">
            {!isConnected ? (
              /* Connecting State */
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <Avatar className="w-32 h-32 mb-6 border-4 border-white">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <p className="text-xl mb-2">{user.name}</p>
                <p className="text-gray-400">Calling...</p>
                <div className="flex gap-2 mt-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            ) : (
              /* Connected State */
              <>
                {/* Remote Video */}
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900">
                  {isVideoOff ? (
                    <div className="text-center text-white">
                      <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-white">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <p className="text-xl">{user.name}</p>
                    </div>
                  ) : (
                    <div className="text-white text-center">
                      <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-white">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <p className="text-sm text-gray-300">[Simulated Video Feed]</p>
                    </div>
                  )}
                </div>

                {/* Local Video (Picture-in-Picture) */}
                <div className="absolute top-4 right-4 w-48 h-36 bg-gray-700 rounded-lg overflow-hidden border-2 border-white/20">
                  {isVideoOff ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Avatar className="w-16 h-16 border-2 border-white">
                        <AvatarImage src={currentUser.avatar} />
                        <AvatarFallback>{currentUser.fullName[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
                      <Avatar className="w-16 h-16 border-2 border-white">
                        <AvatarImage src={currentUser.avatar} />
                        <AvatarFallback>{currentUser.fullName[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 right-2 text-white text-xs text-center">
                    You
                  </div>
                </div>

                {/* Call Info */}
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
                  <p className="text-sm">{user.name}</p>
                  <p className="text-xs text-gray-300">{formatDuration(callDuration)}</p>
                </div>
              </>
            )}
          </div>

          {/* Controls */}
          <div className="p-6 bg-gray-900">
            <div className="flex items-center justify-center gap-4">
              {/* Mute Button */}
              <Button
                variant="outline"
                size="lg"
                className={`rounded-full w-14 h-14 ${isMuted ? 'bg-red-600 border-red-600 hover:bg-red-700' : 'bg-gray-700 border-gray-700 hover:bg-gray-600'}`}
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? (
                  <MicOff className="w-6 h-6 text-white" />
                ) : (
                  <Mic className="w-6 h-6 text-white" />
                )}
              </Button>

              {/* Video Button */}
              <Button
                variant="outline"
                size="lg"
                className={`rounded-full w-14 h-14 ${isVideoOff ? 'bg-red-600 border-red-600 hover:bg-red-700' : 'bg-gray-700 border-gray-700 hover:bg-gray-600'}`}
                onClick={() => setIsVideoOff(!isVideoOff)}
              >
                {isVideoOff ? (
                  <VideoOff className="w-6 h-6 text-white" />
                ) : (
                  <Video className="w-6 h-6 text-white" />
                )}
              </Button>

              {/* Screen Share Button */}
              <Button
                variant="outline"
                size="lg"
                className={`rounded-full w-14 h-14 ${isScreenSharing ? 'bg-blue-600 border-blue-600' : 'bg-gray-700 border-gray-700 hover:bg-gray-600'}`}
                onClick={() => setIsScreenSharing(!isScreenSharing)}
              >
                <Monitor className="w-6 h-6 text-white" />
              </Button>

              {/* End Call Button */}
              <Button
                variant="outline"
                size="lg"
                className="rounded-full w-14 h-14 bg-red-600 border-red-600 hover:bg-red-700"
                onClick={onClose}
              >
                <PhoneOff className="w-6 h-6 text-white" />
              </Button>

              {/* Chat Button */}
              <Button
                variant="outline"
                size="lg"
                className={`rounded-full w-14 h-14 ${showChat ? 'bg-blue-600 border-blue-600' : 'bg-gray-700 border-gray-700 hover:bg-gray-600'}`}
                onClick={() => setShowChat(!showChat)}
              >
                <MessageSquare className="w-6 h-6 text-white" />
              </Button>

              {/* Grid View Button */}
              <Button
                variant="outline"
                size="lg"
                className="rounded-full w-14 h-14 bg-gray-700 border-gray-700 hover:bg-gray-600"
              >
                <Grid3x3 className="w-6 h-6 text-white" />
              </Button>

              {/* More Options */}
              <Button
                variant="outline"
                size="lg"
                className="rounded-full w-14 h-14 bg-gray-700 border-gray-700 hover:bg-gray-600"
              >
                <MoreVertical className="w-6 h-6 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
