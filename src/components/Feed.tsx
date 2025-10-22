import { useState } from 'react';
import { EnhancedCreatePost } from './EnhancedCreatePost';
import { Stories } from './Stories';
import { Post } from './Post';

interface FeedProps {
  currentUser: any;
  onStartVideoCall: (user: any) => void;
  onStartAudioCall: (user: any) => void;
}

export function Feed({ currentUser, onStartVideoCall, onStartAudioCall }: FeedProps) {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: {
        id: 2,
        name: 'Sarah Johnson',
        username: 'sarahj',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
        verified: true,
      },
      content: 'Just launched my new project! 🚀 So excited to share this with everyone. What do you think?',
      images: ['https://images.unsplash.com/photo-1519662978799-2f05096d3636?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzYxMDQ1MDQzfDA&ixlib=rb-4.1.0&q=80&w=1080'],
      likes: 1234,
      comments: 89,
      shares: 45,
      timestamp: '2 hours ago',
      isLiked: false,
      isSaved: false,
    },
    {
      id: 2,
      user: {
        id: 3,
        name: 'Mike Chen',
        username: 'mikechen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
        verified: false,
      },
      content: 'Beautiful sunset from my hike today 🌅 Nature is truly amazing!',
      images: ['https://images.unsplash.com/photo-1647962431451-d0fdaf1cf21c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHN1bnNldHxlbnwxfHx8fDE3NjEwMDk2OTF8MA&ixlib=rb-4.1.0&q=80&w=1080'],
      likes: 2567,
      comments: 134,
      shares: 78,
      timestamp: '4 hours ago',
      isLiked: true,
      isSaved: false,
    },
    {
      id: 3,
      user: {
        id: 4,
        name: 'Emma Wilson',
        username: 'emmaw',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
        verified: true,
      },
      content: 'Trying out this new recipe! 🍝 Who wants the recipe?',
      images: ['https://images.unsplash.com/photo-1532980400857-e8d9d275d858?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzYxMTI5MzM1fDA&ixlib=rb-4.1.0&q=80&w=1080'],
      likes: 892,
      comments: 56,
      shares: 23,
      timestamp: '6 hours ago',
      isLiked: false,
      isSaved: true,
    },
    {
      id: 4,
      user: {
        id: 5,
        name: 'David Brown',
        username: 'davidb',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
        verified: false,
      },
      content: 'City lights at night never get old 🌃✨',
      images: ['https://images.unsplash.com/photo-1513061379709-ef0cd1695189?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwbmlnaHR8ZW58MXx8fHwxNzYxMDI5NTU4fDA&ixlib=rb-4.1.0&q=80&w=1080'],
      likes: 3421,
      comments: 178,
      shares: 92,
      timestamp: '8 hours ago',
      isLiked: true,
      isSaved: false,
    },
    {
      id: 5,
      user: {
        id: 6,
        name: 'Lisa Anderson',
        username: 'lisaa',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa',
        verified: true,
      },
      content: 'Adventure awaits! 🏔️ Planning my next trip. Where should I go?',
      images: ['https://images.unsplash.com/photo-1528543606781-2f6e6857f318?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBhZHZlbnR1cmV8ZW58MXx8fHwxNzYxMDQwMzA4fDA&ixlib=rb-4.1.0&q=80&w=1080'],
      likes: 1876,
      comments: 203,
      shares: 67,
      timestamp: '12 hours ago',
      isLiked: false,
      isSaved: true,
    },
  ]);

  const handleCreatePost = (newPost: any) => {
    const post = {
      id: posts.length + 1,
      user: currentUser,
      content: newPost.content,
      images: newPost.images,
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: 'Just now',
      isLiked: false,
      isSaved: false,
    };
    setPosts([post, ...posts]);
  };

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleSave = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isSaved: !post.isSaved }
        : post
    ));
  };

  const handleComment = (postId: number, comment: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, comments: post.comments + 1 }
        : post
    ));
  };

  const handleShare = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, shares: post.shares + 1 }
        : post
    ));
  };

  return (
    <div className="space-y-4">
      {/* Stories */}
      <Stories currentUser={currentUser} />
      
      {/* Create Post */}
      <EnhancedCreatePost currentUser={currentUser} onCreatePost={handleCreatePost} />
      
      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            currentUser={currentUser}
            onLike={handleLike}
            onSave={handleSave}
            onComment={handleComment}
            onShare={handleShare}
            onStartVideoCall={onStartVideoCall}
            onStartAudioCall={onStartAudioCall}
          />
        ))}
      </div>
    </div>
  );
}
