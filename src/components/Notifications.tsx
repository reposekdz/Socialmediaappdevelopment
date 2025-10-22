import { useState } from 'react';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Heart, MessageCircle, UserPlus, Users, Video, Calendar, TrendingUp } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface NotificationsProps {
  currentUser: any;
}

export function Notifications({ currentUser }: NotificationsProps) {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'like',
      user: { name: 'Sarah Johnson', username: 'sarahj', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' },
      content: 'liked your post',
      postImage: 'https://images.unsplash.com/photo-1519662978799-2f05096d3636?w=100',
      timestamp: '5 minutes ago',
      read: false,
    },
    {
      id: 2,
      type: 'comment',
      user: { name: 'Mike Chen', username: 'mikechen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike' },
      content: 'commented: "This is amazing! 🎉"',
      postImage: 'https://images.unsplash.com/photo-1617634667039-8e4cb277ab46?w=100',
      timestamp: '15 minutes ago',
      read: false,
    },
    {
      id: 3,
      type: 'follow',
      user: { name: 'Emma Wilson', username: 'emmaw', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma' },
      content: 'started following you',
      timestamp: '1 hour ago',
      read: false,
    },
    {
      id: 4,
      type: 'mention',
      user: { name: 'David Brown', username: 'davidb', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david' },
      content: 'mentioned you in a comment',
      postImage: 'https://images.unsplash.com/photo-1532980400857-e8d9d275d858?w=100',
      timestamp: '2 hours ago',
      read: true,
    },
    {
      id: 5,
      type: 'group',
      user: { name: 'Lisa Anderson', username: 'lisaa', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa' },
      content: 'invited you to join "Photography Lovers" group',
      timestamp: '3 hours ago',
      read: true,
    },
    {
      id: 6,
      type: 'video_call',
      user: { name: 'John Smith', username: 'johnsmith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john' },
      content: 'tried to call you',
      timestamp: '4 hours ago',
      read: true,
    },
    {
      id: 7,
      type: 'event',
      user: { name: 'Tech Community', username: 'techcommunity', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech' },
      content: 'Event "Tech Conference 2025" is tomorrow',
      timestamp: '5 hours ago',
      read: true,
    },
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-red-500 fill-red-500" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-green-500" />;
      case 'mention':
        return <MessageCircle className="w-4 h-4 text-purple-500" />;
      case 'group':
        return <Users className="w-4 h-4 text-orange-500" />;
      case 'video_call':
        return <Video className="w-4 h-4 text-blue-600" />;
      case 'event':
        return <Calendar className="w-4 h-4 text-pink-500" />;
      default:
        return <TrendingUp className="w-4 h-4 text-gray-500" />;
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h2 className="text-xl">Notifications</h2>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600">{unreadCount} unread notifications</p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="border-b px-4">
            <TabsList className="w-full justify-start bg-transparent">
              <TabsTrigger value="all">
                All
                {unreadCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="likes">Likes</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="follows">Follows</TabsTrigger>
              <TabsTrigger value="mentions">Mentions</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="p-0 m-0">
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-blue-50/50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={notification.user.avatar} />
                          <AvatarFallback>{notification.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-white">
                          {getNotificationIcon(notification.type)}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span>{notification.user.name}</span>
                          <span className="text-gray-600 ml-1">{notification.content}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                        
                        {notification.type === 'follow' && (
                          <Button size="sm" className="mt-2">
                            Follow Back
                          </Button>
                        )}
                        
                        {notification.type === 'group' && (
                          <div className="flex gap-2 mt-2">
                            <Button size="sm">Accept</Button>
                            <Button size="sm" variant="outline">Decline</Button>
                          </div>
                        )}
                      </div>
                      
                      {notification.postImage && (
                        <img
                          src={notification.postImage}
                          alt="Post"
                          className="w-12 h-12 rounded object-cover"
                        />
                      )}
                      
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="likes" className="p-0 m-0">
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="divide-y">
                {notifications.filter(n => n.type === 'like').map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${
                      !notification.read ? 'bg-blue-50/50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarImage src={notification.user.avatar} />
                        <AvatarFallback>{notification.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span>{notification.user.name}</span>
                          <span className="text-gray-600 ml-1">{notification.content}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                      </div>
                      {notification.postImage && (
                        <img src={notification.postImage} alt="Post" className="w-12 h-12 rounded object-cover" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="comments" className="p-0 m-0">
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="divide-y">
                {notifications.filter(n => n.type === 'comment').map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${
                      !notification.read ? 'bg-blue-50/50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarImage src={notification.user.avatar} />
                        <AvatarFallback>{notification.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span>{notification.user.name}</span>
                          <span className="text-gray-600 ml-1">{notification.content}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                      </div>
                      {notification.postImage && (
                        <img src={notification.postImage} alt="Post" className="w-12 h-12 rounded object-cover" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="follows" className="p-0 m-0">
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="divide-y">
                {notifications.filter(n => n.type === 'follow').map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${
                      !notification.read ? 'bg-blue-50/50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarImage src={notification.user.avatar} />
                        <AvatarFallback>{notification.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span>{notification.user.name}</span>
                          <span className="text-gray-600 ml-1">{notification.content}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                        <Button size="sm" className="mt-2">Follow Back</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="mentions" className="p-0 m-0">
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="divide-y">
                {notifications.filter(n => n.type === 'mention').map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${
                      !notification.read ? 'bg-blue-50/50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarImage src={notification.user.avatar} />
                        <AvatarFallback>{notification.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span>{notification.user.name}</span>
                          <span className="text-gray-600 ml-1">{notification.content}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                      </div>
                      {notification.postImage && (
                        <img src={notification.postImage} alt="Post" className="w-12 h-12 rounded object-cover" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
