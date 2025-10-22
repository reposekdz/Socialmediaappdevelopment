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
  Bookmark,
  Heart,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { motion } from 'motion/react';

interface ResponsiveLeftSidebarProps {
  currentUser: any;
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}

export function ResponsiveLeftSidebar({ currentUser, currentView, onViewChange, onLogout }: ResponsiveLeftSidebarProps) {
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

  const quickActions = [
    { id: 'story', label: 'Create Story', icon: '📸', gradient: 'from-purple-500 to-pink-500' },
    { id: 'live', label: 'Go Live', icon: '🔴', gradient: 'from-red-500 to-orange-500' },
  ];

  return (
    <div className="sticky top-4 space-y-4 hidden lg:block">
      {/* Logo and Brand */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-4 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl hidden xl:block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            SocialHub
          </span>
        </div>

        <Separator className="mb-4" />

        {/* User Profile Card */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 p-2 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-lg cursor-pointer transition-all" 
          onClick={() => onViewChange('profile')}
        >
          <Avatar className="ring-2 ring-purple-200">
            <AvatarImage src={currentUser.avatar} />
            <AvatarFallback>{currentUser.fullName[0]}</AvatarFallback>
          </Avatar>
          <div className="hidden xl:block flex-1">
            <p className="text-sm">{currentUser.fullName}</p>
            <p className="text-xs text-gray-500">@{currentUser.username}</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl p-2 shadow-sm space-y-2"
      >
        {quickActions.map((action) => (
          <motion.button
            key={action.id}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onViewChange(action.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r ${action.gradient} text-white shadow-lg transition-all`}
          >
            <span className="text-xl">{action.icon}</span>
            <span className="hidden xl:block flex-1 text-left">{action.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Navigation Menu */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-2 shadow-sm space-y-1"
      >
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative overflow-hidden ${
                isActive 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-white' : 'text-gray-600'}`} />
              <span className="hidden xl:block flex-1 text-left relative z-10">{item.label}</span>
              {item.badge && (
                <Badge 
                  variant={isActive ? 'secondary' : 'default'} 
                  className="hidden xl:flex relative z-10 bg-gradient-to-r from-red-500 to-pink-500 border-0"
                >
                  {item.badge}
                </Badge>
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Settings and Logout */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl p-2 shadow-sm space-y-1"
      >
        <motion.button 
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onViewChange('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            currentView === 'settings' 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
              : 'hover:bg-gray-50 text-gray-700'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="hidden xl:block flex-1 text-left">Settings</span>
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="hidden xl:block flex-1 text-left">Logout</span>
        </motion.button>
      </motion.div>
    </div>
  );
}
