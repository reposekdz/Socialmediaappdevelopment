import { useState } from 'react';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  Video, 
  Mic, 
  Phone, 
  VideoIcon, 
  MoreVertical, 
  Search,
  Smile,
  File
} from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

interface MessagesProps {
  currentUser: any;
  onStartVideoCall: (user: any) => void;
  onStartAudioCall: (user: any) => void;
}

export function Messages({ currentUser, onStartVideoCall, onStartAudioCall }: MessagesProps) {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const conversations = [
    {
      id: 1,
      user: { id: 2, name: 'Sarah Johnson', username: 'sarahj', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', online: true },
      lastMessage: 'Hey! How are you doing?',
      timestamp: '2m ago',
      unread: 3,
      messages: [
        { id: 1, sender: 'them', text: 'Hey! How are you doing?', timestamp: '10:30 AM', type: 'text' },
        { id: 2, sender: 'me', text: 'Hey Sarah! I\'m great, thanks! How about you?', timestamp: '10:32 AM', type: 'text' },
        { id: 3, sender: 'them', text: 'Doing well! Just finished a project', timestamp: '10:33 AM', type: 'text' },
        { id: 4, sender: 'them', text: 'Check out this photo from my trip!', timestamp: '10:35 AM', type: 'image', media: 'https://images.unsplash.com/photo-1528543606781-2f6e6857f318?w=400' },
        { id: 5, sender: 'me', text: 'Wow, that\'s beautiful! 😍', timestamp: '10:36 AM', type: 'text' },
      ]
    },
    {
      id: 2,
      user: { id: 3, name: 'Mike Chen', username: 'mikechen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', online: false },
      lastMessage: 'Thanks for the help!',
      timestamp: '1h ago',
      unread: 0,
      messages: [
        { id: 1, sender: 'them', text: 'Can you help me with this?', timestamp: '9:00 AM', type: 'text' },
        { id: 2, sender: 'me', text: 'Sure! What do you need?', timestamp: '9:15 AM', type: 'text' },
        { id: 3, sender: 'them', text: 'Thanks for the help!', timestamp: '9:45 AM', type: 'text' },
      ]
    },
    {
      id: 3,
      user: { id: 4, name: 'Emma Wilson', username: 'emmaw', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma', online: true },
      lastMessage: 'See you tomorrow!',
      timestamp: '3h ago',
      unread: 1,
      messages: [
        { id: 1, sender: 'them', text: 'Are we still meeting tomorrow?', timestamp: '8:00 AM', type: 'text' },
        { id: 2, sender: 'me', text: 'Yes! Same time and place', timestamp: '8:30 AM', type: 'text' },
        { id: 3, sender: 'them', text: 'See you tomorrow!', timestamp: '8:35 AM', type: 'text' },
      ]
    },
    {
      id: 4,
      user: { id: 5, name: 'David Brown', username: 'davidb', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david', online: false },
      lastMessage: 'Sent a file: document.pdf',
      timestamp: '1d ago',
      unread: 0,
      messages: [
        { id: 1, sender: 'them', text: 'Here\'s the document you requested', timestamp: 'Yesterday 3:00 PM', type: 'text' },
        { id: 2, sender: 'them', text: 'document.pdf', timestamp: 'Yesterday 3:01 PM', type: 'file', media: 'document.pdf' },
        { id: 3, sender: 'me', text: 'Perfect, thank you!', timestamp: 'Yesterday 3:15 PM', type: 'text' },
      ]
    },
  ];

  const [chats, setChats] = useState(conversations);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedChat) return;

    const newMessage = {
      id: selectedChat.messages.length + 1,
      sender: 'me',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    };

    setChats(chats.map(chat => 
      chat.id === selectedChat.id 
        ? { ...chat, messages: [...chat.messages, newMessage], lastMessage: messageText, timestamp: 'Just now' }
        : chat
    ));

    setSelectedChat({
      ...selectedChat,
      messages: [...selectedChat.messages, newMessage]
    });

    setMessageText('');
  };

  const handleFileUpload = (type: 'image' | 'video' | 'file') => {
    if (!selectedChat) return;
    
    const fileMessage = {
      id: selectedChat.messages.length + 1,
      sender: 'me',
      text: type === 'image' ? 'Sent a photo' : type === 'video' ? 'Sent a video' : 'Sent a file',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: type,
      media: 'https://images.unsplash.com/photo-1519662978799-2f05096d3636?w=400'
    };

    setChats(chats.map(chat => 
      chat.id === selectedChat.id 
        ? { ...chat, messages: [...chat.messages, fileMessage], lastMessage: fileMessage.text, timestamp: 'Just now' }
        : chat
    ));

    setSelectedChat({
      ...selectedChat,
      messages: [...selectedChat.messages, fileMessage]
    });
  };

  const filteredChats = chats.filter(chat => 
    chat.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="shadow-sm h-[calc(100vh-120px)]">
      <div className="grid grid-cols-12 h-full">
        {/* Conversations List */}
        <div className="col-span-4 border-r flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-xl mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b ${
                  selectedChat?.id === chat.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedChat(chat)}
              >
                <div className="flex gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={chat.user.avatar} />
                      <AvatarFallback>{chat.user.name[0]}</AvatarFallback>
                    </Avatar>
                    {chat.user.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-sm truncate">{chat.user.name}</p>
                      <span className="text-xs text-gray-500">{chat.timestamp}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                      {chat.unread > 0 && (
                        <Badge className="ml-2">{chat.unread}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="col-span-8 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={selectedChat.user.avatar} />
                      <AvatarFallback>{selectedChat.user.name[0]}</AvatarFallback>
                    </Avatar>
                    {selectedChat.user.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm">{selectedChat.user.name}</p>
                    <p className="text-xs text-gray-500">
                      {selectedChat.user.online ? 'Active now' : 'Offline'}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onStartAudioCall(selectedChat.user)}
                  >
                    <Phone className="w-5 h-5 text-blue-600" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onStartVideoCall(selectedChat.user)}
                  >
                    <VideoIcon className="w-5 h-5 text-blue-600" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {selectedChat.messages.map((message: any) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-2 max-w-[70%] ${message.sender === 'me' ? 'flex-row-reverse' : ''}`}>
                        {message.sender !== 'me' && (
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={selectedChat.user.avatar} />
                            <AvatarFallback>{selectedChat.user.name[0]}</AvatarFallback>
                          </Avatar>
                        )}
                        <div>
                          {message.type === 'text' && (
                            <div
                              className={`px-4 py-2 rounded-2xl ${
                                message.sender === 'me'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100'
                              }`}
                            >
                              <p className="text-sm">{message.text}</p>
                            </div>
                          )}
                          {message.type === 'image' && (
                            <div className="space-y-2">
                              <img
                                src={message.media}
                                alt="Shared"
                                className="rounded-lg max-w-full"
                              />
                              {message.text !== 'Sent a photo' && (
                                <div
                                  className={`px-4 py-2 rounded-2xl ${
                                    message.sender === 'me'
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-gray-100'
                                  }`}
                                >
                                  <p className="text-sm">{message.text}</p>
                                </div>
                              )}
                            </div>
                          )}
                          {message.type === 'file' && (
                            <div
                              className={`px-4 py-2 rounded-2xl flex items-center gap-2 ${
                                message.sender === 'me'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100'
                              }`}
                            >
                              <File className="w-4 h-4" />
                              <p className="text-sm">{message.text}</p>
                            </div>
                          )}
                          <p
                            className={`text-xs text-gray-500 mt-1 ${
                              message.sender === 'me' ? 'text-right' : ''
                            }`}
                          >
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <div className="flex gap-1">
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleFileUpload('image')}>
                      <ImageIcon className="w-5 h-5 text-blue-600" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleFileUpload('video')}>
                      <Video className="w-5 h-5 text-red-600" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleFileUpload('file')}>
                      <Paperclip className="w-5 h-5 text-gray-600" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="button" variant="ghost" size="sm">
                    <Smile className="w-5 h-5 text-yellow-600" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm">
                    <Mic className="w-5 h-5 text-purple-600" />
                  </Button>
                  <Button type="submit" disabled={!messageText.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

const MessageCircle = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
