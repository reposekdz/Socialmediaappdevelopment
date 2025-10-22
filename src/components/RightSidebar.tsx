import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, Hash, Users, Calendar, MapPin, ExternalLink } from 'lucide-react';
import { Separator } from './ui/separator';

interface RightSidebarProps {
  currentUser: any;
}

export function RightSidebar({ currentUser }: RightSidebarProps) {
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());

  const trends = [
    { id: 1, tag: 'TechNews', posts: '125K', category: 'Technology' },
    { id: 2, tag: 'WorldCup2025', posts: '890K', category: 'Sports' },
    { id: 3, tag: 'ClimateAction', posts: '456K', category: 'Environment' },
    { id: 4, tag: 'AIRevolution', posts: '234K', category: 'Technology' },
    { id: 5, tag: 'FitnessGoals', posts: '178K', category: 'Health' },
    { id: 6, tag: 'TravelTuesday', posts: '92K', category: 'Travel' },
  ];

  const suggestedUsers = [
    { id: 1, name: 'Sarah Johnson', username: 'sarahj', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', verified: true, followers: '12.5K' },
    { id: 2, name: 'Mike Chen', username: 'mikechen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', verified: false, followers: '8.2K' },
    { id: 3, name: 'Emma Wilson', username: 'emmaw', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma', verified: true, followers: '45.3K' },
    { id: 4, name: 'David Brown', username: 'davidb', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david', verified: false, followers: '5.7K' },
    { id: 5, name: 'Lisa Anderson', username: 'lisaa', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa', verified: true, followers: '28.9K' },
  ];

  const sponsoredAds = [
    {
      id: 1,
      brand: 'TechGear Pro',
      description: 'Premium tech accessories for modern lifestyle',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=200&fit=crop',
      cta: 'Shop Now'
    },
    {
      id: 2,
      brand: 'FitLife Plus',
      description: 'Transform your fitness journey with our app',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=200&fit=crop',
      cta: 'Try Free'
    },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Tech Conference 2025', date: 'Oct 28, 2025', location: 'San Francisco', attendees: 2500 },
    { id: 2, title: 'Community Meetup', date: 'Oct 30, 2025', location: 'Virtual', attendees: 450 },
  ];

  const handleFollowToggle = (userId: string) => {
    setFollowedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  return (
    <div className="sticky top-4 space-y-4">
      {/* Trending Topics */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Trending Now
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trends.map((trend) => (
            <div 
              key={trend.id} 
              className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-gray-400" />
                    <span>{trend.tag}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{trend.posts} posts</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {trend.category}
                </Badge>
              </div>
            </div>
          ))}
          <Button variant="link" className="w-full">
            Show more trends
          </Button>
        </CardContent>
      </Card>

      {/* Sponsored Ads */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm text-gray-500">Sponsored</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sponsoredAds.map((ad) => (
            <div key={ad.id} className="space-y-2">
              <img 
                src={ad.image} 
                alt={ad.brand}
                className="w-full h-32 object-cover rounded-lg"
              />
              <div>
                <p>{ad.brand}</p>
                <p className="text-sm text-gray-600">{ad.description}</p>
              </div>
              <Button className="w-full" size="sm">
                {ad.cta}
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
              <Separator />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Who to Follow */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Who to Follow
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {suggestedUsers.map((user) => (
            <div key={user.id} className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="text-sm truncate">{user.name}</p>
                  {user.verified && (
                    <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <p className="text-xs text-gray-500">@{user.username} • {user.followers}</p>
              </div>
              <Button 
                size="sm" 
                variant={followedUsers.has(user.id.toString()) ? "outline" : "default"}
                onClick={() => handleFollowToggle(user.id.toString())}
              >
                {followedUsers.has(user.id.toString()) ? 'Following' : 'Follow'}
              </Button>
            </div>
          ))}
          <Button variant="link" className="w-full">
            Show more suggestions
          </Button>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <p className="text-sm">{event.title}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                <MapPin className="w-3 h-3" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                <Users className="w-3 h-3" />
                <span>{event.attendees} attending</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Footer Links */}
      <div className="text-xs text-gray-500 space-y-2 px-4">
        <div className="flex flex-wrap gap-2">
          <a href="#" className="hover:underline">About</a>
          <span>•</span>
          <a href="#" className="hover:underline">Help</a>
          <span>•</span>
          <a href="#" className="hover:underline">Privacy</a>
          <span>•</span>
          <a href="#" className="hover:underline">Terms</a>
        </div>
        <p>© 2025 SocialHub. All rights reserved.</p>
      </div>
    </div>
  );
}
