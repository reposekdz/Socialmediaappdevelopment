import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card } from './ui/card';
import { Plus, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface StoriesProps {
  currentUser: any;
}

export function Stories({ currentUser }: StoriesProps) {
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [storyProgress, setStoryProgress] = useState(0);

  const stories = [
    {
      id: 0,
      user: currentUser,
      isAddStory: true,
    },
    {
      id: 1,
      user: { name: 'Sarah Johnson', username: 'sarahj', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' },
      image: 'https://images.unsplash.com/photo-1519662978799-2f05096d3636?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzYxMDQ1MDQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      timestamp: '2h ago',
      viewed: false,
    },
    {
      id: 2,
      user: { name: 'Mike Chen', username: 'mikechen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike' },
      image: 'https://images.unsplash.com/photo-1617634667039-8e4cb277ab46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzYxMDY0MjE1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      timestamp: '4h ago',
      viewed: true,
    },
    {
      id: 3,
      user: { name: 'Emma Wilson', username: 'emmaw', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma' },
      image: 'https://images.unsplash.com/photo-1532980400857-e8d9d275d858?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzYxMTI5MzM1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      timestamp: '6h ago',
      viewed: false,
    },
    {
      id: 4,
      user: { name: 'David Brown', username: 'davidb', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david' },
      image: 'https://images.unsplash.com/photo-1513061379709-ef0cd1695189?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwbmlnaHR8ZW58MXx8fHwxNzYxMDI5NTU4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      timestamp: '8h ago',
      viewed: false,
    },
    {
      id: 5,
      user: { name: 'Lisa Anderson', username: 'lisaa', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa' },
      image: 'https://images.unsplash.com/photo-1528543606781-2f6e6857f318?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBhZHZlbnR1cmV8ZW58MXx8fHwxNzYxMDQwMzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      timestamp: '10h ago',
      viewed: true,
    },
  ];

  const handleStoryClick = (story: any) => {
    if (story.isAddStory) {
      // Handle add story
      return;
    }
    setSelectedStory(story);
    setStoryProgress(0);
    
    // Auto-advance story progress
    const interval = setInterval(() => {
      setStoryProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setSelectedStory(null);
          return 0;
        }
        return prev + 2;
      });
    }, 100);
  };

  return (
    <>
      <Card className="p-4 shadow-sm">
        <div className="flex gap-4 overflow-x-auto pb-2">
          {stories.map((story) => (
            <div
              key={story.id}
              className="flex-shrink-0 cursor-pointer"
              onClick={() => handleStoryClick(story)}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`relative ${story.isAddStory ? '' : story.viewed ? 'p-[2px]' : 'p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-2xl'}`}>
                  <div className="w-20 h-28 rounded-2xl overflow-hidden border-2 border-white bg-gradient-to-br from-gray-100 to-gray-200 relative">
                    {story.isAddStory ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={story.user.avatar} />
                          <AvatarFallback>{story.user.name?.[0] || '?'}</AvatarFallback>
                        </Avatar>
                      </div>
                    ) : (
                      <>
                        <img 
                          src={story.image} 
                          alt="Story" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <Avatar className="w-8 h-8 border-2 border-white">
                            <AvatarImage src={story.user.avatar} />
                            <AvatarFallback>{story.user.name[0]}</AvatarFallback>
                          </Avatar>
                        </div>
                      </>
                    )}
                    {story.isAddStory && (
                      <div className="absolute bottom-2 right-2 w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center border-2 border-white">
                        <Plus className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-xs max-w-[80px] truncate">
                  {story.isAddStory ? 'Your Story' : story.user.name.split(' ')[0]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Story Viewer Dialog */}
      <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
        <DialogContent className="max-w-md p-0 bg-black border-0">
          {selectedStory && (
            <div className="relative h-[600px]">
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 right-0 z-10 p-2">
                <Progress value={storyProgress} className="h-1" />
              </div>

              {/* User Info */}
              <div className="absolute top-6 left-0 right-0 z-10 flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                  <Avatar className="w-10 h-10 border-2 border-white">
                    <AvatarImage src={selectedStory.user.avatar} />
                    <AvatarFallback>{selectedStory.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white text-sm">{selectedStory.user.name}</p>
                    <p className="text-white/70 text-xs">{selectedStory.timestamp}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  onClick={() => setSelectedStory(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Story Image */}
              <img
                src={selectedStory.image}
                alt="Story"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
