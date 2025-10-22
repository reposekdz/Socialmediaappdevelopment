import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Search as SearchIcon, Users, Hash, Image, Video, TrendingUp } from 'lucide-react';
import { Badge } from './ui/badge';

interface SearchProps {
  currentUser: any;
}

export function Search({ currentUser }: SearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([
    'Photography tips',
    'Travel destinations',
    '@sarahj',
    '#TechNews',
  ]);

  const searchResults = {
    accounts: [
      { id: 1, name: 'Sarah Johnson', username: 'sarahj', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', verified: true, followers: '12.5K' },
      { id: 2, name: 'Mike Chen', username: 'mikechen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', verified: false, followers: '8.2K' },
      { id: 3, name: 'Emma Wilson', username: 'emmaw', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma', verified: true, followers: '45.3K' },
    ],
    hashtags: [
      { tag: 'TechNews', posts: '234K', trending: true },
      { tag: 'Photography', posts: '189K', trending: false },
      { tag: 'Travel', posts: '456K', trending: true },
      { tag: 'FoodLover', posts: '312K', trending: false },
    ],
    posts: [
      { id: 1, image: 'https://images.unsplash.com/photo-1519662978799-2f05096d3636?w=400', user: 'Sarah J.', likes: 1234 },
      { id: 2, image: 'https://images.unsplash.com/photo-1617634667039-8e4cb277ab46?w=400', user: 'Mike C.', likes: 2567 },
      { id: 3, image: 'https://images.unsplash.com/photo-1532980400857-e8d9d275d858?w=400', user: 'Emma W.', likes: 892 },
    ],
  };

  const trendingSearches = [
    { text: 'AI Revolution', icon: TrendingUp, color: 'text-red-500' },
    { text: 'Climate Action', icon: TrendingUp, color: 'text-green-500' },
    { text: 'Tech Conference 2025', icon: TrendingUp, color: 'text-blue-500' },
    { text: 'Fitness Goals', icon: TrendingUp, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <Card className="p-4 shadow-sm">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search for people, posts, hashtags, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-lg"
            autoFocus
          />
        </div>
      </Card>

      {searchQuery ? (
        /* Search Results */
        <Card className="shadow-sm">
          <Tabs defaultValue="all" className="w-full">
            <div className="border-b px-4">
              <TabsList className="w-full justify-start bg-transparent">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="accounts" className="gap-2">
                  <Users className="w-4 h-4" />
                  Accounts
                </TabsTrigger>
                <TabsTrigger value="hashtags" className="gap-2">
                  <Hash className="w-4 h-4" />
                  Hashtags
                </TabsTrigger>
                <TabsTrigger value="posts" className="gap-2">
                  <Image className="w-4 h-4" />
                  Posts
                </TabsTrigger>
                <TabsTrigger value="videos" className="gap-2">
                  <Video className="w-4 h-4" />
                  Videos
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="p-0 m-0">
              <div className="p-4 space-y-6">
                {/* Accounts Section */}
                <div>
                  <h3 className="text-sm mb-3">Accounts</h3>
                  <div className="space-y-3">
                    {searchResults.accounts.slice(0, 3).map((account) => (
                      <div key={account.id} className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={account.avatar} />
                          <AvatarFallback>{account.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="text-sm truncate">{account.name}</p>
                            {account.verified && (
                              <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">@{account.username} • {account.followers}</p>
                        </div>
                        <Button size="sm">Follow</Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hashtags Section */}
                <div>
                  <h3 className="text-sm mb-3">Hashtags</h3>
                  <div className="space-y-2">
                    {searchResults.hashtags.slice(0, 3).map((hashtag) => (
                      <div key={hashtag.tag} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Hash className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm">#{hashtag.tag}</p>
                            <p className="text-xs text-gray-500">{hashtag.posts} posts</p>
                          </div>
                        </div>
                        {hashtag.trending && (
                          <Badge variant="secondary" className="bg-red-100 text-red-700">
                            Trending
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Posts Section */}
                <div>
                  <h3 className="text-sm mb-3">Posts</h3>
                  <div className="grid grid-cols-3 gap-1">
                    {searchResults.posts.map((post) => (
                      <div key={post.id} className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer">
                        <img
                          src={post.image}
                          alt={`Post ${post.id}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="accounts" className="p-4 m-0 space-y-3">
              {searchResults.accounts.map((account) => (
                <div key={account.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                  <Avatar>
                    <AvatarImage src={account.avatar} />
                    <AvatarFallback>{account.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="text-sm truncate">{account.name}</p>
                      {account.verified && (
                        <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">@{account.username} • {account.followers}</p>
                  </div>
                  <Button size="sm">Follow</Button>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="hashtags" className="p-4 m-0 space-y-2">
              {searchResults.hashtags.map((hashtag) => (
                <div key={hashtag.tag} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Hash className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm">#{hashtag.tag}</p>
                      <p className="text-xs text-gray-500">{hashtag.posts} posts</p>
                    </div>
                  </div>
                  {hashtag.trending && (
                    <Badge variant="secondary" className="bg-red-100 text-red-700">
                      Trending
                    </Badge>
                  )}
                </div>
              ))}
            </TabsContent>

            <TabsContent value="posts" className="p-4 m-0">
              <div className="grid grid-cols-3 gap-1">
                {searchResults.posts.map((post) => (
                  <div key={post.id} className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer">
                    <img
                      src={post.image}
                      alt={`Post ${post.id}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="text-white text-sm">{post.likes.toLocaleString()} likes</div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="videos" className="p-4 m-0">
              <div className="grid grid-cols-2 gap-2">
                {searchResults.posts.map((post) => (
                  <div key={post.id} className="relative aspect-[9/16] overflow-hidden rounded-lg group cursor-pointer">
                    <img
                      src={post.image}
                      alt={`Video ${post.id}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <Video className="absolute top-2 right-2 w-5 h-5 text-white drop-shadow-lg" />
                    <div className="absolute bottom-2 left-2 text-white text-sm">
                      {post.likes.toLocaleString()} views
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      ) : (
        /* No Search Query - Show Recent and Trending */
        <div className="space-y-4">
          {/* Recent Searches */}
          <Card className="p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm">Recent</h3>
              <Button variant="link" size="sm" onClick={() => setRecentSearches([])}>
                Clear all
              </Button>
            </div>
            <div className="space-y-2">
              {recentSearches.map((search, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer group"
                  onClick={() => setSearchQuery(search)}
                >
                  <div className="flex items-center gap-3">
                    <SearchIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{search}</span>
                  </div>
                  <button
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setRecentSearches(recentSearches.filter((_, i) => i !== idx));
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Trending Searches */}
          <Card className="p-4 shadow-sm">
            <h3 className="text-sm mb-3">Trending</h3>
            <div className="space-y-3">
              {trendingSearches.map((trend, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  onClick={() => setSearchQuery(trend.text)}
                >
                  <trend.icon className={`w-5 h-5 ${trend.color}`} />
                  <div className="flex-1">
                    <p className="text-sm">{trend.text}</p>
                    <p className="text-xs text-gray-500">Trending now</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
