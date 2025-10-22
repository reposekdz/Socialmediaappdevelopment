import { useState } from 'react';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MoreHorizontal, Heart, MessageCircle, Share2, Bookmark, Send, Video, Phone } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Separator } from './ui/separator';

interface PostProps {
  post: any;
  currentUser: any;
  onLike: (postId: number) => void;
  onSave: (postId: number) => void;
  onComment: (postId: number, comment: string) => void;
  onShare: (postId: number) => void;
  onStartVideoCall: (user: any) => void;
  onStartAudioCall: (user: any) => void;
}

export function Post({ 
  post, 
  currentUser, 
  onLike, 
  onSave, 
  onComment, 
  onShare,
  onStartVideoCall,
  onStartAudioCall 
}: PostProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      user: { name: 'John Doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john' },
      text: 'This is amazing! 🎉',
      timestamp: '1h ago',
      likes: 12,
    },
    {
      id: 2,
      user: { name: 'Jane Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane' },
      text: 'Love this!',
      timestamp: '30m ago',
      likes: 5,
    },
  ]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      const newComment = {
        id: comments.length + 1,
        user: { name: currentUser.fullName, avatar: currentUser.avatar },
        text: commentText,
        timestamp: 'Just now',
        likes: 0,
      };
      setComments([...comments, newComment]);
      onComment(post.id, commentText);
      setCommentText('');
    }
  };

  return (
    <Card className="shadow-sm overflow-hidden">
      {/* Post Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={post.user.avatar} />
              <AvatarFallback>{post.user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1">
                <p className="text-sm">{post.user.name}</p>
                {post.user.verified && (
                  <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <p className="text-xs text-gray-500">{post.timestamp}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onStartVideoCall(post.user)}
            >
              <Video className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onStartAudioCall(post.user)}
            >
              <Phone className="w-4 h-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Save post</DropdownMenuItem>
                <DropdownMenuItem>Hide post</DropdownMenuItem>
                <DropdownMenuItem>Report post</DropdownMenuItem>
                <DropdownMenuItem>Unfollow @{post.user.username}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Post Content */}
        <p className="mt-3 text-sm">{post.content}</p>
      </div>

      {/* Post Images */}
      {post.images && post.images.length > 0 && (
        <div className={`grid ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-1`}>
          {post.images.map((image: string, idx: number) => (
            <img
              key={idx}
              src={image}
              alt={`Post image ${idx + 1}`}
              className={`w-full ${post.images.length === 1 ? 'max-h-[500px]' : 'aspect-square'} object-cover`}
            />
          ))}
        </div>
      )}

      {/* Post Stats */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <button className="hover:underline">
            {post.likes.toLocaleString()} likes
          </button>
          <div className="flex gap-3">
            <button className="hover:underline" onClick={() => setShowComments(!showComments)}>
              {post.comments} comments
            </button>
            <button className="hover:underline">
              {post.shares} shares
            </button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Post Actions */}
      <div className="px-4 py-2">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            className="flex-1 gap-2"
            onClick={() => onLike(post.id)}
          >
            <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            <span className={post.isLiked ? 'text-red-500' : ''}>Like</span>
          </Button>
          
          <Button
            variant="ghost"
            className="flex-1 gap-2"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="w-5 h-5" />
            Comment
          </Button>
          
          <Button
            variant="ghost"
            className="flex-1 gap-2"
            onClick={() => onShare(post.id)}
          >
            <Share2 className="w-5 h-5" />
            Share
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSave(post.id)}
          >
            <Bookmark className={`w-5 h-5 ${post.isSaved ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <>
          <Separator />
          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={comment.user.avatar} />
                  <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-2xl px-4 py-2">
                    <p className="text-sm">{comment.user.name}</p>
                    <p className="text-sm">{comment.text}</p>
                  </div>
                  <div className="flex gap-3 mt-1 px-4">
                    <button className="text-xs text-gray-500 hover:underline">Like</button>
                    <button className="text-xs text-gray-500 hover:underline">Reply</button>
                    <span className="text-xs text-gray-500">{comment.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Comment Input */}
            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback>{currentUser.fullName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="sm" disabled={!commentText.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
    </Card>
  );
}
