import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Dialog, DialogContent } from './ui/dialog';
import { Input } from './ui/input';
import { 
  Plus, 
  X, 
  Heart, 
  Send, 
  Pause, 
  Play, 
  Volume2, 
  VolumeX, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import { storyAPI, userAPI } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';

interface AdvancedStoryViewProps {
  currentUser: any;
  onViewProfile: (userId: string) => void;
  onCreateStory: () => void;
}

export function AdvancedStoryView({ currentUser, onViewProfile, onCreateStory }: AdvancedStoryViewProps) {
  const [stories, setStories] = useState<any[]>([]);
  const [selectedStoryGroup, setSelectedStoryGroup] = useState<any>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressIntervalRef = useRef<any>(null);

  useEffect(() => {
    loadStories();
  }, []);

  useEffect(() => {
    if (selectedStoryGroup && !isPaused) {
      startProgress();
    } else {
      stopProgress();
    }

    return () => stopProgress();
  }, [selectedStoryGroup, currentStoryIndex, isPaused]);

  // View story when it loads
  useEffect(() => {
    if (selectedStoryGroup?.stories?.[currentStoryIndex]) {
      handleViewStory(selectedStoryGroup.stories[currentStoryIndex].id);
    }
  }, [selectedStoryGroup, currentStoryIndex]);

  const loadStories = async () => {
    try {
      setLoading(true);
      const response = await storyAPI.getStories();
      
      // Backend already returns grouped stories
      const groupedStories: any[] = [];
      
      // Find current user's stories or add placeholder
      const myStoryGroup = (response.stories || []).find((group: any) => group.userId === currentUser.id);
      
      if (myStoryGroup) {
        groupedStories.push({
          ...myStoryGroup,
          isOwn: true,
        });
      } else {
        // Add "create story" placeholder
        groupedStories.push({
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          userUsername: currentUser.username,
          stories: [],
          isOwn: true,
          isAddStory: true,
        });
      }

      // Add other users' stories
      (response.stories || []).forEach((group: any) => {
        if (group.userId !== currentUser.id) {
          groupedStories.push({
            ...group,
            isOwn: false,
          });
        }
      });

      setStories(groupedStories);
    } catch (error) {
      console.error('Error loading stories:', error);
      toast.error('Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  const handleViewStory = async (storyId: string) => {
    try {
      await storyAPI.viewStory(storyId);
    } catch (error) {
      console.error('Error viewing story:', error);
    }
  };

  const handleLikeStory = async () => {
    const currentStory = selectedStoryGroup.stories[currentStoryIndex];
    try {
      await storyAPI.likeStory(currentStory.id);
      toast.success('Liked!');
    } catch (error) {
      console.error('Error liking story:', error);
      toast.error('Failed to like story');
    }
  };

  const startProgress = () => {
    stopProgress();
    setStoryProgress(0);

    const duration = selectedStoryGroup.stories[currentStoryIndex]?.duration || 5000;
    const interval = 50;
    const increment = (interval / duration) * 100;

    progressIntervalRef.current = setInterval(() => {
      setStoryProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressIntervalRef.current);
          handleNextStory();
          return 100;
        }
        return prev + increment;
      });
    }, interval);
  };

  const stopProgress = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const handleStoryClick = (storyGroup: any) => {
    if (storyGroup.isAddStory) {
      onCreateStory();
      return;
    }
    setSelectedStoryGroup(storyGroup);
    setCurrentStoryIndex(0);
    setStoryProgress(0);
    setIsPaused(false);
  };

  const handleNextStory = () => {
    if (currentStoryIndex < selectedStoryGroup.stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setStoryProgress(0);
    } else {
      // Move to next user's stories
      const currentGroupIndex = stories.findIndex(s => s.userId === selectedStoryGroup.userId);
      if (currentGroupIndex < stories.length - 1) {
        const nextGroup = stories[currentGroupIndex + 1];
        if (!nextGroup.isAddStory) {
          setSelectedStoryGroup(nextGroup);
          setCurrentStoryIndex(0);
          setStoryProgress(0);
        } else {
          closeStoryViewer();
        }
      } else {
        closeStoryViewer();
      }
    }
  };

  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setStoryProgress(0);
    } else {
      // Move to previous user's stories
      const currentGroupIndex = stories.findIndex(s => s.userId === selectedStoryGroup.userId);
      if (currentGroupIndex > 0) {
        const prevGroup = stories[currentGroupIndex - 1];
        if (!prevGroup.isAddStory) {
          setSelectedStoryGroup(prevGroup);
          setCurrentStoryIndex(prevGroup.stories.length - 1);
          setStoryProgress(0);
        }
      }
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    
    toast.success('Reply sent!');
    setReplyText('');
  };

  const closeStoryViewer = () => {
    setSelectedStoryGroup(null);
    setCurrentStoryIndex(0);
    setStoryProgress(0);
    setIsPaused(false);
  };

  const getTimeSince = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (loading) {
    return (
      <Card className="p-4 shadow-sm">
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0 animate-pulse">
              <div className="w-20 h-28 rounded-2xl bg-gray-200" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-4 shadow-sm bg-white">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {stories.map((storyGroup) => (
            <motion.div
              key={storyGroup.userId}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 cursor-pointer"
              onClick={() => handleStoryClick(storyGroup)}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`relative ${
                  storyGroup.isAddStory 
                    ? '' 
                    : storyGroup.stories.some((s: any) => s.viewed) 
                      ? 'p-[2px]' 
                      : 'p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-2xl'
                }`}>
                  <div className="w-20 h-28 rounded-2xl overflow-hidden border-2 border-white bg-gradient-to-br from-gray-100 to-gray-200 relative">
                    {storyGroup.isAddStory ? (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={storyGroup.userAvatar} />
                          <AvatarFallback>{storyGroup.userName?.[0]}</AvatarFallback>
                        </Avatar>
                      </div>
                    ) : (
                      <>
                        <img 
                          src={storyGroup.stories[0]?.mediaUrl || storyGroup.userAvatar} 
                          alt="Story" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <Avatar className="w-8 h-8 border-2 border-white">
                            <AvatarImage src={storyGroup.userAvatar} />
                            <AvatarFallback>{storyGroup.userName?.[0]}</AvatarFallback>
                          </Avatar>
                        </div>
                      </>
                    )}
                    {storyGroup.isAddStory && (
                      <div className="absolute bottom-2 right-2 w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center border-2 border-white">
                        <Plus className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-xs max-w-[80px] truncate">
                  {storyGroup.isAddStory ? 'Your Story' : storyGroup.userName.split(' ')[0]}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Story Viewer */}
      <AnimatePresence>
        {selectedStoryGroup && (
          <Dialog open={!!selectedStoryGroup} onOpenChange={closeStoryViewer}>
            <DialogContent className="max-w-md p-0 bg-black border-0">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative h-[600px]"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  if (x < rect.width / 2) {
                    handlePrevStory();
                  } else {
                    handleNextStory();
                  }
                }}
                onMouseDown={() => setIsPaused(true)}
                onMouseUp={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
              >
                {/* Progress Bars */}
                <div className="absolute top-0 left-0 right-0 z-20 p-2 flex gap-1">
                  {selectedStoryGroup.stories.map((story: any, idx: number) => (
                    <div key={story.id} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-white"
                        initial={{ width: idx < currentStoryIndex ? '100%' : '0%' }}
                        animate={{ 
                          width: idx === currentStoryIndex 
                            ? `${storyProgress}%` 
                            : idx < currentStoryIndex 
                              ? '100%' 
                              : '0%'
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* User Info */}
                <div className="absolute top-6 left-0 right-0 z-20 flex items-center justify-between p-4">
                  <div 
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeStoryViewer();
                      onViewProfile(selectedStoryGroup.userId);
                    }}
                  >
                    <Avatar className="w-10 h-10 border-2 border-white ring-2 ring-purple-500">
                      <AvatarImage src={selectedStoryGroup.userAvatar} />
                      <AvatarFallback>{selectedStoryGroup.userName?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white text-sm">{selectedStoryGroup.userName}</p>
                      <p className="text-white/70 text-xs">
                        {getTimeSince(selectedStoryGroup.stories[currentStoryIndex]?.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsPaused(!isPaused);
                      }}
                    >
                      {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                    </Button>
                    {selectedStoryGroup.stories[currentStoryIndex]?.mediaType === 'video' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMuted(!isMuted);
                        }}
                      >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        closeStoryViewer();
                      }}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Story Content */}
                <div className="relative w-full h-full">
                  {selectedStoryGroup.stories[currentStoryIndex]?.mediaType === 'video' ? (
                    <video
                      ref={videoRef}
                      src={selectedStoryGroup.stories[currentStoryIndex]?.mediaUrl}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted={isMuted}
                      playsInline
                    />
                  ) : (
                    <img
                      src={selectedStoryGroup.stories[currentStoryIndex]?.mediaUrl}
                      alt="Story"
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Story Text Overlay */}
                  {selectedStoryGroup.stories[currentStoryIndex]?.text && (
                    <div 
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        backgroundColor: selectedStoryGroup.stories[currentStoryIndex]?.backgroundColor || 'transparent'
                      }}
                    >
                      <p className="text-white text-2xl text-center px-8">
                        {selectedStoryGroup.stories[currentStoryIndex]?.text}
                      </p>
                    </div>
                  )}
                </div>

                {/* Navigation Arrows */}
                {currentStoryIndex > 0 && (
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full bg-black/30 hover:bg-black/50 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevStory();
                      }}
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                  </div>
                )}

                {currentStoryIndex < selectedStoryGroup.stories.length - 1 && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full bg-black/30 hover:bg-black/50 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextStory();
                      }}
                    >
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                  </div>
                )}

                {/* Reply Section */}
                {!selectedStoryGroup.isOwn && (
                  <div className="absolute bottom-4 left-0 right-0 z-20 px-4">
                    <div className="flex gap-2 items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full bg-black/30 hover:bg-black/50 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLikeStory();
                        }}
                      >
                        <Heart className="w-5 h-5" />
                      </Button>
                      <Input
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Reply to ${selectedStoryGroup.userName}...`}
                        className="flex-1 bg-black/30 border-white/30 text-white placeholder:text-white/50"
                        onClick={(e) => e.stopPropagation()}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.stopPropagation();
                            handleSendReply();
                          }
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full bg-black/30 hover:bg-black/50 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSendReply();
                        }}
                        disabled={!replyText.trim()}
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
