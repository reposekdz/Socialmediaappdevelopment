import { useState, useRef } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { 
  X, 
  Video,
  Music,
  Sparkles,
  Scissors,
  Play,
  Pause,
  RotateCw,
  Volume2,
  VolumeX,
  Filter,
  Type,
  Smile,
  Upload,
  Check,
  Wand2,
  Zap,
  Timer,
  FastForward,
  Rewind
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

interface ReelsCreatorProps {
  onClose: () => void;
  onPublish: (reel: any) => void;
}

export function ReelsCreator({ onClose, onPublish }: ReelsCreatorProps) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(60);
  const [speed, setSpeed] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const filters = [
    { id: 'none', name: 'Original', gradient: 'bg-gray-100' },
    { id: 'vintage', name: 'Vintage', gradient: 'bg-gradient-to-br from-yellow-700 to-orange-800' },
    { id: 'cool', name: 'Cool', gradient: 'bg-gradient-to-br from-blue-400 to-purple-600' },
    { id: 'warm', name: 'Warm', gradient: 'bg-gradient-to-br from-orange-400 to-pink-600' },
    { id: 'dramatic', name: 'Dramatic', gradient: 'bg-gradient-to-br from-gray-900 to-gray-600' },
    { id: 'vibrant', name: 'Vibrant', gradient: 'bg-gradient-to-br from-pink-500 to-yellow-500' },
    { id: 'noir', name: 'Noir', gradient: 'bg-gradient-to-br from-black to-gray-400' },
    { id: 'sunset', name: 'Sunset', gradient: 'bg-gradient-to-br from-orange-600 to-purple-700' },
  ];

  const musicTracks = [
    { id: '1', name: 'Summer Vibes', artist: 'DJ Cool', duration: '3:24', trending: true },
    { id: '2', name: 'Chill Beats', artist: 'Lo-Fi Master', duration: '2:45', trending: false },
    { id: '3', name: 'Epic Moment', artist: 'Orchestral Mix', duration: '4:12', trending: true },
    { id: '4', name: 'Dance Energy', artist: 'EDM Remix', duration: '3:56', trending: false },
    { id: '5', name: 'Acoustic Dreams', artist: 'Guitar Studio', duration: '3:02', trending: true },
  ];

  const speedOptions = [
    { value: 0.5, label: '0.5x', icon: Rewind },
    { value: 1, label: '1x', icon: Play },
    { value: 1.5, label: '1.5x', icon: FastForward },
    { value: 2, label: '2x', icon: Zap },
  ];

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedVideo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = () => {
    const reel = {
      video: selectedVideo,
      caption,
      filter: selectedFilter,
      music: selectedMusic,
      speed,
      timestamp: Date.now(),
    };
    onPublish(reel);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 flex flex-col"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-white"
          >
            <X className="w-6 h-6" />
          </motion.button>
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-white" />
            <h2 className="text-white text-lg">Create Reel</h2>
          </div>
        </div>
        <Button
          onClick={handlePublish}
          disabled={!selectedVideo}
          className="bg-white text-purple-600 hover:bg-gray-100"
        >
          <Check className="w-4 h-4 mr-2" />
          Publish
        </Button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Video Preview */}
        <div className="flex-1 bg-gray-900 relative flex items-center justify-center">
          {selectedVideo ? (
            <>
              <video
                ref={videoRef}
                src={selectedVideo}
                className={`max-h-full max-w-full object-contain ${
                  selectedFilter ? `filter-${selectedFilter}` : ''
                }`}
                loop
                muted={isMuted}
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              />

              {/* Video Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="space-y-3">
                  {/* Progress Bar */}
                  <div className="flex items-center gap-3">
                    <span className="text-white text-sm min-w-[40px]">
                      {Math.floor(currentTime)}s
                    </span>
                    <Progress 
                      value={(currentTime / duration) * 100} 
                      className="flex-1 h-1"
                    />
                    <span className="text-white text-sm min-w-[40px]">
                      {Math.floor(duration)}s
                    </span>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 text-white" />
                      ) : (
                        <Play className="w-6 h-6 text-white ml-1" />
                      )}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsMuted(!isMuted)}
                      className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5 text-white" />
                      ) : (
                        <Volume2 className="w-5 h-5 text-white" />
                      )}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 180 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                    >
                      <RotateCw className="w-5 h-5 text-white" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Filter Badge */}
              {selectedFilter && selectedFilter !== 'none' && (
                <motion.div
                  initial={{ scale: 0, y: -20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="absolute top-4 right-4"
                >
                  <Badge className="bg-white/20 backdrop-blur-sm border-white/40 text-white">
                    <Filter className="w-3 h-3 mr-1" />
                    {filters.find(f => f.id === selectedFilter)?.name}
                  </Badge>
                </motion.div>
              )}

              {/* Music Badge */}
              {selectedMusic && (
                <motion.div
                  initial={{ scale: 0, x: 20 }}
                  animate={{ scale: 1, x: 0 }}
                  className="absolute bottom-20 right-4"
                >
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 border-0 text-white">
                    <Music className="w-3 h-3 mr-1" />
                    {musicTracks.find(m => m.id === selectedMusic)?.name}
                  </Badge>
                </motion.div>
              )}
            </>
          ) : (
            <label className="flex flex-col items-center gap-4 cursor-pointer">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-32 h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center"
              >
                <Upload className="w-16 h-16 text-white" />
              </motion.div>
              <div className="text-center">
                <p className="text-white text-lg">Upload Video</p>
                <p className="text-gray-400 text-sm">Max 60 seconds</p>
              </div>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Editing Panel */}
        <div className="w-full lg:w-96 bg-gray-900 border-t lg:border-l lg:border-t-0 border-gray-700">
          <Tabs defaultValue="filters" className="h-full flex flex-col">
            <TabsList className="w-full bg-gray-800 grid grid-cols-4 rounded-none">
              <TabsTrigger value="filters" className="data-[state=active]:bg-purple-600">
                <Filter className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="music" className="data-[state=active]:bg-purple-600">
                <Music className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="effects" className="data-[state=active]:bg-purple-600">
                <Sparkles className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="text" className="data-[state=active]:bg-purple-600">
                <Type className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>

            {/* Filters Tab */}
            <TabsContent value="filters" className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                <h3 className="text-white">Video Filters</h3>
                <ScrollArea className="h-48">
                  <div className="grid grid-cols-3 gap-3">
                    {filters.map((filter) => (
                      <motion.button
                        key={filter.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedFilter(filter.id)}
                        className={`aspect-square rounded-lg ${filter.gradient} flex flex-col items-center justify-center relative overflow-hidden ${
                          selectedFilter === filter.id ? 'ring-2 ring-white' : ''
                        }`}
                      >
                        <span className="text-white text-xs text-center px-1">{filter.name}</span>
                        {selectedFilter === filter.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-1 right-1 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center"
                          >
                            <Check className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </ScrollArea>

                <div className="space-y-3">
                  <h4 className="text-white text-sm">Speed</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {speedOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <motion.button
                          key={option.value}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSpeed(option.value)}
                          className={`p-3 rounded-lg flex flex-col items-center gap-1 ${
                            speed === option.value
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                              : 'bg-gray-800'
                          }`}
                        >
                          <Icon className="w-4 h-4 text-white" />
                          <span className="text-white text-xs">{option.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Music Tab */}
            <TabsContent value="music" className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-white">Add Music</h3>
                  <Button size="sm" variant="outline" className="text-xs">
                    Browse All
                  </Button>
                </div>

                <div className="space-y-2">
                  {musicTracks.map((track) => (
                    <motion.button
                      key={track.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedMusic(track.id)}
                      className={`w-full p-3 rounded-lg flex items-center gap-3 transition-colors ${
                        selectedMusic === track.id
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Music className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <p className="text-white text-sm">{track.name}</p>
                          {track.trending && (
                            <Badge className="bg-orange-500 border-0 text-xs px-1 py-0">
                              🔥
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-400 text-xs">{track.artist} • {track.duration}</p>
                      </div>
                      {selectedMusic === track.id && (
                        <Check className="w-5 h-5 text-white flex-shrink-0" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Effects Tab */}
            <TabsContent value="effects" className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                <h3 className="text-white">Special Effects</h3>
                
                <div className="grid grid-cols-3 gap-3">
                  {['✨ Sparkle', '🌟 Stars', '❤️ Hearts', '🔥 Fire', '💫 Magic', '⚡ Lightning'].map((effect, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="aspect-square bg-gray-800 hover:bg-gray-700 rounded-lg flex flex-col items-center justify-center gap-2"
                    >
                      <span className="text-2xl">{effect.split(' ')[0]}</span>
                      <span className="text-white text-xs">{effect.split(' ')[1]}</span>
                    </motion.button>
                  ))}
                </div>

                <div className="space-y-2">
                  <h4 className="text-white text-sm">AI Enhancements</h4>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                    <Wand2 className="w-4 h-4 mr-2" />
                    Auto Enhance
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Smart Transitions
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Text Tab */}
            <TabsContent value="text" className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                <h3 className="text-white">Add Caption</h3>
                
                <Input
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />

                <div className="space-y-2">
                  <h4 className="text-white text-sm">Quick Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {['#Trending', '#Viral', '#Fun', '#Love', '#Amazing', '#Cool'].map((tag) => (
                      <motion.button
                        key={tag}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCaption(caption + ' ' + tag)}
                        className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-full text-purple-400 text-sm"
                      >
                        {tag}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  <Smile className="w-4 h-4 mr-2" />
                  Add Stickers
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
}
