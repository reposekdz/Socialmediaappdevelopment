import { 
  Home, 
  Compass, 
  Video, 
  MessageCircle, 
  Bell, 
  Users, 
  Search, 
  User, 
  Settings, 
  LogOut,
  BookMarked,
  TrendingUp,
  Calendar,
  Bookmark,
  Heart
} from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface LeftSidebarProps {
  currentUser: any;
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}

export function LeftSidebar({ currentUser, currentView, onViewChange, onLogout }: LeftSidebarProps) {
  const menuItems = [
    { id: 'feed', label: 'Home', icon: Home, badge: null },
    { id: 'search', label: 'Search', icon: Search, badge: null },
    { id: 'explore', label: 'Explore', icon: Compass, badge: null },
    { id: 'reels', label: 'Reels', icon: Video, badge: null },
    { id: 'messages', label: 'Messages', icon: MessageCircle, badge: 12 },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: 5 },
    { id: 'groups', label: 'Groups', icon: Users, badge: 3 },
    { id: 'saved', label: 'Saved', icon: Bookmark, badge: null },
    { id: 'liked', label: 'Liked Posts', icon: Heart, badge: null },
    { id: 'trending', label: 'Trending', icon: TrendingUp, badge: null },
    { id: 'events', label: 'Events', icon: Calendar, badge: null },
  ];

  return (
    <div className="sticky top-4 space-y-4">
      {/* Logo and Brand */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl hidden xl:block">SocialHub</span>
        </div>

        <Separator className="mb-4" />

        {/* User Profile Card */}
        <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors" onClick={() => onViewChange('profile')}>
          <Avatar>
            <AvatarImage src={currentUser.avatar} />
            <AvatarFallback>{currentUser.fullName[0]}</AvatarFallback>
          </Avatar>
          <div className="hidden xl:block flex-1">
            <p className="text-sm">{currentUser.fullName}</p>
            <p className="text-xs text-gray-500">@{currentUser.username}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-white rounded-xl p-2 shadow-sm space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
              <span className="hidden xl:block flex-1 text-left">{item.label}</span>
              {item.badge && (
                <Badge variant={isActive ? 'secondary' : 'default'} className="hidden xl:flex">
                  {item.badge}
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      {/* Settings and Logout */}
      <div className="bg-white rounded-xl p-2 shadow-sm space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors">
          <Settings className="w-5 h-5 text-gray-600" />
          <span className="hidden xl:block flex-1 text-left">Settings</span>
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="hidden xl:block flex-1 text-left">Logout</span>
        </button>
      </div>
    </div>
  );
}
