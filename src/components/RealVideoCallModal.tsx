import { useState, useEffect, useRef } from 'react';
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
  MessageSquare,
  Grid3x3,
  MonitorOff
} from 'lucide-react';
import { getWebRTCInstance } from '../utils/webrtc';
import { toast } from 'sonner@2.0.3';

interface RealVideoCallModalProps {
  user: any;
  currentUser: any;
  onClose: () => void;
}

export function RealVideoCallModal({ user, currentUser, onClose }: RealVideoCallModalProps) {
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const webrtcRef = useRef(getWebRTCInstance());

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

  const startCall = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      // Start the call
      const callId = await webrtcRef.current.startCall(user.id, 'video');
      
      // Set up local video
      const localStream = webrtcRef.current.getLocalStream();
      if (localVideoRef.current && localStream) {
        localVideoRef.current.srcObject = localStream;
      }

      // Monitor for remote stream
      const checkRemoteStream = setInterval(() => {
        const remoteStream = webrtcRef.current.getRemoteStream();
        if (remoteStream && remoteStream.getTracks().length > 0) {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
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

  const toggleCamera = () => {
    webrtcRef.current.toggleCamera(!isVideoOff);
    setIsVideoOff(!isVideoOff);
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            cursor: 'always'
          },
          audio: false
        });
        
        // Replace video track
        const videoTrack = stream.getVideoTracks()[0];
        const sender = webrtcRef.current['peerConnection']
          ?.getSenders()
          .find(s => s.track?.kind === 'video');
        
        if (sender) {
          sender.replaceTrack(videoTrack);
          setIsScreenSharing(true);
          toast.success('Screen sharing started');

          videoTrack.onended = () => {
            setIsScreenSharing(false);
            // Switch back to camera
            const localStream = webrtcRef.current.getLocalStream();
            if (localStream) {
              const cameraTrack = localStream.getVideoTracks()[0];
              if (sender && cameraTrack) {
                sender.replaceTrack(cameraTrack);
              }
            }
          };
        }
      } catch (error) {
        console.error('Screen share error:', error);
        toast.error('Failed to share screen');
      }
    } else {
      // Stop screen sharing
      const localStream = webrtcRef.current.getLocalStream();
      if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        const sender = webrtcRef.current['peerConnection']
          ?.getSenders()
          .find(s => s.track?.kind === 'video');
        
        if (sender && videoTrack) {
          sender.replaceTrack(videoTrack);
        }
      }
      setIsScreenSharing(false);
      toast.success('Screen sharing stopped');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={true} onOpenChange={endCall}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 bg-gray-900 border-0">
        <div className="relative h-full flex flex-col">
          {/* Video Area */}
          <div className="flex-1 relative bg-gray-800">
            {isConnecting || error ? (
              /* Connecting/Error State */
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <Avatar className="w-32 h-32 mb-6 border-4 border-white">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                </Avatar>
                <p className="text-xl mb-2">{user.name}</p>
                {error ? (
                  <>
                    <p className="text-red-400 mb-4">{error}</p>
                    <Button onClick={startCall} variant="outline" className="text-white border-white">
                      Try Again
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-400 mb-4">Connecting...</p>
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Connected State */
              <>
                {/* Remote Video */}
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover bg-gray-900"
                />

                {/* Local Video (Picture-in-Picture) */}
                <div className="absolute top-4 right-4 w-48 h-36 bg-gray-700 rounded-lg overflow-hidden border-2 border-white/20 shadow-xl">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover mirror"
                  />
                  {isVideoOff && (
                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                      <Avatar className="w-16 h-16 border-2 border-white">
                        <AvatarImage src={currentUser.avatar} />
                        <AvatarFallback>{currentUser.name?.[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 right-2 text-white text-xs text-center bg-black/50 rounded px-2 py-1">
                    You
                  </div>
                </div>

                {/* Call Info */}
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
                  <p className="text-sm">{user.name}</p>
                  <p className="text-xs text-gray-300">{formatDuration(callDuration)}</p>
                </div>

                {/* Connection Quality Indicator */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Connected
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
                onClick={toggleMicrophone}
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
                onClick={toggleCamera}
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
                onClick={toggleScreenShare}
              >
                {isScreenSharing ? (
                  <MonitorOff className="w-6 h-6 text-white" />
                ) : (
                  <Monitor className="w-6 h-6 text-white" />
                )}
              </Button>

              {/* End Call Button */}
              <Button
                variant="outline"
                size="lg"
                className="rounded-full w-16 h-16 bg-red-600 border-red-600 hover:bg-red-700"
                onClick={endCall}
              >
                <PhoneOff className="w-7 h-7 text-white" />
              </Button>

              {/* Chat Button */}
              <Button
                variant="outline"
                size="lg"
                className="rounded-full w-14 h-14 bg-gray-700 border-gray-700 hover:bg-gray-600"
              >
                <MessageSquare className="w-6 h-6 text-white" />
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

            {/* Status Indicators */}
            <div className="flex items-center justify-center gap-4 mt-4 text-sm text-white/60">
              {isMuted && (
                <div className="flex items-center gap-1">
                  <MicOff className="w-4 h-4" />
                  <span>Muted</span>
                </div>
              )}
              {isVideoOff && (
                <div className="flex items-center gap-1">
                  <VideoOff className="w-4 h-4" />
                  <span>Camera Off</span>
                </div>
              )}
              {isScreenSharing && (
                <div className="flex items-center gap-1">
                  <Monitor className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400">Sharing Screen</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <style jsx>{`
          .mirror {
            transform: scaleX(-1);
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
