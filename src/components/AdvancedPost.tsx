import { useState } from 'react';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreVertical,
  Send,
  Smile,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Maximize,
  ThumbsUp,
  Laugh,
  Angry,
  Frown,
  Eye,
  TrendingUp,
  Award,
  Flame,
  Sparkles,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Progress } from './ui/progress';

interface AdvancedPostProps {
  post: any;
  currentUser: any;
}

export function AdvancedPost({ post, currentUser }: AdvancedPostProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [likeCount, setLikeCount] = useState(post.likes || 1234);
  const [commentCount, setCommentCount] = useState(post.comments || 89);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [viewCount, setViewCount] = useState(post.views || 5678);

  const reactions = [
    { emoji: '❤️', name: 'Love', color: '#ef4444', count: 150 },
    { emoji: '👍', name: 'Like', color: '#3b82f6', count: 89 },
    { emoji: '😂', name: 'Haha', color: '#f59e0b', count: 45 },
    { emoji: '😮', name: 'Wow', color: '#8b5cf6', count: 23 },
    { emoji: '😢', name: 'Sad', color: '#6b7280', count: 5 },
    { emoji: '😡', name: 'Angry', color: '#dc2626', count: 2 },
  ];

  const comments = [
    {
      id: 1,
      user: { name: 'Sarah Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', verified: true },
      text: 'This is amazing! 🔥',
      likes: 12,
      timestamp: '2h ago',
      replies: 3
    },
    {
      id: 2,
      user: { name: 'Mike Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', verified: false },
      text: 'Love this content! Keep it up! 💪',
      likes: 8,
      timestamp: '5h ago',
      replies: 1
    },
  ];

  const handleLike = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create floating particles
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
    }));
    setParticles(newParticles);

    // Remove particles after animation
    setTimeout(() => setParticles([]), 1000);

    if (!liked) {
      setLikeCount(likeCount + 1);
    } else {
      setLikeCount(likeCount - 1);
    }
    setLiked(!liked);
  };

  const handleReaction = (reaction: string) => {
    setSelectedReaction(reaction);
    setShowReactions(false);
    if (!liked) {
      setLikeCount(likeCount + 1);
      setLiked(true);
    }
  };

  const handleComment = () => {
    if (commentText.trim()) {
      setCommentCount(commentCount + 1);
      setCommentText('');
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
    // Increment view count
    setViewCount(viewCount + 1);
  };

  const isTrending = post.trending || Math.random() > 0.7;
  const hasAchievement = post.achievement || Math.random() > 0.8;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white relative">
        {/* Trending Badge */}
        {isTrending && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute top-4 right-4 z-10"
          >
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 border-0 shadow-lg">
              <Flame className="w-3 h-3 mr-1" />
              Trending
            </Badge>
          </motion.div>
        )}

        {/* Achievement Badge */}
        {hasAchievement && (
          <motion.div
            initial={{ scale: 0, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute top-14 right-4 z-10"
          >
            <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 border-0 shadow-lg">
              <Award className="w-3 h-3 mr-1" />
              Top Post
            </Badge>
          </motion.div>
        )}

        {/* Header */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ x: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="relative">
                <Avatar className="w-12 h-12 ring-2 ring-purple-200 ring-offset-2">
                  <AvatarImage src={post.user.avatar} />
                  <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                </Avatar>
                <motion.div
                  className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm">{post.user.name}</p>
                  {post.user.verified && (
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                    >
                      <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </motion.div>
                  )}
                </div>
                <p className="text-xs text-gray-500">{post.timestamp}</p>
              </div>
            </motion.div>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>

          {/* Post Content */}
          {post.content && (
            <motion.p 
              className="mt-3 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {post.content}
            </motion.p>
          )}
        </div>

        {/* Post Media with Advanced Features */}
        {post.image && (
          <motion.div 
            className="relative overflow-hidden group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={post.image}
              alt="Post"
              className="w-full object-cover"
            />
            
            {/* Image Overlay on Hover */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center p-4"
            >
              <div className="flex gap-4 text-white">
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center gap-2"
                >
                  <Eye className="w-5 h-5" />
                  <span>{viewCount.toLocaleString()}</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center gap-2"
                >
                  <Maximize className="w-5 h-5" />
                  <span>Full Screen</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Video Controls */}
            {post.isVideo && (
              <div className="absolute bottom-4 left-4 right-4 space-y-2">
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setPlaying(!playing)}
                    className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
                  >
                    {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                  </motion.button>
                  <Progress value={45} className="flex-1 h-1" />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMuted(!muted)}
                    className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
                  >
                    {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Engagement Stats with Animation */}
        <div className="px-4 py-3 border-b">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              {/* Reaction Avatars */}
              <div className="flex -space-x-1">
                {reactions.slice(0, 3).map((reaction, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0, x: -20 }}
                    animate={{ scale: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs border-2 border-white shadow-sm"
                    style={{ backgroundColor: reaction.color }}
                  >
                    {reaction.emoji}
                  </motion.div>
                ))}
              </div>
              <motion.span
                key={likeCount}
                initial={{ scale: 1.5, color: '#ef4444' }}
                animate={{ scale: 1, color: '#6b7280' }}
                transition={{ duration: 0.3 }}
              >
                {likeCount.toLocaleString()} reactions
              </motion.span>
            </motion.div>
            <div className="flex items-center gap-4">
              <motion.span whileHover={{ scale: 1.1 }}>
                {commentCount} comments
              </motion.span>
              <motion.span whileHover={{ scale: 1.1 }}>
                {post.shares || 234} shares
              </motion.span>
            </div>
          </div>
        </div>

        {/* Action Buttons with Reactions */}
        <div className="px-4 py-2 relative">
          {/* Floating Particles */}
          <AnimatePresence>
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{ 
                  x: particle.x, 
                  y: particle.y, 
                  scale: 1,
                  opacity: 1 
                }}
                animate={{
                  x: particle.x + (Math.random() - 0.5) * 100,
                  y: particle.y - Math.random() * 100,
                  scale: 0,
                  opacity: 0,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute pointer-events-none text-2xl"
                style={{ left: 0, top: 0 }}
              >
                {selectedReaction || '❤️'}
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="grid grid-cols-4 gap-2">
            {/* Like Button with Reactions */}
            <div className="relative">
              <Popover open={showReactions} onOpenChange={setShowReactions}>
                <PopoverTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLike}
                    className="flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-lg transition-colors w-full"
                  >
                    <motion.div
                      animate={liked ? { 
                        scale: [1, 1.3, 1],
                        rotate: [0, 15, -15, 0]
                      } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <Heart 
                        className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                      />
                    </motion.div>
                    <span className={`text-sm ${liked ? 'text-red-500' : 'text-gray-600'}`}>
                      {selectedReaction ? reactions.find(r => r.emoji === selectedReaction)?.name : 'Like'}
                    </span>
                  </motion.button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" side="top">
                  <div className="flex gap-2">
                    {reactions.map((reaction, idx) => (
                      <motion.button
                        key={reaction.name}
                        initial={{ scale: 0, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ 
                          scale: 1.5, 
                          y: -10,
                          transition: { duration: 0.2 }
                        }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleReaction(reaction.emoji)}
                        className="text-2xl hover:bg-gray-100 rounded-full p-2 transition-colors relative group"
                      >
                        {reaction.emoji}
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {reaction.name}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Comment Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowComments(!showComments)}
              className="flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600">Comment</span>
            </motion.button>

            {/* Share Button */}
            <motion.button
              whileHover={{ scale: 1.05, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Share2 className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600">Share</span>
            </motion.button>

            {/* Save Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSaved(!saved)}
              className="flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <motion.div
                animate={saved ? { 
                  scale: [1, 1.3, 1],
                  rotate: [0, 10, -10, 0]
                } : {}}
                transition={{ duration: 0.5 }}
              >
                <Bookmark 
                  className={`w-5 h-5 ${saved ? 'fill-purple-500 text-purple-500' : 'text-gray-600'}`}
                />
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Comments Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t overflow-hidden"
            >
              <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
                {comments.map((comment, idx) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-3 group"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={comment.user.avatar} />
                      <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-2xl px-3 py-2">
                        <div className="flex items-center gap-1">
                          <p className="text-sm">{comment.user.name}</p>
                          {comment.user.verified && (
                            <svg className="w-3 h-3 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                        <p className="text-sm text-gray-700">{comment.text}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          className="hover:text-purple-600"
                        >
                          Like · {comment.likes}
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          className="hover:text-purple-600"
                        >
                          Reply · {comment.replies}
                        </motion.button>
                        <span>{comment.timestamp}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Comment Input */}
              <div className="p-4 border-t flex gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback>{currentUser.fullName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 rounded-full"
                    onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Smile className="w-5 h-5 text-gray-400" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: -15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleComment}
                  >
                    <Send className="w-5 h-5 text-purple-600" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
