import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  X, 
  Heart, 
  MessageCircle, 
  Share2, 
  Users, 
  Eye,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Settings,
  Gift,
  Sparkles,
  Flame,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollArea } from './ui/scroll-area';

interface LiveStreamingModalProps {
  onClose: () => void;
  currentUser: any;
}

export function LiveStreamingModal({ onClose, currentUser }: LiveStreamingModalProps) {
  const [viewers, setViewers] = useState(1247);
  const [likes, setLikes] = useState(8932);
  const [message, setMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<Array<{ id: number; x: number }>>([]);
  const [gifts, setGifts] = useState<Array<{ id: number; type: string; user: string }>>([]);

  const messages = [
    { id: 1, user: 'Sarah J.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', text: 'Amazing content! 🔥', timestamp: Date.now() - 2000 },
    { id: 2, user: 'Mike C.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', text: 'Love this!', timestamp: Date.now() - 5000 },
    { id: 3, user: 'Emma W.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma', text: 'Keep it up! 💪', timestamp: Date.now() - 8000 },
  ];

  const giftTypes = [
    { emoji: '🎁', name: 'Gift', cost: 10 },
    { emoji: '💎', name: 'Diamond', cost: 50 },
    { emoji: '👑', name: 'Crown', cost: 100 },
    { emoji: '🚀', name: 'Rocket', cost: 200 },
    { emoji: '🌟', name: 'Star', cost: 500 },
  ];

  // Simulate viewer count changes
  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(prev => prev + Math.floor(Math.random() * 10) - 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLike = () => {
    setLikes(likes + 1);
    
    // Create floating heart
    const newHeart = {
      id: Date.now(),
      x: Math.random() * 80 + 10,
    };
    setFloatingHearts(prev => [...prev, newHeart]);

    // Remove heart after animation
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 3000);
  };

  const handleSendGift = (gift: typeof giftTypes[0]) => {
    const newGift = {
      id: Date.now(),
      type: gift.emoji,
      user: currentUser.fullName,
    };
    setGifts(prev => [...prev, newGift]);

    // Remove gift notification after 3 seconds
    setTimeout(() => {
      setGifts(prev => prev.filter(g => g.id !== newGift.id));
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
    >
      {/* Live Stream Video Area */}
      <div className="relative w-full h-full">
        {/* Simulated Video Stream */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="text-white text-6xl opacity-20"
          >
            <Video className="w-32 h-32" />
          </motion.div>
        </div>

        {/* Top Bar */}
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(239, 68, 68, 0.7)',
                    '0 0 0 10px rgba(239, 68, 68, 0)',
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="relative"
              >
                <Badge className="bg-red-500 border-0">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    LIVE
                  </span>
                </Badge>
              </motion.div>
              
              <Avatar className="w-10 h-10 ring-2 ring-white">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback>{currentUser.fullName[0]}</AvatarFallback>
              </Avatar>
              
              <div className="text-white">
                <p className="text-sm">{currentUser.fullName}</p>
                <p className="text-xs opacity-80">Live Stream</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full"
              >
                <Eye className="w-4 h-4 text-white" />
                <span className="text-white text-sm">{viewers.toLocaleString()}</span>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Floating Hearts */}
        <AnimatePresence>
          {floatingHearts.map((heart) => (
            <motion.div
              key={heart.id}
              initial={{ 
                y: window.innerHeight, 
                x: `${heart.x}%`,
                scale: 0,
                opacity: 0
              }}
              animate={{ 
                y: -100, 
                scale: [0, 1, 1, 0],
                opacity: [0, 1, 1, 0],
                rotate: [0, 15, -15, 0]
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 3,
                ease: 'easeOut'
              }}
              className="absolute text-6xl pointer-events-none z-30"
            >
              ❤️
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Gift Notifications */}
        <AnimatePresence>
          {gifts.map((gift, idx) => (
            <motion.div
              key={gift.id}
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 20, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="absolute left-0 bg-gradient-to-r from-purple-600/90 to-pink-600/90 backdrop-blur-sm rounded-r-full px-4 py-2 text-white flex items-center gap-2 z-30"
              style={{ top: `${120 + idx * 60}px` }}
            >
              <span className="text-3xl">{gift.type}</span>
              <div>
                <p className="text-xs opacity-80">Gift from</p>
                <p className="text-sm">{gift.user}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Right Sidebar - Chat & Gifts */}
        <motion.div
          initial={{ x: 400 }}
          animate={{ x: 0 }}
          className="absolute right-4 top-20 bottom-20 w-80 flex flex-col gap-4"
        >
          {/* Live Chat */}
          <Card className="flex-1 bg-black/40 backdrop-blur-lg border-white/20 overflow-hidden">
            <div className="p-3 border-b border-white/20">
              <p className="text-white text-sm flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Live Chat
              </p>
            </div>
            <ScrollArea className="h-[calc(100%-120px)] p-3">
              <div className="space-y-3">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-2"
                  >
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={msg.avatar} />
                      <AvatarFallback>{msg.user[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-lg px-2 py-1">
                      <p className="text-xs text-white/80">{msg.user}</p>
                      <p className="text-sm text-white">{msg.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-3 border-t border-white/20">
              <div className="flex gap-2">
                <Input
                  placeholder="Say something..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
                  Send
                </Button>
              </div>
            </div>
          </Card>

          {/* Send Gifts */}
          <Card className="bg-black/40 backdrop-blur-lg border-white/20 p-3">
            <p className="text-white text-sm mb-2 flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Send Gifts
            </p>
            <div className="grid grid-cols-5 gap-2">
              {giftTypes.map((gift) => (
                <motion.button
                  key={gift.name}
                  whileHover={{ scale: 1.2, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSendGift(gift)}
                  className="aspect-square bg-white/10 hover:bg-white/20 rounded-lg flex flex-col items-center justify-center transition-colors"
                >
                  <span className="text-2xl">{gift.emoji}</span>
                  <span className="text-xs text-white/80">{gift.cost}</span>
                </motion.button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Bottom Controls */}
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"
        >
          <div className="flex items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex flex-col items-center justify-center text-white shadow-lg"
            >
              <Heart className="w-6 h-6 fill-white" />
              <span className="text-xs">{(likes / 1000).toFixed(1)}K</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMuted(!isMuted)}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${
                isMuted ? 'bg-red-500' : 'bg-white/20 backdrop-blur-sm'
              }`}
            >
              {isMuted ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${
                isVideoOff ? 'bg-red-500' : 'bg-white/20 backdrop-blur-sm'
              }`}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5 text-white" /> : <Video className="w-5 h-5 text-white" />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
            >
              <Settings className="w-5 h-5 text-white" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
            >
              <Share2 className="w-5 h-5 text-white" />
            </motion.button>
          </div>

          <div className="mt-4 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-8 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
            >
              End Stream
            </motion.button>
          </div>
        </motion.div>

        {/* Sparkle Effects */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-400"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
              repeatDelay: 1,
            }}
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
