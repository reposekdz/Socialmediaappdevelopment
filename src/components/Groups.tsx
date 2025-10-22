import { useState } from 'react';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Users, Search, Globe, Lock, TrendingUp, Plus, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface GroupsProps {
  currentUser: any;
}

export function Groups({ currentUser }: GroupsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<any>(null);

  const myGroups = [
    {
      id: 1,
      name: 'Photography Lovers',
      description: 'Share your best shots and learn from pros',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=photo',
      cover: 'https://images.unsplash.com/photo-1519662978799-2f05096d3636?w=400',
      members: 12500,
      posts: 3421,
      privacy: 'public',
      role: 'admin',
      category: 'Hobbies',
    },
    {
      id: 2,
      name: 'Tech Enthusiasts',
      description: 'Discuss latest tech trends and innovations',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech',
      cover: 'https://images.unsplash.com/photo-1519662978799-2f05096d3636?w=400',
      members: 8900,
      posts: 2156,
      privacy: 'public',
      role: 'member',
      category: 'Technology',
    },
    {
      id: 3,
      name: 'Fitness Journey',
      description: 'Motivate each other to reach fitness goals',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fitness',
      cover: 'https://images.unsplash.com/photo-1528543606781-2f6e6857f318?w=400',
      members: 6780,
      posts: 1890,
      privacy: 'private',
      role: 'member',
      category: 'Health & Fitness',
    },
  ];

  const suggestedGroups = [
    {
      id: 4,
      name: 'Travel Explorers',
      description: 'Share travel stories and destination tips',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=travel',
      cover: 'https://images.unsplash.com/photo-1528543606781-2f6e6857f318?w=400',
      members: 15600,
      posts: 4523,
      privacy: 'public',
      category: 'Travel',
    },
    {
      id: 5,
      name: 'Cooking Masters',
      description: 'Exchange recipes and cooking techniques',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cooking',
      cover: 'https://images.unsplash.com/photo-1532980400857-e8d9d275d858?w=400',
      members: 11200,
      posts: 3890,
      privacy: 'public',
      category: 'Food & Cooking',
    },
    {
      id: 6,
      name: 'Book Club',
      description: 'Read, discuss, and review books together',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=books',
      cover: 'https://images.unsplash.com/photo-1617634667039-8e4cb277ab46?w=400',
      members: 7890,
      posts: 2345,
      privacy: 'public',
      category: 'Literature',
    },
  ];

  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    privacy: 'public',
    category: '',
  });

  const handleCreateGroup = () => {
    console.log('Creating group:', newGroup);
    setCreateGroupOpen(false);
    setNewGroup({ name: '', description: '', privacy: 'public', category: '' });
  };

  return (
    <div className="space-y-4">
      {/* Header with Search and Create */}
      <Card className="p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Dialog open={createGroupOpen} onOpenChange={setCreateGroupOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Group</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="group-name">Group Name</Label>
                  <Input
                    id="group-name"
                    placeholder="Enter group name"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="group-description">Description</Label>
                  <Textarea
                    id="group-description"
                    placeholder="Describe your group"
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="group-category">Category</Label>
                  <Select value={newGroup.category} onValueChange={(value) => setNewGroup({ ...newGroup, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="hobbies">Hobbies</SelectItem>
                      <SelectItem value="health">Health & Fitness</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="food">Food & Cooking</SelectItem>
                      <SelectItem value="literature">Literature</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="group-privacy">Privacy</Label>
                  <Select value={newGroup.privacy} onValueChange={(value) => setNewGroup({ ...newGroup, privacy: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Anyone can join</SelectItem>
                      <SelectItem value="private">Private - Invite only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button onClick={handleCreateGroup} className="w-full">
                  Create Group
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      {/* Groups Tabs */}
      <Card className="shadow-sm">
        <Tabs defaultValue="my-groups" className="w-full">
          <div className="border-b px-4">
            <TabsList className="w-full justify-start bg-transparent">
              <TabsTrigger value="my-groups">
                My Groups
                <Badge variant="secondary" className="ml-2">{myGroups.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="discover">Discover</TabsTrigger>
              <TabsTrigger value="invitations">
                Invitations
                <Badge className="ml-2">2</Badge>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="my-groups" className="p-4 m-0 space-y-4">
            {myGroups.map((group) => (
              <Card key={group.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-32 overflow-hidden">
                  <img src={group.cover} alt={group.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <div className="flex gap-3">
                    <Avatar className="w-16 h-16 -mt-12 border-4 border-white">
                      <AvatarImage src={group.avatar} />
                      <AvatarFallback>{group.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 mt-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3>{group.name}</h3>
                            {group.privacy === 'private' ? (
                              <Lock className="w-4 h-4 text-gray-500" />
                            ) : (
                              <Globe className="w-4 h-4 text-gray-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{group.description}</p>
                        </div>
                        {group.role === 'admin' && (
                          <Button variant="ghost" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="flex gap-4 mt-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{group.members.toLocaleString()} members</span>
                        </div>
                        <div>
                          <span>{group.posts.toLocaleString()} posts</span>
                        </div>
                        <Badge variant="secondary">{group.category}</Badge>
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        <Button size="sm">View Group</Button>
                        <Button size="sm" variant="outline">Activity</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="discover" className="p-4 m-0 space-y-4">
            <div className="grid gap-4">
              {suggestedGroups.map((group) => (
                <Card key={group.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-32 overflow-hidden">
                    <img src={group.cover} alt={group.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <div className="flex gap-3">
                      <Avatar className="w-16 h-16 -mt-12 border-4 border-white">
                        <AvatarImage src={group.avatar} />
                        <AvatarFallback>{group.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 mt-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3>{group.name}</h3>
                              {group.privacy === 'private' ? (
                                <Lock className="w-4 h-4 text-gray-500" />
                              ) : (
                                <Globe className="w-4 h-4 text-gray-500" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{group.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-4 mt-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{group.members.toLocaleString()} members</span>
                          </div>
                          <div>
                            <span>{group.posts.toLocaleString()} posts</span>
                          </div>
                          <Badge variant="secondary">{group.category}</Badge>
                        </div>
                        
                        <div className="flex gap-2 mt-3">
                          <Button size="sm">Join Group</Button>
                          <Button size="sm" variant="outline">Preview</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="invitations" className="p-4 m-0 space-y-4">
            <Card className="p-4">
              <div className="flex gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=design" />
                  <AvatarFallback>DG</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3>Design Professionals</h3>
                  <p className="text-sm text-gray-600">Sarah Johnson invited you to join</p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm">Accept</Button>
                    <Button size="sm" variant="outline">Decline</Button>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=gaming" />
                  <AvatarFallback>GM</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3>Gaming Community</h3>
                  <p className="text-sm text-gray-600">Mike Chen invited you to join</p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm">Accept</Button>
                    <Button size="sm" variant="outline">Decline</Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
