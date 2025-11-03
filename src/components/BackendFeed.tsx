import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { toast } from 'sonner@2.0.3';
import { postAPI } from '../utils/api';
import { motion, AnimatePresence } from 'motion/react';

interface BackendFeedProps {
  currentUser: any;
  onStartVideoCall?: (user: any) => void;
  onStartAudioCall?: (user: any) => void;
  onViewProfile?: (userId: string) => void;
}

export function BackendFeed({ currentUser, onStartVideoCall, onStartAudioCall, onViewProfile }: BackendFeedProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    setIsLoading(true);
    try {
      const response = await postAPI.getFeed();
      if (response.success) {
        setPosts(response.posts);
      }
    } catch (error) {
      console.error('Error loading feed:', error);
      toast.error('Failed to load feed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (postId: string, isLiked: boolean) => {
    try {
      if (isLiked) {
        await postAPI.unlikePost(postId);
      } else {
        await postAPI.likePost(postId);
      }

      // Update local state
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            const newLikes = isLiked 
              ? post.likes.filter((id: string) => id !== currentUser.id)
              : [...post.likes, currentUser.id];
            return { ...post, likes: newLikes };
          }
          return post;
        })
      );
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  const handleComment = async (postId: string) => {
    const content = commentInputs[postId];
    if (!content || !content.trim()) return;

    try {
      const response = await postAPI.commentOnPost(postId, content);
      if (response.success) {
        // Update local state
        setPosts(prevPosts =>
          prevPosts.map(post => {
            if (post.id === postId) {
              return { ...post, comments: [...post.comments, response.comment] };
            }
            return post;
          })
        );
        setCommentInputs({ ...commentInputs, [postId]: '' });
        toast.success('Comment posted!');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment');
    }
  };

  const handleSave = async (postId: string, isSaved: boolean) => {
    try {
      if (isSaved) {
        await postAPI.unsavePost(postId);
        toast.success('Post removed from saved');
      } else {
        await postAPI.savePost(postId);
        toast.success('Post saved!');
      }

      // Update local state
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post.id === postId) {
            const newSaves = isSaved
              ? post.saves.filter((id: string) => id !== currentUser.id)
              : [...post.saves, currentUser.id];
            return { ...post, saves: newSaves };
          }
          return post;
        })
      );
    } catch (error) {
      console.error('Error toggling save:', error);
      toast.error('Failed to update save');
    }
  };

  const handleShare = async (postId: string) => {
    try {
      await postAPI.sharePost(postId);
      
      // Update local state
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post.id === postId) {
            return { ...post, shares: (post.shares || 0) + 1 };
          }
          return post;
        })
      );
      
      toast.success('Post shared!');
    } catch (error) {
      console.error('Error sharing post:', error);
      toast.error('Failed to share post');
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-24 rounded-lg mb-4"></div>
          <div className="bg-white rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      {/* Posts */}
      <AnimatePresence>
        {posts.map((post) => {
          const isLiked = post.likes?.includes(currentUser.id);
          const isSaved = post.saves?.includes(currentUser.id);

          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Post Header */}
                <div className="p-4 flex items-center justify-between">
                  <div 
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => onViewProfile?.(post.userId)}
                  >
                    <Avatar className="w-12 h-12 cursor-pointer border-2 border-gradient-to-br from-purple-600 to-pink-600">
                      <AvatarImage src={post.userAvatar} alt={post.userName} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                        {post.userName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="hover:underline">{post.userName}</h3>
                      <p className="text-sm text-gray-600">
                        {formatTimeAgo(post.createdAt)}
                        {post.location && ` · ${post.location}`}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </div>

                {/* Post Content */}
                {post.content && (
                  <div className="px-4 pb-3">
                    <p className="whitespace-pre-wrap">{post.content}</p>
                    {post.feeling && (
                      <span className="text-sm text-gray-600"> — feeling {post.feeling}</span>
                    )}
                  </div>
                )}

                {/* Post Images */}
                {post.images && post.images.length > 0 && (
                  <div className={`grid gap-1 ${post.images.length === 1 ? '' : post.images.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                    {post.images.slice(0, 4).map((image: string, index: number) => (
                      <div key={index} className="relative aspect-square bg-gray-100">
                        <img
                          src={image}
                          alt={`Post image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {index === 3 && post.images.length > 4 && (
                          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                            <span className="text-white text-2xl">+{post.images.length - 4}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Post Actions */}
                <div className="px-4 py-3 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleLike(post.id, isLiked)}
                        className="flex items-center gap-2 group"
                      >
                        <Heart
                          className={`w-6 h-6 transition-all ${
                            isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600 group-hover:text-red-500'
                          }`}
                        />
                        <span className="text-sm text-gray-600">{post.likes?.length || 0}</span>
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowComments({ ...showComments, [post.id]: !showComments[post.id] })}
                        className="flex items-center gap-2 group"
                      >
                        <MessageCircle className="w-6 h-6 text-gray-600 group-hover:text-blue-500 transition-colors" />
                        <span className="text-sm text-gray-600">{post.comments?.length || 0}</span>
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleShare(post.id)}
                        className="flex items-center gap-2 group"
                      >
                        <Share2 className="w-6 h-6 text-gray-600 group-hover:text-green-500 transition-colors" />
                        <span className="text-sm text-gray-600">{post.shares || 0}</span>
                      </motion.button>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleSave(post.id, isSaved)}
                    >
                      <Bookmark
                        className={`w-6 h-6 transition-all ${
                          isSaved ? 'fill-purple-500 text-purple-500' : 'text-gray-600 hover:text-purple-500'
                        }`}
                      />
                    </motion.button>
                  </div>

                  {/* Comments Section */}
                  {showComments[post.id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 pt-3 border-t border-gray-100"
                    >
                      {post.comments && post.comments.length > 0 && (
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {post.comments.map((comment: any) => (
                            <div key={comment.id} className="flex gap-2">
                              <Avatar 
                                className="w-8 h-8 cursor-pointer"
                                onClick={() => onViewProfile?.(comment.userId)}
                              >
                                <AvatarImage src={comment.userAvatar} alt={comment.userName} />
                                <AvatarFallback>{comment.userName?.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 bg-gray-100 rounded-lg px-3 py-2">
                                <p 
                                  className="text-sm cursor-pointer hover:underline"
                                  onClick={() => onViewProfile?.(comment.userId)}
                                >
                                  {comment.userName}
                                </p>
                                <p className="text-sm">{comment.content}</p>
                                <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(comment.createdAt)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Comment Input */}
                      <div className="flex gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                          <AvatarFallback>{currentUser.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 flex gap-2">
                          <Input
                            placeholder="Write a comment..."
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleComment(post.id);
                              }
                            }}
                          />
                          <Button
                            size="icon"
                            onClick={() => handleComment(post.id)}
                            disabled={!commentInputs[post.id]?.trim()}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {posts.length === 0 && !isLoading && (
        <Card className="bg-white rounded-xl p-12 text-center">
          <div className="text-gray-400 mb-4">
            <MessageCircle className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl mb-2">No posts yet</h3>
          <p className="text-gray-600">Follow some users to see their posts in your feed!</p>
        </Card>
      )}
    </div>
  );
}
