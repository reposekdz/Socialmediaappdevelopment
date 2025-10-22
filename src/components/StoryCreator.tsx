import { useState, useRef } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { 
  X, 
  Type, 
  Smile, 
  PenTool, 
  Image as ImageIcon, 
  Sparkles,
  Music,
  MapPin,
  Tag,
  Clock,
  Palette,
  Eraser,
  Undo,
  Redo,
  Download,
  Share2,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';

interface StoryCreatorProps {
  onClose: () => void;
  onPublish: (story: any) => void;
}

export function StoryCreator({ onClose, onPublish }: StoryCreatorProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [textElements, setTextElements] = useState<Array<{ 
    id: number; 
    text: string; 
    x: number; 
    y: number; 
    color: string;
    fontSize: number;
    rotation: number;
  }>>([]);
  const [stickers, setStickers] = useState<Array<{ 
    id: number; 
    emoji: string; 
    x: number; 
    y: number; 
    scale: number;
    rotation: number;
  }>>([]);
  const [drawings, setDrawings] = useState<Array<any>>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(5);
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(32);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const backgroundColors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  ];

  const stickerEmojis = [
    '😀', '😂', '😍', '🥳', '😎', '🔥', '💯', '✨',
    '❤️', '💕', '🎉', '🎊', '🌟', '⭐', '💫', '🎈',
    '🎁', '🎂', '🍕', '🍔', '🎮', '🎵', '📷', '✈️'
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTextElement = () => {
    const newText = {
      id: Date.now(),
      text: 'Tap to edit',
      x: 50,
      y: 50,
      color: textColor,
      fontSize: fontSize,
      rotation: 0,
    };
    setTextElements([...textElements, newText]);
  };

  const addSticker = (emoji: string) => {
    const newSticker = {
      id: Date.now(),
      emoji,
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0,
    };
    setStickers([...stickers, newSticker]);
  };

  const handlePublish = () => {
    const story = {
      image: selectedImage,
      textElements,
      stickers,
      drawings,
      timestamp: Date.now(),
    };
    onPublish(story);
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
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="text-white"
        >
          <X className="w-6 h-6" />
        </motion.button>
        <h2 className="text-white text-lg">Create Story</h2>
        <Button
          onClick={handlePublish}
          disabled={!selectedImage && textElements.length === 0}
          className="bg-white text-purple-600 hover:bg-gray-100"
        >
          Share
        </Button>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative bg-gray-900 overflow-hidden">
        {/* Background or Image */}
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="Story"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: backgroundColors[0] }}
          />
        )}

        {/* Text Elements */}
        <AnimatePresence>
          {textElements.map((textEl) => (
            <motion.div
              key={textEl.id}
              drag
              dragMomentum={false}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileHover={{ scale: 1.1 }}
              style={{
                position: 'absolute',
                left: `${textEl.x}%`,
                top: `${textEl.y}%`,
                color: textEl.color,
                fontSize: `${textEl.fontSize}px`,
                transform: `rotate(${textEl.rotation}deg)`,
                cursor: 'move',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              }}
              className="select-none font-bold"
            >
              {textEl.text}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Stickers */}
        <AnimatePresence>
          {stickers.map((sticker) => (
            <motion.div
              key={sticker.id}
              drag
              dragMomentum={false}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ 
                scale: sticker.scale, 
                rotate: sticker.rotation 
              }}
              exit={{ scale: 0, rotate: 180 }}
              whileHover={{ scale: sticker.scale * 1.2 }}
              whileTap={{ scale: sticker.scale * 0.9 }}
              style={{
                position: 'absolute',
                left: `${sticker.x}%`,
                top: `${sticker.y}%`,
                fontSize: '64px',
                cursor: 'move',
              }}
              className="select-none"
            >
              {sticker.emoji}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Drawing Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ mixBlendMode: 'normal' }}
        />
      </div>

      {/* Bottom Tools */}
      <div className="bg-gray-900 border-t border-gray-700">
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="w-full bg-gray-800 grid grid-cols-5">
            <TabsTrigger value="background" className="data-[state=active]:bg-purple-600">
              <Palette className="w-5 h-5" />
            </TabsTrigger>
            <TabsTrigger value="text" className="data-[state=active]:bg-purple-600">
              <Type className="w-5 h-5" />
            </TabsTrigger>
            <TabsTrigger value="stickers" className="data-[state=active]:bg-purple-600">
              <Smile className="w-5 h-5" />
            </TabsTrigger>
            <TabsTrigger value="draw" className="data-[state=active]:bg-purple-600">
              <PenTool className="w-5 h-5" />
            </TabsTrigger>
            <TabsTrigger value="media" className="data-[state=active]:bg-purple-600">
              <ImageIcon className="w-5 h-5" />
            </TabsTrigger>
          </TabsList>

          {/* Background Tab */}
          <TabsContent value="background" className="p-4">
            <div className="space-y-3">
              <p className="text-white text-sm">Choose Background</p>
              <ScrollArea className="w-full">
                <div className="flex gap-2 pb-2">
                  <label className="w-16 h-16 flex-shrink-0 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center cursor-pointer hover:border-purple-500 transition-colors">
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {backgroundColors.map((gradient, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedImage(null)}
                      className="w-16 h-16 flex-shrink-0 rounded-lg"
                      style={{ background: gradient }}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          {/* Text Tab */}
          <TabsContent value="text" className="p-4">
            <div className="space-y-3">
              <Button
                onClick={addTextElement}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
              >
                <Type className="w-4 h-4 mr-2" />
                Add Text
              </Button>

              <div className="space-y-2">
                <label className="text-white text-sm">Text Color</label>
                <div className="flex gap-2">
                  {['#ffffff', '#000000', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'].map((color) => (
                    <motion.button
                      key={color}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setTextColor(color)}
                      className={`w-10 h-10 rounded-full border-2 ${
                        textColor === color ? 'border-white' : 'border-gray-600'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-white text-sm">Font Size: {fontSize}px</label>
                <Slider
                  value={[fontSize]}
                  onValueChange={(v) => setFontSize(v[0])}
                  min={16}
                  max={72}
                  step={2}
                  className="w-full"
                />
              </div>
            </div>
          </TabsContent>

          {/* Stickers Tab */}
          <TabsContent value="stickers" className="p-4">
            <div className="space-y-3">
              <p className="text-white text-sm">Add Stickers</p>
              <ScrollArea className="h-48">
                <div className="grid grid-cols-8 gap-2">
                  {stickerEmojis.map((emoji, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.2, rotate: 15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => addSticker(emoji)}
                      className="text-4xl hover:bg-white/10 rounded-lg p-2 transition-colors"
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          {/* Draw Tab */}
          <TabsContent value="draw" className="p-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-white text-sm">Brush Color</label>
                <div className="flex gap-2">
                  {['#ffffff', '#000000', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'].map((color) => (
                    <motion.button
                      key={color}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setCurrentColor(color)}
                      className={`w-10 h-10 rounded-full border-2 ${
                        currentColor === color ? 'border-white' : 'border-gray-600'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-white text-sm">Brush Size: {brushSize}px</label>
                <Slider
                  value={[brushSize]}
                  onValueChange={(v) => setBrushSize(v[0])}
                  min={1}
                  max={50}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Undo className="w-4 h-4 mr-2" />
                  Undo
                </Button>
                <Button variant="outline" className="flex-1">
                  <Eraser className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="p-4">
            <div className="space-y-2">
              <Button className="w-full" variant="outline">
                <Music className="w-4 h-4 mr-2" />
                Add Music
              </Button>
              <Button className="w-full" variant="outline">
                <MapPin className="w-4 h-4 mr-2" />
                Add Location
              </Button>
              <Button className="w-full" variant="outline">
                <Tag className="w-4 h-4 mr-2" />
                Tag People
              </Button>
              <Button className="w-full" variant="outline">
                <Clock className="w-4 h-4 mr-2" />
                Add Countdown
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}
