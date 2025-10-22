import { useState } from 'react';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, TrendingUp, Users, Image as ImageIcon, Video, Hash } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

interface ExploreProps {
  currentUser: any;
}

export function Explore({ currentUser }: ExploreProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const explorePosts = [
    { id: 1, image: 'https://images.unsplash.com/photo-1519662978799-2f05096d3636?w=400', likes: 1234, comments: 89, type: 'image' },
    { id: 2, image: 'https://images.unsplash.com/photo-1617634667039-8e4cb277ab46?w=400', likes: 2567, comments: 134, type: 'image' },
    { id: 3, image: 'https://images.unsplash.com/photo-1532980400857-e8d9d275d858?w=400', likes: 892, comments: 56, type: 'video' },
    { id: 4, image: 'https://images.unsplash.com/photo-1513061379709-ef0cd1695189?w=400', likes: 3421, comments: 178, type: 'image' },
    { id: 5, image: 'https://images.unsplash.com/photo-1528543606781-2f6e6857f318?w=400', likes: 1876, comments: 203, type: 'image' },
    { id: 6, image: 'https://images.unsplash.com/photo-1647962431451-d0fdaf1cf21c?w=400', likes: 4532, comments: 312, type: 'video' },
    { id: 7, image: 'https://images.unsplash.com/photo-1519662978799-2f05096d3636?w=400', likes: 1567, comments: 98, type: 'image' },
    { id: 8, image: 'https://images.unsplash.com/photo-1617634667039-8e4cb277ab46?w=400', likes: 2890, comments: 167, type: 'image' },
    { id: 9, image: 'https://images.unsplash.com/photo-1532980400857-e8d9d275d858?w=400', likes: 1234, comments: 89, type: 'video' },
  ];

  const trendingTopics = [
    { tag: 'TechInnovation', posts: '234K', growth: '+12%' },
    { tag: 'HealthyLiving', posts: '189K', growth: '+8%' },
    { tag: 'TravelGoals', posts: '456K', growth: '+15%' },
    { tag: 'FoodieLife', posts: '312K', growth: '+10%' },
    { tag: 'FitnessJourney', posts: '278K', growth: '+6%' },
  ];

  const suggestedAccounts = [
    { id: 1, name: 'Tech Daily', username: 'techdaily', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=techdaily', followers: '125K', verified: true },
    { id: 2, name: 'Food Lover', username: 'foodlover', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=foodlover', followers: '89K', verified: false },
    { id: 3, name: 'Travel Guide', username: 'travelguide', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=travelguide', followers: '234K', verified: true },
    { id: 4, name: 'Fitness Pro', username: 'fitnesspro', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fitnesspro', followers: '156K', verified: true },
  ];

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <Card className="p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search for people, posts, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Explore Tabs */}
      <Card className="shadow-sm">
        <Tabs defaultValue="all" className="w-full">
          <div className="border-b px-4">
            <TabsList className="w-full justify-start bg-transparent">
              <TabsTrigger value="all" className="gap-2">
                <TrendingUp className="w-4 h-4" />
                All
              </TabsTrigger>
              <TabsTrigger value="posts" className="gap-2">
                <ImageIcon className="w-4 h-4" />
                Posts
              </TabsTrigger>
              <TabsTrigger value="reels" className="gap-2">
                <Video className="w-4 h-4" />
                Reels
              </TabsTrigger>
              <TabsTrigger value="people" className="gap-2">
                <Users className="w-4 h-4" />
                People
              </TabsTrigger>
              <TabsTrigger value="topics" className="gap-2">
                <Hash className="w-4 h-4" />
                Topics
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="p-0 m-0">
            <div className="p-4 space-y-4">
              {/* Trending Topics Section */}
              <div>
                <h3 className="text-sm mb-3">Trending Topics</h3>
                <div className="flex gap-2 flex-wrap">
                  {trendingTopics.slice(0, 3).map((topic) => (
                    <Badge key={topic.tag} variant="secondary" className="px-3 py-2 cursor-pointer hover:bg-gray-200">
                      #{topic.tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Explore Grid */}
              <div className="grid grid-cols-3 gap-1">
                {explorePosts.map((post) => (
                  <div
                    key={post.id}
                    className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer"
                  >
                    <img
                      src={post.image}
                      alt={`Post ${post.id}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {post.type === 'video' && (
                      <div className="absolute top-2 right-2">
                        <Video className="w-5 h-5 text-white drop-shadow-lg" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-4 text-white">
                        <div className="flex items-center gap-1">
                          <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          </svg>
                          <span>{post.likes.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                          </svg>
                          <span>{post.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="posts" className="p-4 m-0">
            <div className="grid grid-cols-3 gap-1">
              {explorePosts.filter(p => p.type === 'image').map((post) => (
                <div
                  key={post.id}
                  className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer"
                >
                  <img
                    src={post.image}
                    alt={`Post ${post.id}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-4 text-white">
                      <div className="flex items-center gap-1">
                        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        <span>{post.likes.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reels" className="p-4 m-0">
            <div className="grid grid-cols-3 gap-1">
              {explorePosts.filter(p => p.type === 'video').map((post) => (
                <div
                  key={post.id}
                  className="relative aspect-[9/16] overflow-hidden rounded-lg group cursor-pointer"
                >
                  <img
                    src={post.image}
                    alt={`Reel ${post.id}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <Video className="w-5 h-5 text-white drop-shadow-lg" />
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 text-white">
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                      <span>{(post.likes / 1000).toFixed(1)}K</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="people" className="p-4 m-0 space-y-3">
            {suggestedAccounts.map((account) => (
              <div key={account.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={account.avatar} />
                  <AvatarFallback>{account.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <p className="text-sm">{account.name}</p>
                    {account.verified && (
                      <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">@{account.username} • {account.followers} followers</p>
                </div>
                <Button size="sm">Follow</Button>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="topics" className="p-4 m-0 space-y-3">
            {trendingTopics.map((topic) => (
              <div key={topic.tag} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Hash className="w-5 h-5 text-gray-400" />
                      <p>{topic.tag}</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{topic.posts} posts</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {topic.growth}
                  </Badge>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
