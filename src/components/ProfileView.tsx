import { useState, useEffect } from 'react';
import { ArrowLeft, MoreHorizontal, Grid, Film, Bookmark, UserPlus, UserCheck, MessageCircle, Settings, Share2, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card } from './ui/card';
import { toast } from 'sonner@2.0.3';
import { userAPI, postAPI, reelAPI } from '../utils/api';
import { motion } from 'motion/react';

interface ProfileViewProps {
  userId: string;
  currentUser: any;
  onClose: () => void;
  onMessageClick?: (user: any) => void;
}

export function ProfileView({ userId, currentUser, onClose, onMessageClick }: ProfileViewProps) {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [reels, setReels] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    loadUserProfile();
  }, [userId]);

  const loadUserProfile = async () => {
    setIsLoading(true);
    try {
      const userResponse = await userAPI.getUser(userId);
      if (userResponse.success) {
        setUser(userResponse.user);
        setIsFollowing(currentUser.following?.includes(userId) || false);
      }

      const postsResponse = await postAPI.getUserPosts(userId);
      if (postsResponse.success) {
        setPosts(postsResponse.posts);
      }

      const reelsResponse = await reelAPI.getUserReels(userId);
      if (reelsResponse.success) {
        setReels(reelsResponse.reels);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await userAPI.unfollowUser(userId);
        setIsFollowing(false);
        toast.success(`Unfollowed ${user.username}`);
      } else {
        await userAPI.followUser(userId);
        setIsFollowing(true);
        toast.success(`Following ${user.username}`);
      }
      // Reload user data to update follower count
      loadUserProfile();
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast.error('Failed to update follow status');
    }
  };

  const handleMessage = () => {
    if (onMessageClick && user) {
      onMessageClick(user);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">User not found</p>
          <Button onClick={onClose} className="mt-4">Go Back</Button>
        </div>
      </div>
    );
  }

  const isOwnProfile = userId === currentUser.id;

  return (
    <motion.div
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ type: 'spring', damping: 25 }}
      className="fixed inset-0 bg-white z-50 overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2>{user.username}</h2>
            <p className="text-sm text-gray-600">@{user.username}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>

      {/* Cover Photo */}
      <div className="relative h-48 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
        {user.coverPhoto && (
          <img src={user.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
        )}
      </div>

      {/* Profile Info */}
      <div className="px-4 pb-4">
        <div className="flex items-end justify-between -mt-16 mb-4">
          <Avatar className="w-32 h-32 border-4 border-white">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-3xl">
              {user.name?.charAt(0) || user.username?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          {!isOwnProfile && (
            <div className="flex gap-2">
              <Button
                onClick={handleFollow}
                className={isFollowing 
                  ? "bg-gray-200 text-gray-800 hover:bg-gray-300" 
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                }
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="w-4 h-4 mr-2" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Follow
                  </>
                )}
              </Button>
              <Button onClick={handleMessage} variant="outline">
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl">{user.name}</h1>
            {user.isVerified && (
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <p className="text-gray-600 mb-3">{user.bio || 'No bio yet'}</p>
          
          {user.website && (
            <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
              {user.website}
            </a>
          )}
          
          {user.location && (
            <p className="text-gray-600 text-sm mt-1">📍 {user.location}</p>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-6 pb-4 border-b border-gray-200">
          <div className="text-center">
            <div className="text-xl">{posts.length}</div>
            <div className="text-sm text-gray-600">Posts</div>
          </div>
          <div className="text-center cursor-pointer hover:opacity-75">
            <div className="text-xl">{user.followers?.length || 0}</div>
            <div className="text-sm text-gray-600">Followers</div>
          </div>
          <div className="text-center cursor-pointer hover:opacity-75">
            <div className="text-xl">{user.following?.length || 0}</div>
            <div className="text-sm text-gray-600">Following</div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-around border-b border-gray-200 rounded-none bg-transparent h-12">
          <TabsTrigger value="posts" className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-purple-600 rounded-none">
            <Grid className="w-5 h-5" />
          </TabsTrigger>
          <TabsTrigger value="reels" className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-purple-600 rounded-none">
            <Film className="w-5 h-5" />
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-purple-600 rounded-none">
            <Bookmark className="w-5 h-5" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-0">
          <div className="grid grid-cols-3 gap-1">
            {posts.length > 0 ? (
              posts.map((post) => (
                <motion.div
                  key={post.id}
                  whileHover={{ scale: 0.98 }}
                  className="aspect-square bg-gray-100 relative cursor-pointer overflow-hidden"
                >
                  {post.images && post.images[0] && (
                    <img 
                      src={post.images[0]} 
                      alt="Post" 
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center gap-4 opacity-0 hover:opacity-100">
                    <div className="text-white flex items-center gap-1">
                      <span>❤️</span>
                      <span>{post.likes?.length || 0}</span>
                    </div>
                    <div className="text-white flex items-center gap-1">
                      <span>💬</span>
                      <span>{post.comments?.length || 0}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <Camera className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-600">No posts yet</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reels" className="mt-0">
          <div className="grid grid-cols-3 gap-1">
            {reels.length > 0 ? (
              reels.map((reel) => (
                <motion.div
                  key={reel.id}
                  whileHover={{ scale: 0.98 }}
                  className="aspect-[9/16] bg-gray-100 relative cursor-pointer overflow-hidden"
                >
                  {reel.thumbnail && (
                    <img 
                      src={reel.thumbnail} 
                      alt="Reel" 
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute bottom-2 left-2 text-white flex items-center gap-1">
                    <Film className="w-4 h-4" />
                    <span className="text-sm">{reel.views || 0}</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <Film className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-600">No reels yet</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="saved" className="mt-0">
          <div className="text-center py-12">
            <Bookmark className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600">Only you can see what you've saved</p>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
