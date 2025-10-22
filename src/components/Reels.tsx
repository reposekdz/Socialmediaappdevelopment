import { useState } from 'react';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Heart, MessageCircle, Share2, Bookmark, MoreVertical, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface ReelsProps {
  currentUser: any;
}

export function Reels({ currentUser }: ReelsProps) {
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [likedReels, setLikedReels] = useState<Set<number>>(new Set());
  const [savedReels, setSavedReels] = useState<Set<number>>(new Set());

  const reels = [
    {
      id: 1,
      user: { name: 'Sarah Johnson', username: 'sarahj', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', verified: true },
      thumbnail: 'https://images.unsplash.com/photo-1519662978799-2f05096d3636?w=400',
      description: 'Amazing architecture tour! 🏛️ #architecture #travel',
      likes: 12500,
      comments: 234,
      shares: 89,
      music: 'Original Audio - Sarah Johnson',
    },
    {
      id: 2,
      user: { name: 'Mike Chen', username: 'mikechen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', verified: false },
      thumbnail: 'https://images.unsplash.com/photo-1617634667039-8e4cb277ab46?w=400',
      description: 'Nature at its finest 🌲✨ #nature #peaceful',
      likes: 8900,
      comments: 156,
      shares: 45,
      music: 'Calm Nature Sounds',
    },
    {
      id: 3,
      user: { name: 'Emma Wilson', username: 'emmaw', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma', verified: true },
      thumbnail: 'https://images.unsplash.com/photo-1532980400857-e8d9d275d858?w=400',
      description: 'Cooking with love ❤️🍝 #cooking #food',
      likes: 15600,
      comments: 412,
      shares: 178,
      music: 'Cooking Vibes - Kitchen Beats',
    },
    {
      id: 4,
      user: { name: 'David Brown', username: 'davidb', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david', verified: false },
      thumbnail: 'https://images.unsplash.com/photo-1513061379709-ef0cd1695189?w=400',
      description: 'City nights are magical 🌃✨ #citylife #nightphotography',
      likes: 21300,
      comments: 567,
      shares: 234,
      music: 'Night City Vibes',
    },
    {
      id: 5,
      user: { name: 'Lisa Anderson', username: 'lisaa', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa', verified: true },
      thumbnail: 'https://images.unsplash.com/photo-1528543606781-2f6e6857f318?w=400',
      description: 'Adventure time! 🏔️ #adventure #hiking',
      likes: 18700,
      comments: 389,
      shares: 156,
      music: 'Adventure Awaits - Epic Music',
    },
  ];

  const currentReel = reels[currentReelIndex];

  const handleLike = () => {
    setLikedReels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentReel.id)) {
        newSet.delete(currentReel.id);
      } else {
        newSet.add(currentReel.id);
      }
      return newSet;
    });
  };

  const handleSave = () => {
    setSavedReels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentReel.id)) {
        newSet.delete(currentReel.id);
      } else {
        newSet.add(currentReel.id);
      }
      return newSet;
    });
  };

  const handleScroll = (direction: 'up' | 'down') => {
    if (direction === 'down' && currentReelIndex < reels.length - 1) {
      setCurrentReelIndex(currentReelIndex + 1);
    } else if (direction === 'up' && currentReelIndex > 0) {
      setCurrentReelIndex(currentReelIndex - 1);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] bg-black rounded-xl overflow-hidden relative">
      {/* Reel Content */}
      <div className="h-full w-full relative flex items-center justify-center">
        {/* Background Image (simulating video) */}
        <img
          src={currentReel.thumbnail}
          alt={currentReel.description}
          className="h-full w-full object-cover"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Avatar className="w-10 h-10 border-2 border-white">
              <AvatarImage src={currentReel.user.avatar} />
              <AvatarFallback>{currentReel.user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-white text-sm">{currentReel.user.username}</span>
                {currentReel.user.verified && (
                  <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
            </div>
            <Button size="sm" variant="outline" className="ml-2 h-7 text-xs">
              Follow
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="text-white">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-20 p-4 z-10">
          <p className="text-white text-sm mb-2">{currentReel.description}</p>
          <div className="flex items-center gap-2 text-white/80 text-xs">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
            <span>{currentReel.music}</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="absolute right-4 bottom-20 flex flex-col gap-6 z-10">
          <button
            onClick={handleLike}
            className="flex flex-col items-center gap-1 text-white"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Heart
                className={`w-6 h-6 ${
                  likedReels.has(currentReel.id) ? 'fill-red-500 text-red-500' : ''
                }`}
              />
            </div>
            <span className="text-xs">
              {(currentReel.likes + (likedReels.has(currentReel.id) ? 1 : 0)).toLocaleString()}
            </span>
          </button>

          <button className="flex flex-col items-center gap-1 text-white">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-xs">{currentReel.comments}</span>
          </button>

          <button className="flex flex-col items-center gap-1 text-white">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Share2 className="w-6 h-6" />
            </div>
            <span className="text-xs">{currentReel.shares}</span>
          </button>

          <button
            onClick={handleSave}
            className="flex flex-col items-center gap-1 text-white"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Bookmark
                className={`w-6 h-6 ${savedReels.has(currentReel.id) ? 'fill-white' : ''}`}
              />
            </div>
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="flex flex-col items-center gap-1 text-white"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </div>
          </button>
        </div>

        {/* Navigation Arrows */}
        {currentReelIndex > 0 && (
          <button
            onClick={() => handleScroll('up')}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+200px)] w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        )}
        
        {currentReelIndex < reels.length - 1 && (
          <button
            onClick={() => handleScroll('down')}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[calc(50%+200px)] w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}

        {/* Reel Counter */}
        <div className="absolute top-1/2 right-2 -translate-y-1/2 flex flex-col gap-1 z-10">
          {reels.map((_, idx) => (
            <div
              key={idx}
              className={`w-1 h-8 rounded-full transition-all ${
                idx === currentReelIndex ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
