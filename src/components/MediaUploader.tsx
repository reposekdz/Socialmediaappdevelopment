import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Upload, 
  Image as ImageIcon, 
  Video, 
  Music,
  File,
  X,
  Check,
  Camera,
  Folder,
  Cloud,
  Sparkles,
  Tag,
  MapPin,
  Users,
  Lock,
  Globe,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface MediaUploaderProps {
  open: boolean;
  onClose: () => void;
  onUpload: (media: any) => void;
  type?: 'image' | 'video' | 'all';
}

export function MediaUploader({ open, onClose, onUpload, type = 'all' }: MediaUploaderProps) {
  const [files, setFiles] = useState<Array<{ 
    id: number; 
    file: File; 
    preview: string; 
    type: string;
    progress: number;
    status: 'pending' | 'uploading' | 'complete' | 'error';
  }>>([]);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFiles = selectedFiles.map((file, idx) => ({
      id: Date.now() + idx,
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'file',
      progress: 0,
      status: 'pending' as const,
    }));
    setFiles([...files, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const newFiles = droppedFiles.map((file, idx) => ({
      id: Date.now() + idx,
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'file',
      progress: 0,
      status: 'pending' as const,
    }));
    setFiles([...files, ...newFiles]);
  };

  const handleRemoveFile = (id: number) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleUpload = () => {
    // Simulate upload
    setFiles(files.map(f => ({ ...f, status: 'uploading' })));
    
    files.forEach((file, idx) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, progress } : f
        ));
        
        if (progress >= 100) {
          clearInterval(interval);
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, status: 'complete' } : f
          ));
        }
      }, 100);
    });

    setTimeout(() => {
      onUpload({
        files,
        caption,
        location,
        tags,
        privacy,
      });
      onClose();
    }, 2000);
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return <ImageIcon className="w-8 h-8" />;
      case 'video':
        return <Video className="w-8 h-8" />;
      default:
        return <File className="w-8 h-8" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploading':
        return 'bg-blue-500';
      case 'complete':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[85vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0 bg-gradient-to-r from-purple-50 to-pink-50">
          <DialogTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
            <Upload className="w-5 h-5 text-purple-600" />
            Upload Media
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs defaultValue="upload" className="flex-1 flex flex-col">
            <TabsList className="mx-6 mt-4">
              <TabsTrigger value="upload">
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </TabsTrigger>
              <TabsTrigger value="camera">
                <Camera className="w-4 h-4 mr-2" />
                Camera
              </TabsTrigger>
              <TabsTrigger value="cloud">
                <Cloud className="w-4 h-4 mr-2" />
                Cloud Storage
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="flex-1 p-6 pt-4 overflow-y-auto">
              <div className="space-y-6">
                {/* Drop Zone */}
                <motion.div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  whileHover={{ scale: 1.01 }}
                  className="border-2 border-dashed border-purple-300 rounded-xl p-12 bg-gradient-to-br from-purple-50 to-pink-50 cursor-pointer hover:border-purple-500 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center gap-4">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center"
                    >
                      <Upload className="w-10 h-10 text-white" />
                    </motion.div>
                    <div className="text-center">
                      <p className="text-lg mb-2">Drag & Drop files here</p>
                      <p className="text-sm text-gray-500">or click to browse</p>
                      <p className="text-xs text-gray-400 mt-2">Supports: Images, Videos (Max 100MB)</p>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : 'image/*,video/*'}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </motion.div>

                {/* Selected Files */}
                {files.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm">Selected Files ({files.length})</h3>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setFiles([])}
                      >
                        Clear All
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {files.map((file, idx) => (
                        <motion.div
                          key={file.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="relative group"
                        >
                          <Card className="overflow-hidden">
                            <div className="aspect-square relative">
                              {file.type === 'image' ? (
                                <img
                                  src={file.preview}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                              ) : file.type === 'video' ? (
                                <video
                                  src={file.preview}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                  {getFileIcon(file.type)}
                                </div>
                              )}

                              {/* Status Overlay */}
                              {file.status !== 'pending' && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                  {file.status === 'uploading' && (
                                    <div className="text-center">
                                      <Progress value={file.progress} className="w-24 mb-2" />
                                      <p className="text-white text-sm">{file.progress}%</p>
                                    </div>
                                  )}
                                  {file.status === 'complete' && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center"
                                    >
                                      <Check className="w-8 h-8 text-white" />
                                    </motion.div>
                                  )}
                                </div>
                              )}

                              {/* Remove Button */}
                              <motion.button
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                                onClick={() => handleRemoveFile(file.id)}
                                className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-4 h-4 text-white" />
                              </motion.button>
                            </div>

                            <div className="p-2">
                              <p className="text-xs truncate">{file.file.name}</p>
                              <p className="text-xs text-gray-500">
                                {(file.file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Details */}
                {files.length > 0 && (
                  <div className="space-y-4 border-t pt-4">
                    <div className="space-y-2">
                      <label className="text-sm">Caption</label>
                      <Textarea
                        placeholder="Write a caption..."
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Location
                        </label>
                        <Input
                          placeholder="Add location..."
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          Privacy
                        </label>
                        <Select value={privacy} onValueChange={setPrivacy}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">
                              <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4" />
                                Public
                              </div>
                            </SelectItem>
                            <SelectItem value="friends">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Friends
                              </div>
                            </SelectItem>
                            <SelectItem value="private">
                              <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                Only Me
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Tags
                      </label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add tag..."
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                        />
                        <Button onClick={handleAddTag}>Add</Button>
                      </div>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {tags.map((tag) => (
                            <Badge
                              key={tag}
                              className="bg-gradient-to-r from-purple-600 to-pink-600 border-0"
                            >
                              #{tag}
                              <button
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-2"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="camera" className="flex-1 p-6 overflow-y-auto">
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Camera access coming soon</p>
                  <Button className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600">
                    Enable Camera
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cloud" className="flex-1 p-6 overflow-y-auto">
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Cloud className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Connect to cloud storage</p>
                  <div className="flex gap-2 mt-4 justify-center">
                    <Button variant="outline">Google Drive</Button>
                    <Button variant="outline">Dropbox</Button>
                    <Button variant="outline">OneDrive</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        {files.length > 0 && (
          <div className="p-6 border-t bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {files.length} file{files.length > 1 ? 's' : ''} selected
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpload}
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                  disabled={files.some(f => f.status === 'uploading')}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload {files.length} File{files.length > 1 ? 's' : ''}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
