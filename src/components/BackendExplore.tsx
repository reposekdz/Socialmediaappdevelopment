import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Play, Volume2, VolumeX, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { toast } from 'sonner@2.0.3';
import { exploreAPI, reelAPI, postAPI } from '../utils/api';
import { motion, AnimatePresence } from 'motion/react';

interface BackendExploreProps {
  currentUser: any;
  onViewProfile?: (userId: string) => void;
}

export function BackendExplore({ currentUser, onViewProfile }: BackendExploreProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [reels, setReels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reels');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [commentInput, setCommentInput] = useState('');
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    loadExplore();
  }, []);

  const loadExplore = async () => {
    setIsLoading(true);
    try {
      const response = await exploreAPI.getExplore();
      if (response.success) {
        setPosts(response.posts || []);
        setReels(response.reels || []);
      }
    } catch (error) {
      console.error('Error loading explore:', error);
      toast.error('Failed to load explore content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikeReel = async (reelId: string, isLiked: boolean) => {
    try {
      if (isLiked) {
        await reelAPI.unlikeReel(reelId);
      } else {
        await reelAPI.likeReel(reelId);
      }

      setReels(prevReels =>
        prevReels.map(reel => {
          if (reel.id === reelId) {
            const newLikes = isLiked
              ? reel.likes.filter((id: string) => id !== currentUser.id)
              : [...reel.likes, currentUser.id];
            return { ...reel, likes: newLikes };
          }
          return reel;
        })
      );

      if (selectedItem?.id === reelId) {
        setSelectedItem({
          ...selectedItem,
          likes: isLiked
            ? selectedItem.likes.filter((id: string) => id !== currentUser.id)
            : [...selectedItem.likes, currentUser.id]
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  const handleLikePost = async (postId: string, isLiked: boolean) => {
    try {
      if (isLiked) {
        await postAPI.unlikePost(postId);
      } else {
        await postAPI.likePost(postId);
      }

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

  const handleCommentOnReel = async (reelId: string) => {
    if (!commentInput.trim()) return;

    try {
      const response = await reelAPI.commentOnReel(reelId, commentInput);
      if (response.success) {
        setReels(prevReels =>
          prevReels.map(reel => {
            if (reel.id === reelId) {
              return { ...reel, comments: [...reel.comments, response.comment] };
            }
            return reel;
          })
        );

        if (selectedItem?.id === reelId) {
          setSelectedItem({
            ...selectedItem,
            comments: [...selectedItem.comments, response.comment]
          });
        }

        setCommentInput('');
        toast.success('Comment posted!');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment');
    }
  };

  const handleShareReel = async (reelId: string) => {
    try {
      await reelAPI.shareReel(reelId);
      setReels(prevReels =>
        prevReels.map(reel => {
          if (reel.id === reelId) {
            return { ...reel, shares: (reel.shares || 0) + 1 };
          }
          return reel;
        })
      );
      toast.success('Reel shared!');
    } catch (error) {
      console.error('Error sharing reel:', error);
      toast.error('Failed to share reel');
    }
  };

  const handleSharePost = async (postId: string) => {
    try {
      await postAPI.sharePost(postId);
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

  const handleViewReel = async (reel: any) => {
    setSelectedItem(reel);
    try {
      await reelAPI.viewReel(reel.id);
    } catch (error) {
      console.error('Error recording view:', error);
    }
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-10 rounded-lg mb-4 w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h2 className="text-2xl mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Explore
        </h2>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="reels">Reels</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
          </TabsList>

          <TabsContent value="reels" className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {reels.map((reel) => (
                <motion.div
                  key={reel.id}
                  whileHover={{ scale: 0.98 }}
                  className="relative aspect-[9/16] bg-gray-900 rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => handleViewReel(reel)}
                >
                  {reel.thumbnail && (
                    <img
                      src={reel.thumbnail}
                      alt="Reel thumbnail"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                    <div className="absolute top-2 left-2">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 text-white">
                      <div 
                        className="flex items-center gap-2 mb-2 cursor-pointer hover:opacity-75"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewProfile?.(reel.userId);
                        }}
                      >
                        <Avatar className="w-6 h-6 border border-white">
                          <AvatarImage src={reel.userAvatar} />
                          <AvatarFallback>{reel.userName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{reel.userUsername}</span>
                      </div>
                      {reel.caption && (
                        <p className="text-xs line-clamp-2 mb-2">{reel.caption}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {formatCount(reel.likes?.length || 0)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {formatCount(reel.comments?.length || 0)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Play className="w-4 h-4" />
                          {formatCount(reel.views || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {reels.length === 0 && (
              <div className="text-center py-12">
                <Play className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No reels available</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="posts" className="mt-4">
            <div className="grid grid-cols-3 gap-1">
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  whileHover={{ scale: 0.98 }}
                  className="aspect-square bg-gray-100 relative cursor-pointer overflow-hidden group"
                >
                  {post.images && post.images[0] && (
                    <img
                      src={post.images[0]}
                      alt="Post"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLikePost(post.id, post.likes?.includes(currentUser.id));
                      }}
                      className="text-white flex items-center gap-1"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          post.likes?.includes(currentUser.id) ? 'fill-red-500' : ''
                        }`}
                      />
                      <span>{post.likes?.length || 0}</span>
                    </motion.button>
                    <div className="text-white flex items-center gap-1">
                      <MessageCircle className="w-5 h-5" />
                      <span>{post.comments?.length || 0}</span>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSharePost(post.id);
                      }}
                      className="text-white flex items-center gap-1"
                    >
                      <Share2 className="w-5 h-5" />
                      <span>{post.shares || 0}</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {posts.length === 0 && (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No posts available</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Reel Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute top-4 right-4 text-white text-2xl z-10 w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-full"
          >
            ×
          </button>

          <div className="relative w-full max-w-md h-full max-h-[80vh] bg-black">
            {/* Video would go here */}
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
              {selectedItem.thumbnail && (
                <img
                  src={selectedItem.thumbnail}
                  alt="Reel"
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Controls */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute bottom-20 right-4 text-white p-2 bg-black/50 rounded-full"
            >
              {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>

            {/* Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 text-white">
              <div 
                className="flex items-center gap-3 mb-3 cursor-pointer hover:opacity-75"
                onClick={() => {
                  setSelectedItem(null);
                  onViewProfile?.(selectedItem.userId);
                }}
              >
                <Avatar className="w-10 h-10 border-2 border-white">
                  <AvatarImage src={selectedItem.userAvatar} />
                  <AvatarFallback>{selectedItem.userName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p>{selectedItem.userName}</p>
                  <p className="text-xs text-gray-300">@{selectedItem.userUsername}</p>
                </div>
              </div>

              {selectedItem.caption && (
                <p className="mb-3">{selectedItem.caption}</p>
              )}

              <div className="flex items-center gap-6 mb-3">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleLikeReel(selectedItem.id, selectedItem.likes?.includes(currentUser.id))}
                  className="flex flex-col items-center"
                >
                  <Heart
                    className={`w-7 h-7 mb-1 ${
                      selectedItem.likes?.includes(currentUser.id) ? 'fill-red-500 text-red-500' : ''
                    }`}
                  />
                  <span className="text-xs">{formatCount(selectedItem.likes?.length || 0)}</span>
                </motion.button>

                <div className="flex flex-col items-center">
                  <MessageCircle className="w-7 h-7 mb-1" />
                  <span className="text-xs">{formatCount(selectedItem.comments?.length || 0)}</span>
                </div>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleShareReel(selectedItem.id)}
                  className="flex flex-col items-center"
                >
                  <Share2 className="w-7 h-7 mb-1" />
                  <span className="text-xs">{formatCount(selectedItem.shares || 0)}</span>
                </motion.button>
              </div>

              {/* Comments */}
              {selectedItem.comments && selectedItem.comments.length > 0 && (
                <div className="max-h-32 overflow-y-auto mb-3 space-y-2">
                  {selectedItem.comments.slice(-3).map((comment: any) => (
                    <div key={comment.id} className="text-sm">
                      <span 
                        className="cursor-pointer hover:underline"
                        onClick={() => {
                          setSelectedItem(null);
                          onViewProfile?.(comment.userId);
                        }}
                      >
                        {comment.userName}
                      </span>{' '}
                      <span className="text-gray-300">{comment.content}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Comment Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add a comment..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCommentOnReel(selectedItem.id);
                    }
                  }}
                  className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                />
                <Button
                  onClick={() => handleCommentOnReel(selectedItem.id)}
                  disabled={!commentInput.trim()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
