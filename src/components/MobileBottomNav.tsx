import { Home, Compass, Video, MessageCircle, User, Plus } from 'lucide-react';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';

interface MobileBottomNavProps {
  currentView: string;
  onViewChange: (view: string) => void;
  unreadMessages?: number;
}

export function MobileBottomNav({ currentView, onViewChange, unreadMessages = 12 }: MobileBottomNavProps) {
  const navItems = [
    { id: 'feed', icon: Home, label: 'Home' },
    { id: 'explore', icon: Compass, label: 'Explore' },
    { id: 'create', icon: Plus, label: 'Create' },
    { id: 'reels', icon: Video, label: 'Reels' },
    { id: 'messages', icon: MessageCircle, label: 'Messages', badge: unreadMessages },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl">
      <div className="flex items-center justify-around px-2 py-2 safe-area-bottom">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => onViewChange(item.id)}
              className="relative flex flex-col items-center justify-center p-2 min-w-[60px]"
            >
              <div className="relative">
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveIndicator"
                    className="absolute -inset-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon 
                  className={`w-6 h-6 relative z-10 transition-colors ${
                    isActive 
                      ? 'text-purple-600' 
                      : 'text-gray-600'
                  }`}
                />
                {item.badge && item.badge > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 z-20"
                  >
                    <Badge className="h-5 min-w-[20px] flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-500 border-0 text-xs px-1">
                      {item.badge > 9 ? '9+' : item.badge}
                    </Badge>
                  </motion.div>
                )}
              </div>
              <span className={`text-[10px] mt-1 transition-colors ${
                isActive 
                  ? 'text-purple-600 font-medium' 
                  : 'text-gray-600'
              }`}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
