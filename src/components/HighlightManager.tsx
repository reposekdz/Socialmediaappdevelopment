import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Image as ImageIcon, 
  Video, 
  Check,
  X,
  Search,
  Calendar,
  Star,
  Heart,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HighlightManagerProps {
  open: boolean;
  onClose: () => void;
  currentUser: any;
}

export function HighlightManager({ open, onClose, currentUser }: HighlightManagerProps) {
  const [highlights, setHighlights] = useState([
    {
      id: 1,
      title: 'Travel',
      thumbnail: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400',
      count: 12,
      stories: [
        { id: 1, image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400', type: 'image' },
        { id: 2, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400', type: 'image' },
      ],
      createdAt: '2 weeks ago',
    },
    {
      id: 2,
      title: 'Food',
      thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      count: 8,
      stories: [
        { id: 3, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', type: 'image' },
      ],
      createdAt: '1 week ago',
    },
    {
      id: 3,
      title: 'Fitness',
      thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
      count: 15,
      stories: [
        { id: 4, image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400', type: 'image' },
      ],
      createdAt: '3 days ago',
    },
  ]);

  const [stories, setStories] = useState([
    { id: 1, image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400', type: 'image', selected: false, date: '2024-01-15' },
    { id: 2, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400', type: 'image', selected: false, date: '2024-01-14' },
    { id: 3, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', type: 'image', selected: false, date: '2024-01-13' },
    { id: 4, image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400', type: 'image', selected: false, date: '2024-01-12' },
    { id: 5, image: 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=400', type: 'image', selected: false, date: '2024-01-11' },
    { id: 6, image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400', type: 'image', selected: false, date: '2024-01-10' },
  ]);

  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newHighlightName, setNewHighlightName] = useState('');
  const [selectedHighlight, setSelectedHighlight] = useState<any>(null);
  const [editingHighlight, setEditingHighlight] = useState<any>(null);

  const handleCreateHighlight = () => {
    if (newHighlightName.trim()) {
      const selectedStories = stories.filter(s => s.selected);
      if (selectedStories.length > 0) {
        const newHighlight = {
          id: Date.now(),
          title: newHighlightName,
          thumbnail: selectedStories[0].image,
          count: selectedStories.length,
          stories: selectedStories,
          createdAt: 'Just now',
        };
        setHighlights([...highlights, newHighlight]);
        setNewHighlightName('');
        setIsCreatingNew(false);
        setStories(stories.map(s => ({ ...s, selected: false })));
      }
    }
  };

  const handleDeleteHighlight = (id: number) => {
    setHighlights(highlights.filter(h => h.id !== id));
  };

  const toggleStorySelection = (id: number) => {
    setStories(stories.map(s => 
      s.id === id ? { ...s, selected: !s.selected } : s
    ));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Manage Highlights
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex">
          {/* Highlights List */}
          <div className="w-1/3 border-r p-6">
            <div className="space-y-4">
              <Button
                onClick={() => setIsCreatingNew(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Highlight
              </Button>

              <ScrollArea className="h-[calc(80vh-180px)]">
                <div className="space-y-3">
                  {highlights.map((highlight, idx) => (
                    <motion.div
                      key={highlight.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedHighlight(highlight)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedHighlight?.id === highlight.id
                          ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-16 h-20 rounded-xl overflow-hidden ring-2 ring-purple-200">
                            <img
                              src={highlight.thumbnail}
                              alt={highlight.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Badge className="absolute -bottom-1 -right-1 bg-gradient-to-r from-purple-600 to-pink-600 border-0 text-xs">
                            {highlight.count}
                          </Badge>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{highlight.title}</p>
                          <p className="text-xs text-gray-500">{highlight.createdAt}</p>
                        </div>
                        <div className="flex gap-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingHighlight(highlight);
                            }}
                            className="p-1 hover:bg-white rounded"
                          >
                            <Edit className="w-4 h-4 text-purple-600" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteHighlight(highlight.id);
                            }}
                            className="p-1 hover:bg-white rounded"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {isCreatingNew ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg">Create New Highlight</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsCreatingNew(false);
                      setStories(stories.map(s => ({ ...s, selected: false })));
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <Input
                  placeholder="Highlight name (e.g., Travel, Food, Fitness)"
                  value={newHighlightName}
                  onChange={(e) => setNewHighlightName(e.target.value)}
                  className="mb-4"
                />

                <p className="text-sm text-gray-600">
                  Select stories to add ({stories.filter(s => s.selected).length} selected)
                </p>

                <ScrollArea className="h-[calc(80vh-300px)]">
                  <div className="grid grid-cols-3 gap-3">
                    {stories.map((story) => (
                      <motion.div
                        key={story.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleStorySelection(story.id)}
                        className={`relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer ${
                          story.selected ? 'ring-4 ring-purple-600' : 'ring-1 ring-gray-200'
                        }`}
                      >
                        <img
                          src={story.image}
                          alt="Story"
                          className="w-full h-full object-cover"
                        />
                        {story.selected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center"
                          >
                            <Check className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                          <p className="text-white text-xs">{story.date}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>

                <Button
                  onClick={handleCreateHighlight}
                  disabled={!newHighlightName.trim() || stories.filter(s => s.selected).length === 0}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Highlight
                </Button>
              </div>
            ) : selectedHighlight ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-20 rounded-xl overflow-hidden ring-2 ring-purple-200">
                      <img
                        src={selectedHighlight.thumbnail}
                        alt={selectedHighlight.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg">{selectedHighlight.title}</h3>
                      <p className="text-sm text-gray-500">
                        {selectedHighlight.count} stories • {selectedHighlight.createdAt}
                      </p>
                    </div>
                  </div>
                </div>

                <ScrollArea className="h-[calc(80vh-230px)]">
                  <div className="grid grid-cols-3 gap-3">
                    {selectedHighlight.stories.map((story: any, idx: number) => (
                      <motion.div
                        key={story.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        className="relative aspect-[9/16] rounded-xl overflow-hidden group cursor-pointer"
                      >
                        <img
                          src={story.image}
                          alt="Story"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                          <motion.button
                            initial={{ opacity: 0, scale: 0 }}
                            whileHover={{ opacity: 1, scale: 1 }}
                            className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Plus className="w-4 h-4 mr-2" />
                    Add More Stories
                  </Button>
                  <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">
                    <Star className="w-4 h-4 mr-2" />
                    Set as Featured
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <Sparkles className="w-16 h-16 mb-4" />
                <p className="text-lg">Select a highlight to view</p>
                <p className="text-sm">or create a new one</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
