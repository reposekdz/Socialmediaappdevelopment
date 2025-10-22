import { useState } from 'react';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  Image, 
  Video, 
  Smile, 
  MapPin, 
  Users, 
  Calendar, 
  ImageIcon,
  BarChart3,
  Music,
  Gift,
  Sparkles,
  Palette,
  Clock,
  Globe,
  Lock,
  UserCheck
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from './ui/badge';

interface EnhancedCreatePostProps {
  currentUser: any;
  onCreatePost: (post: any) => void;
}

export function EnhancedCreatePost({ currentUser, onCreatePost }: EnhancedCreatePostProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [postType, setPostType] = useState<'text' | 'poll' | 'event' | 'feeling'>('text');
  const [privacy, setPrivacy] = useState('public');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollDuration, setPollDuration] = useState(24);
  const [feeling, setFeeling] = useState('');
  const [location, setLocation] = useState('');
  const [taggedUsers, setTaggedUsers] = useState<string[]>([]);
  const [backgroundColor, setBackgroundColor] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [enableComments, setEnableComments] = useState(true);

  const feelings = [
    { emoji: '😊', label: 'Happy' },
    { emoji: '😍', label: 'Loved' },
    { emoji: '😎', label: 'Cool' },
    { emoji: '🎉', label: 'Celebrating' },
    { emoji: '💪', label: 'Strong' },
    { emoji: '🙏', label: 'Grateful' },
    { emoji: '😴', label: 'Tired' },
    { emoji: '🤔', label: 'Thinking' },
  ];

  const backgrounds = [
    'bg-gradient-to-r from-purple-400 via-pink-500 to-red-500',
    'bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-500',
    'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500',
    'bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500',
    'bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500',
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setSelectedImages([...selectedImages, ...newImages]);
    }
  };

  const handlePost = () => {
    if (!content.trim() && selectedImages.length === 0 && postType === 'text') {
      toast.error('Please add some content or images');
      return;
    }

    const postData: any = {
      content,
      images: selectedImages,
      feeling,
      location,
      taggedUsers,
      privacy,
      backgroundColor,
      enableComments,
      type: postType,
    };

    if (postType === 'poll') {
      postData.poll = {
        options: pollOptions.filter(o => o.trim()),
        duration: pollDuration,
      };
    }

    if (scheduledTime) {
      postData.scheduledTime = scheduledTime;
      toast.success('Post scheduled successfully!');
    } else {
      onCreatePost(postData);
      toast.success('Post created successfully!');
    }

    // Reset form
    setContent('');
    setSelectedImages([]);
    setPostType('text');
    setPrivacy('public');
    setPollOptions(['', '']);
    setFeeling('');
    setLocation('');
    setBackgroundColor('');
    setScheduledTime('');
    setIsOpen(false);
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, '']);
    }
  };

  return (
    <Card className="p-4 shadow-lg bg-gradient-to-r from-white to-purple-50">
      <div className="flex gap-3">
        <Avatar className="ring-2 ring-purple-200">
          <AvatarImage src={currentUser.avatar} />
          <AvatarFallback>{currentUser.fullName[0]}</AvatarFallback>
        </Avatar>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-full transition-all shadow-sm"
            >
              <span className="text-gray-500">What's on your mind, {currentUser.fullName.split(' ')[0]}?</span>
            </motion.button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Create Post
              </DialogTitle>
            </DialogHeader>
            
            <Tabs value={postType} onValueChange={(v) => setPostType(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="text">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Text
                </TabsTrigger>
                <TabsTrigger value="poll">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Poll
                </TabsTrigger>
                <TabsTrigger value="event">
                  <Calendar className="w-4 h-4 mr-2" />
                  Event
                </TabsTrigger>
                <TabsTrigger value="feeling">
                  <Smile className="w-4 h-4 mr-2" />
                  Feeling
                </TabsTrigger>
              </TabsList>

              <div className="mt-4 space-y-4">
                {/* User Info & Privacy */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={currentUser.avatar} />
                      <AvatarFallback>{currentUser.fullName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm">{currentUser.fullName}</p>
                      <Select value={privacy} onValueChange={setPrivacy}>
                        <SelectTrigger className="h-7 text-xs bg-gray-100 border-none w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">
                            <div className="flex items-center gap-2">
                              <Globe className="w-3 h-3" />
                              Public
                            </div>
                          </SelectItem>
                          <SelectItem value="friends">
                            <div className="flex items-center gap-2">
                              <UserCheck className="w-3 h-3" />
                              Friends
                            </div>
                          </SelectItem>
                          <SelectItem value="private">
                            <div className="flex items-center gap-2">
                              <Lock className="w-3 h-3" />
                              Only me
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {feeling && (
                    <Badge variant="secondary" className="gap-1">
                      <span>{feelings.find(f => f.label === feeling)?.emoji}</span>
                      Feeling {feeling}
                    </Badge>
                  )}
                </div>

                <TabsContent value="text" className="space-y-4 mt-0">
                  {/* Content */}
                  <div className={`rounded-xl p-4 ${backgroundColor || 'bg-white'}`}>
                    <Textarea
                      placeholder={`What's on your mind, ${currentUser.fullName.split(' ')[0]}?`}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className={`min-h-[150px] resize-none border-0 focus-visible:ring-0 text-lg ${backgroundColor ? 'bg-transparent text-white placeholder:text-white/70' : ''}`}
                    />
                  </div>

                  {/* Background Colors */}
                  {!selectedImages.length && (
                    <div className="flex gap-2 items-center">
                      <Label className="text-sm">Background:</Label>
                      <button
                        onClick={() => setBackgroundColor('')}
                        className={`w-8 h-8 rounded-full border-2 ${!backgroundColor ? 'border-purple-600' : 'border-gray-200'}`}
                      >
                        <svg className="w-full h-full" viewBox="0 0 32 32">
                          <line x1="0" y1="32" x2="32" y2="0" stroke="red" strokeWidth="2"/>
                        </svg>
                      </button>
                      {backgrounds.map((bg, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setBackgroundColor(bg)}
                          className={`w-8 h-8 rounded-full ${bg} ${backgroundColor === bg ? 'ring-2 ring-purple-600 ring-offset-2' : ''}`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Image Preview */}
                  {selectedImages.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-2 gap-2"
                    >
                      {selectedImages.map((img, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          className="relative aspect-square rounded-lg overflow-hidden group"
                        >
                          <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSelectedImages(selectedImages.filter((_, i) => i !== idx))}
                            className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </motion.button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </TabsContent>

                <TabsContent value="poll" className="space-y-4 mt-0">
                  <Textarea
                    placeholder="Ask a question..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                  
                  <div className="space-y-2">
                    <Label>Poll Options</Label>
                    {pollOptions.map((option, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <Input
                          placeholder={`Option ${idx + 1}`}
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...pollOptions];
                            newOptions[idx] = e.target.value;
                            setPollOptions(newOptions);
                          }}
                        />
                      </motion.div>
                    ))}
                    {pollOptions.length < 4 && (
                      <Button variant="outline" size="sm" onClick={addPollOption} className="w-full">
                        + Add Option
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Poll Duration: {pollDuration} hours</Label>
                    <Slider
                      value={[pollDuration]}
                      onValueChange={(v) => setPollDuration(v[0])}
                      min={1}
                      max={168}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="event" className="space-y-4 mt-0">
                  <Input placeholder="Event title" />
                  <Textarea placeholder="Event description..." className="min-h-[100px]" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input type="datetime-local" />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input type="datetime-local" />
                    </div>
                  </div>
                  <Input placeholder="Event location" />
                </TabsContent>

                <TabsContent value="feeling" className="space-y-4 mt-0">
                  <Textarea
                    placeholder="Share how you're feeling..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="grid grid-cols-4 gap-2">
                    {feelings.map((f) => (
                      <motion.button
                        key={f.label}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setFeeling(f.label)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          feeling === f.label
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="text-3xl mb-1">{f.emoji}</div>
                        <div className="text-xs">{f.label}</div>
                      </motion.button>
                    ))}
                  </div>
                </TabsContent>

                {/* Post Options */}
                <div className="border rounded-lg p-3 space-y-3">
                  <p className="text-sm">Add to your post</p>
                  <div className="flex gap-2 flex-wrap">
                    <label className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                      <ImageIcon className="w-5 h-5 text-green-500" />
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
                      <MapPin className="w-5 h-5 text-blue-500" />
                      <span className="text-sm">Location</span>
                    </button>
                    
                    <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Users className="w-5 h-5 text-purple-500" />
                      <span className="text-sm">Tag People</span>
                    </button>

                    <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Music className="w-5 h-5 text-pink-500" />
                      <span className="text-sm">Music</span>
                    </button>

                    <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Gift className="w-5 h-5 text-orange-500" />
                      <span className="text-sm">GIF</span>
                    </button>
                  </div>
                </div>

                {/* Advanced Options */}
                <div className="space-y-3 border-t pt-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="comments" className="text-sm">Allow Comments</Label>
                    <Switch
                      id="comments"
                      checked={enableComments}
                      onCheckedChange={setEnableComments}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Schedule Post (Optional)
                    </Label>
                    <Input
                      type="datetime-local"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                    />
                  </div>
                </div>

                {/* Post Button */}
                <Button 
                  onClick={handlePost} 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  disabled={!content.trim() && selectedImages.length === 0 && postType === 'text'}
                >
                  {scheduledTime ? 'Schedule Post' : 'Post'}
                </Button>
              </div>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 mt-4 pt-4 border-t">
        <motion.label
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-purple-100 rounded-lg cursor-pointer transition-colors"
        >
          <Video className="w-5 h-5 text-red-500" />
          <span className="text-sm">Live Video</span>
        </motion.label>
        
        <motion.label
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-purple-100 rounded-lg cursor-pointer transition-colors"
        >
          <ImageIcon className="w-5 h-5 text-green-500" />
          <span className="text-sm">Photo/Video</span>
          <input type="file" accept="image/*,video/*" multiple className="hidden" />
        </motion.label>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-purple-100 rounded-lg transition-colors"
        >
          <BarChart3 className="w-5 h-5 text-blue-500" />
          <span className="text-sm">Poll</span>
        </motion.button>
      </div>
    </Card>
  );
}
