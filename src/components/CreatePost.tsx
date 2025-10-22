import { useState } from 'react';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Image, Video, Smile, MapPin, Users, Calendar, FileText, ImageIcon } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CreatePostProps {
  currentUser: any;
  onCreatePost: (post: any) => void;
}

export function CreatePost({ currentUser, onCreatePost }: CreatePostProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [feeling, setFeeling] = useState('');
  const [location, setLocation] = useState('');
  const [taggedUsers, setTaggedUsers] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setSelectedImages([...selectedImages, ...newImages]);
    }
  };

  const handlePost = () => {
    if (!content.trim() && selectedImages.length === 0) {
      toast.error('Please add some content or images');
      return;
    }

    onCreatePost({
      content,
      images: selectedImages,
      feeling,
      location,
      taggedUsers,
    });

    setContent('');
    setSelectedImages([]);
    setFeeling('');
    setLocation('');
    setTaggedUsers([]);
    setIsOpen(false);
    toast.success('Post created successfully!');
  };

  return (
    <Card className="p-4 shadow-sm">
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src={currentUser.avatar} />
          <AvatarFallback>{currentUser.fullName[0]}</AvatarFallback>
        </Avatar>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button className="flex-1 text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
              What's on your mind, {currentUser.fullName.split(' ')[0]}?
            </button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Post</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* User Info */}
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback>{currentUser.fullName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm">{currentUser.fullName}</p>
                  <select className="text-xs bg-gray-100 border-none rounded px-2 py-1">
                    <option>Public</option>
                    <option>Friends</option>
                    <option>Only me</option>
                  </select>
                </div>
              </div>

              {/* Content */}
              <Textarea
                placeholder={`What's on your mind, ${currentUser.fullName.split(' ')[0]}?`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[150px] resize-none border-0 focus-visible:ring-0 text-lg"
              />

              {/* Image Preview */}
              {selectedImages.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {selectedImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden">
                      <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => setSelectedImages(selectedImages.filter((_, i) => i !== idx))}
                        className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Post Options */}
              <div className="border rounded-lg p-3">
                <p className="text-sm mb-3">Add to your post</p>
                <div className="flex gap-2 flex-wrap">
                  <label className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                    <Image className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                  
                  <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Video className="w-5 h-5 text-red-500" />
                    <span className="text-sm">Video</span>
                  </button>
                  
                  <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Smile className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm">Feeling</span>
                  </button>
                  
                  <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <span className="text-sm">Location</span>
                  </button>
                  
                  <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Users className="w-5 h-5 text-purple-500" />
                    <span className="text-sm">Tag People</span>
                  </button>
                  
                  <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Calendar className="w-5 h-5 text-pink-500" />
                    <span className="text-sm">Event</span>
                  </button>
                </div>
              </div>

              {/* Post Button */}
              <Button 
                onClick={handlePost} 
                className="w-full"
                disabled={!content.trim() && selectedImages.length === 0}
              >
                Post
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 mt-4 pt-4 border-t">
        <label className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
          <Video className="w-5 h-5 text-red-500" />
          <span className="text-sm">Live Video</span>
        </label>
        
        <label className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
          <ImageIcon className="w-5 h-5 text-green-500" />
          <span className="text-sm">Photo/Video</span>
          <input type="file" accept="image/*,video/*" multiple className="hidden" />
        </label>
        
        <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Smile className="w-5 h-5 text-yellow-500" />
          <span className="text-sm">Feeling</span>
        </button>
      </div>
    </Card>
  );
}
