import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreVertical, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause,
  ChevronUp,
  ChevronDown,
  Send,
  X
} from 'lucide-react';
import { reelAPI, userAPI } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent } from './ui/dialog';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';

interface AdvancedReelsViewProps {
  currentUser: any;
  onViewProfile: (userId: string) => void;
}

export function AdvancedReelsView({ currentUser, onViewProfile }: AdvancedReelsViewProps) {
  const [reels, setReels] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadReels();
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(err => console.error('Play error:', err));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, currentIndex]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // View reel when it loads
  useEffect(() => {
    if (reels.length > 0 && reels[currentIndex]) {
      handleViewReel(reels[currentIndex].id);
    }
  }, [currentIndex, reels]);

  const loadReels = async () => {
    try {
      setLoading(true);
      const response = await reelAPI.getReels();
      setReels(response.reels || []);
    } catch (error) {
      console.error('Error loading reels:', error);
      toast.error('Failed to load reels');
    } finally {
      setLoading(false);
    }
  };

  const handleViewReel = async (reelId: string) => {
    try {
      await reelAPI.viewReel(reelId);
    } catch (error) {
      console.error('Error viewing reel:', error);
    }
  };

  const handleLike = async () => {
    const reel = reels[currentIndex];
    const isLiked = reel.likes?.includes(currentUser.id);

    try {
      if (isLiked) {
        await reelAPI.unlikeReel(reel.id);
        setReels(reels.map((r, idx) => 
          idx === currentIndex 
            ? { ...r, likes: r.likes.filter((id: string) => id !== currentUser.id) }
            : r
        ));
      } else {
        await reelAPI.likeReel(reel.id);
        setReels(reels.map((r, idx) => 
          idx === currentIndex 
            ? { ...r, likes: [...(r.likes || []), currentUser.id] }
            : r
        ));
        toast.success('Reel liked!');
      }
    } catch (error) {
      console.error('Error liking reel:', error);
      toast.error('Failed to like reel');
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;

    try {
      const response = await reelAPI.commentOnReel(reels[currentIndex].id, commentText);
      setReels(reels.map((r, idx) => 
        idx === currentIndex 
          ? { ...r, comments: [...(r.comments || []), response.comment] }
          : r
      ));
      setCommentText('');
      toast.success('Comment added!');
    } catch (error) {
      console.error('Error commenting on reel:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleSave = async () => {
    const reel = reels[currentIndex];
    const isSaved = reel.saves?.includes(currentUser.id);

    try {
      await reelAPI.saveReel(reel.id);
      setReels(reels.map((r, idx) => 
        idx === currentIndex 
          ? { ...r, saves: isSaved 
              ? r.saves.filter((id: string) => id !== currentUser.id)
              : [...(r.saves || []), currentUser.id]
            }
          : r
      ));
      toast.success(isSaved ? 'Reel unsaved' : 'Reel saved!');
    } catch (error) {
      console.error('Error saving reel:', error);
      toast.error('Failed to save reel');
    }
  };

  const handleShare = async () => {
    const reel = reels[currentIndex];
    try {
      await reelAPI.shareReel(reel.id);
      
      if (navigator.share) {
        await navigator.share({
          title: `Reel by ${reel.userName}`,
          text: reel.caption || 'Check out this reel!',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing reel:', error);
    }
  };

  const handleFollow = async () => {
    const reel = reels[currentIndex];
    try {
      await userAPI.followUser(reel.userId);
      toast.success(`Following ${reel.userName}!`);
    } catch (error) {
      console.error('Error following user:', error);
      toast.error('Failed to follow user');
    }
  };

  const navigateReel = (direction: 'up' | 'down') => {
    if (direction === 'down' && currentIndex < reels.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsPlaying(true);
    } else if (direction === 'up' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsPlaying(true);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        navigateReel('up');
      } else if (e.key === 'ArrowDown') {
        navigateReel('down');
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(!isPlaying);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isPlaying, reels.length]);

  // Touch navigation
  const touchStart = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    
    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStart.current - touchEnd;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        navigateReel('down');
      } else {
        navigateReel('up');
      }
    }
    
    touchStart.current = null;
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-120px)] bg-black rounded-xl flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4" />
          <p>Loading reels...</p>
        </div>
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="h-[calc(100vh-120px)] bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 rounded-xl flex items-center justify-center text-white text-center p-8">
        <div>
          <div className="text-6xl mb-4">🎬</div>
          <h2 className="text-2xl mb-2">No Reels Yet</h2>
          <p className="text-white/70">Be the first to create a reel!</p>
        </div>
      </div>
    );
  }

  const currentReel = reels[currentIndex];
  const isLiked = currentReel.likes?.includes(currentUser.id);
  const isSaved = currentReel.saves?.includes(currentUser.id);

  return (
    <>
      <motion.div 
        ref={containerRef}
        className="h-[calc(100vh-120px)] bg-black rounded-xl overflow-hidden relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Video Player */}
        <div className="h-full w-full relative flex items-center justify-center">
          {currentReel.videoUrl ? (
            <video
              ref={videoRef}
              key={currentReel.id}
              src={currentReel.videoUrl}
              className="h-full w-full object-cover"
              loop
              playsInline
              autoPlay
              muted={isMuted}
              onClick={() => setIsPlaying(!isPlaying)}
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 flex items-center justify-center">
              <p className="text-white">Video not available</p>
            </div>
          )}

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

          {/* Play/Pause Indicator */}
          <AnimatePresence>
            {!isPlaying && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                  <Play className="w-10 h-10 text-white ml-2" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div 
                className="cursor-pointer"
                onClick={() => onViewProfile(currentReel.userId)}
              >
                <Avatar className="w-10 h-10 border-2 border-white ring-2 ring-purple-500">
                  <AvatarImage src={currentReel.userAvatar} />
                  <AvatarFallback>{currentReel.userName?.[0]}</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span 
                    className="text-white cursor-pointer hover:underline"
                    onClick={() => onViewProfile(currentReel.userId)}
                  >
                    {currentReel.userUsername}
                  </span>
                  {currentReel.isVerified && (
                    <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
              </div>
              {currentReel.userId !== currentUser.id && (
                <Button 
                  size="sm" 
                  onClick={handleFollow}
                  className="h-7 text-xs bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0"
                >
                  Follow
                </Button>
              )}
            </motion.div>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>

          {/* Bottom Info */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-0 left-0 right-20 p-4 z-10"
          >
            {currentReel.caption && (
              <p className="text-white text-sm mb-3 line-clamp-3">{currentReel.caption}</p>
            )}
            {currentReel.music && (
              <div className="flex items-center gap-2 text-white/80 text-xs">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
                <span className="animate-pulse">{currentReel.music}</span>
              </div>
            )}
          </motion.div>

          {/* Right Actions */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="absolute right-4 bottom-24 flex flex-col gap-6 z-10"
          >
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className="flex flex-col items-center gap-1 text-white"
            >
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all">
                <Heart
                  className={`w-6 h-6 transition-all ${
                    isLiked ? 'fill-red-500 text-red-500 scale-110' : ''
                  }`}
                />
              </div>
              <span className="text-xs">
                {currentReel.likes?.length || 0}
              </span>
            </motion.button>

            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowComments(true)}
              className="flex flex-col items-center gap-1 text-white"
            >
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="text-xs">{currentReel.comments?.length || 0}</span>
            </motion.button>

            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="flex flex-col items-center gap-1 text-white"
            >
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all">
                <Share2 className="w-6 h-6" />
              </div>
              <span className="text-xs">{currentReel.shares || 0}</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSave}
              className="flex flex-col items-center gap-1 text-white"
            >
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all">
                <Bookmark
                  className={`w-6 h-6 ${isSaved ? 'fill-white' : ''}`}
                />
              </div>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMuted(!isMuted)}
              className="flex flex-col items-center gap-1 text-white"
            >
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all">
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </div>
            </motion.button>
          </motion.div>

          {/* Navigation Arrows */}
          {currentIndex > 0 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              onClick={() => navigateReel('up')}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+250px)] w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white z-10 hover:bg-white/30 transition-all"
            >
              <ChevronUp className="w-6 h-6" />
            </motion.button>
          )}
          
          {currentIndex < reels.length - 1 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              onClick={() => navigateReel('down')}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[calc(50%+250px)] w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white z-10 hover:bg-white/30 transition-all"
            >
              <ChevronDown className="w-6 h-6" />
            </motion.button>
          )}

          {/* Reel Counter */}
          <div className="absolute top-1/2 right-2 -translate-y-1/2 flex flex-col gap-2 z-10">
            {reels.map((_, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setCurrentIndex(idx)}
                className={`w-1.5 h-8 rounded-full transition-all cursor-pointer ${
                  idx === currentIndex ? 'bg-white scale-110' : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-10">
            <motion.div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 15, ease: 'linear' }}
              key={currentIndex}
            />
          </div>
        </div>
      </motion.div>

      {/* Comments Modal */}
      <Dialog open={showComments} onOpenChange={setShowComments}>
        <DialogContent className="max-w-md p-0 h-[80vh]">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Comments</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowComments(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1 p-4">
              {currentReel.comments?.length > 0 ? (
                <div className="space-y-4">
                  {currentReel.comments.map((comment: any, idx: number) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex gap-3"
                    >
                      <Avatar 
                        className="w-8 h-8 cursor-pointer" 
                        onClick={() => {
                          setShowComments(false);
                          onViewProfile(comment.userId);
                        }}
                      >
                        <AvatarImage src={comment.userAvatar} />
                        <AvatarFallback>{comment.userName?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-gray-100 rounded-2xl px-4 py-2">
                          <p 
                            className="text-sm cursor-pointer hover:underline"
                            onClick={() => {
                              setShowComments(false);
                              onViewProfile(comment.userId);
                            }}
                          >
                            {comment.userUsername}
                          </p>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 ml-4">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No comments yet</p>
                    <p className="text-sm">Be the first to comment!</p>
                  </div>
                </div>
              )}
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback>{currentUser.name?.[0]}</AvatarFallback>
                </Avatar>
                <Input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleComment}
                  disabled={!commentText.trim()}
                  size="icon"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
