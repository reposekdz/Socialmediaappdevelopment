import { useState, useRef, useEffect } from 'react';
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
  File,
  Gift,
  MapPin,
  Camera,
  Music,
  Heart,
  ThumbsUp,
  Laugh,
  Frown,
  Check,
  CheckCheck
} from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { motion, AnimatePresence } from 'motion/react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface EnhancedMessagesProps {
  currentUser: any;
  onStartVideoCall: (user: any) => void;
  onStartAudioCall: (user: any) => void;
}

export function EnhancedMessages({ currentUser, onStartVideoCall, onStartAudioCall }: EnhancedMessagesProps) {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversations = [
    {
      id: 1,
      user: { id: 2, name: 'Sarah Johnson', username: 'sarahj', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', online: true, lastSeen: 'Active now' },
      lastMessage: 'Hey! How are you doing?',
      timestamp: '2m ago',
      unread: 3,
      isPinned: true,
      messages: [
        { id: 1, sender: 'them', text: 'Hey! How are you doing?', timestamp: '10:30 AM', type: 'text', status: 'read' },
        { id: 2, sender: 'me', text: 'Hey Sarah! I\'m great, thanks! How about you?', timestamp: '10:32 AM', type: 'text', status: 'read' },
        { id: 3, sender: 'them', text: 'Doing well! Just finished a project', timestamp: '10:33 AM', type: 'text', status: 'read' },
        { id: 4, sender: 'them', text: 'Check out this photo from my trip!', timestamp: '10:35 AM', type: 'image', media: 'https://images.unsplash.com/photo-1528543606781-2f6e6857f318?w=400', status: 'read' },
        { id: 5, sender: 'me', text: 'Wow, that\'s beautiful! 😍', timestamp: '10:36 AM', type: 'text', status: 'delivered', reactions: [{ emoji: '❤️', users: ['them'] }] },
        { id: 6, sender: 'them', text: '', timestamp: '10:37 AM', type: 'voice', duration: '0:15', media: 'voice_note.mp3', status: 'read' },
      ]
    },
    {
      id: 2,
      user: { id: 3, name: 'Mike Chen', username: 'mikechen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', online: false, lastSeen: '30m ago' },
      lastMessage: 'Thanks for the help!',
      timestamp: '1h ago',
      unread: 0,
      isPinned: false,
      messages: [
        { id: 1, sender: 'them', text: 'Can you help me with this?', timestamp: '9:00 AM', type: 'text', status: 'read' },
        { id: 2, sender: 'me', text: 'Sure! What do you need?', timestamp: '9:15 AM', type: 'text', status: 'read' },
        { id: 3, sender: 'them', text: 'Thanks for the help!', timestamp: '9:45 AM', type: 'text', status: 'read' },
      ]
    },
  ];

  const [chats, setChats] = useState(conversations);

  useEffect(() => {
    if (selectedChat && isTyping) {
      const timer = setTimeout(() => setIsTyping(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [selectedChat, isTyping]);

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setRecordingDuration(0);
    }
  }, [isRecording]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat?.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedChat) return;

    const newMessage = {
      id: selectedChat.messages.length + 1,
      sender: 'me',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      status: 'sent'
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
    
    // Simulate typing indicator
    setTimeout(() => setIsTyping(true), 1000);
  };

  const handleVoiceRecord = () => {
    if (isRecording) {
      // Stop recording
      const voiceMessage = {
        id: selectedChat.messages.length + 1,
        sender: 'me',
        text: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'voice',
        duration: `0:${recordingDuration.toString().padStart(2, '0')}`,
        media: 'voice_note.mp3',
        status: 'sent'
      };

      setChats(chats.map(chat => 
        chat.id === selectedChat.id 
          ? { ...chat, messages: [...chat.messages, voiceMessage], lastMessage: '🎤 Voice message', timestamp: 'Just now' }
          : chat
      ));

      setSelectedChat({
        ...selectedChat,
        messages: [...selectedChat.messages, voiceMessage]
      });
    }
    setIsRecording(!isRecording);
  };

  const handleReaction = (messageId: number, emoji: string) => {
    setSelectedChat({
      ...selectedChat,
      messages: selectedChat.messages.map((msg: any) =>
        msg.id === messageId
          ? {
              ...msg,
              reactions: msg.reactions
                ? [...msg.reactions, { emoji, users: ['me'] }]
                : [{ emoji, users: ['me'] }]
            }
          : msg
      )
    });
  };

  const emojis = ['😀', '😂', '😍', '🔥', '👍', '❤️', '🎉', '😢', '😮', '🤔'];

  const formatDuration = (seconds: number) => `0:${seconds.toString().padStart(2, '0')}`;

  const filteredChats = chats.filter(chat => 
    chat.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="shadow-lg h-[calc(100vh-120px)] overflow-hidden">
      <div className="grid grid-cols-12 h-full">
        {/* Conversations List */}
        <div className="col-span-4 border-r flex flex-col bg-gradient-to-b from-purple-50 to-white">
          <div className="p-4 border-b bg-white">
            <h2 className="text-xl mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Messages
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-0"
              />
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <AnimatePresence>
              {filteredChats.map((chat, idx) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`p-4 hover:bg-white cursor-pointer transition-all border-b relative ${
                    selectedChat?.id === chat.id ? 'bg-white shadow-sm' : ''
                  }`}
                  onClick={() => setSelectedChat(chat)}
                >
                  {chat.isPinned && (
                    <div className="absolute top-2 right-2">
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L11 4.323V3a1 1 0 011-1h-2zm-5 8.274l-.818 2.552c-.25.78.409 1.574 1.228 1.574H14.59c.819 0 1.478-.793 1.228-1.574L15 10.274V6a1 1 0 112 0v4.274l.818 2.552c.25.78-.409 1.574-1.228 1.574H5.41c-.819 0-1.478-.793-1.228-1.574L5 10.274V6a1 1 0 012 0v4.274z"/>
                      </svg>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <div className="relative">
                      <Avatar className="w-14 h-14 border-2 border-white shadow-sm">
                        <AvatarImage src={chat.user.avatar} />
                        <AvatarFallback>{chat.user.name[0]}</AvatarFallback>
                      </Avatar>
                      {chat.user.online && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="text-sm truncate">{chat.user.name}</p>
                        <span className="text-xs text-gray-500">{chat.timestamp}</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                        {chat.unread > 0 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-2"
                          >
                            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 border-0">
                              {chat.unread}
                            </Badge>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="col-span-8 flex flex-col bg-white">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12 border-2 border-purple-200">
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
                      {isTyping ? (
                        <span className="flex items-center gap-1">
                          <motion.span
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          >
                            typing
                          </motion.span>
                          <motion.span
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                          >
                            .
                          </motion.span>
                          <motion.span
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
                          >
                            .
                          </motion.span>
                          <motion.span
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}
                          >
                            .
                          </motion.span>
                        </span>
                      ) : (
                        selectedChat.user.lastSeen
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="hover:bg-purple-100"
                      onClick={() => onStartAudioCall(selectedChat.user)}
                    >
                      <Phone className="w-5 h-5 text-blue-600" />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="hover:bg-purple-100"
                      onClick={() => onStartVideoCall(selectedChat.user)}
                    >
                      <VideoIcon className="w-5 h-5 text-blue-600" />
                    </Button>
                  </motion.div>
                  <Button variant="ghost" size="sm" className="hover:bg-purple-100">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-gray-50 to-white">
                <div className="space-y-4">
                  <AnimatePresence>
                    {selectedChat.messages.map((message: any, idx: number) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex gap-2 max-w-[70%] ${message.sender === 'me' ? 'flex-row-reverse' : ''}`}>
                          {message.sender !== 'me' && (
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={selectedChat.user.avatar} />
                              <AvatarFallback>{selectedChat.user.name[0]}</AvatarFallback>
                            </Avatar>
                          )}
                          <div className="relative group">
                            {message.type === 'text' && (
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                className={`px-4 py-2 rounded-2xl ${
                                  message.sender === 'me'
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                    : 'bg-gray-100'
                                }`}
                              >
                                <p className="text-sm">{message.text}</p>
                              </motion.div>
                            )}
                            
                            {message.type === 'image' && (
                              <div className="space-y-2">
                                <motion.img
                                  whileHover={{ scale: 1.05 }}
                                  src={message.media}
                                  alt="Shared"
                                  className="rounded-lg max-w-full shadow-lg"
                                />
                                {message.text && (
                                  <div
                                    className={`px-4 py-2 rounded-2xl ${
                                      message.sender === 'me'
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                        : 'bg-gray-100'
                                    }`}
                                  >
                                    <p className="text-sm">{message.text}</p>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {message.type === 'voice' && (
                              <div
                                className={`px-4 py-3 rounded-2xl flex items-center gap-3 ${
                                  message.sender === 'me'
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                    : 'bg-gray-100'
                                }`}
                              >
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                  </svg>
                                </motion.button>
                                <div className="flex-1 flex items-center gap-2">
                                  <div className="flex gap-0.5">
                                    {[...Array(20)].map((_, i) => (
                                      <motion.div
                                        key={i}
                                        className="w-0.5 bg-current rounded-full"
                                        style={{ height: `${Math.random() * 20 + 10}px` }}
                                        animate={{ height: [`${Math.random() * 20 + 10}px`, `${Math.random() * 20 + 10}px`] }}
                                        transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-xs">{message.duration}</span>
                                </div>
                              </div>
                            )}

                            {/* Message Status */}
                            <div className={`flex items-center gap-1 mt-1 ${message.sender === 'me' ? 'justify-end' : ''}`}>
                              <span className="text-xs text-gray-500">{message.timestamp}</span>
                              {message.sender === 'me' && (
                                <span className="text-gray-500">
                                  {message.status === 'sent' && <Check className="w-3 h-3" />}
                                  {message.status === 'delivered' && <CheckCheck className="w-3 h-3" />}
                                  {message.status === 'read' && <CheckCheck className="w-3 h-3 text-blue-500" />}
                                </span>
                              )}
                            </div>

                            {/* Reactions */}
                            {message.reactions && message.reactions.length > 0 && (
                              <div className="absolute -bottom-2 right-2 flex gap-1">
                                {message.reactions.map((reaction: any, idx: number) => (
                                  <motion.div
                                    key={idx}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="text-sm bg-white border-2 border-gray-200 rounded-full px-1.5 py-0.5 shadow-sm"
                                  >
                                    {reaction.emoji}
                                  </motion.div>
                                ))}
                              </div>
                            )}

                            {/* Quick Reactions */}
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileHover={{ opacity: 1, scale: 1 }}
                              className="absolute -top-8 left-0 opacity-0 group-hover:opacity-100 bg-white rounded-full shadow-lg p-1 flex gap-1"
                            >
                              {['❤️', '👍', '😂', '😮'].map((emoji) => (
                                <motion.button
                                  key={emoji}
                                  whileHover={{ scale: 1.3 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleReaction(message.id, emoji)}
                                  className="w-6 h-6 hover:bg-gray-100 rounded-full flex items-center justify-center text-sm"
                                >
                                  {emoji}
                                </motion.button>
                              ))}
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t bg-white">
                {isRecording && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-3 flex items-center gap-2 text-red-600"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-3 h-3 bg-red-600 rounded-full"
                    />
                    <span className="text-sm">Recording... {formatDuration(recordingDuration)}</span>
                  </motion.div>
                )}
                
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <div className="flex gap-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                          <Button type="button" variant="ghost" size="sm" className="hover:bg-purple-100">
                            <Smile className="w-5 h-5 text-yellow-600" />
                          </Button>
                        </motion.div>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="grid grid-cols-8 gap-2">
                          {emojis.map((emoji) => (
                            <motion.button
                              key={emoji}
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              className="text-2xl hover:bg-gray-100 rounded p-1"
                              onClick={() => setMessageText(messageText + emoji)}
                            >
                              {emoji}
                            </motion.button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                    
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button type="button" variant="ghost" size="sm" className="hover:bg-purple-100">
                        <ImageIcon className="w-5 h-5 text-blue-600" />
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button type="button" variant="ghost" size="sm" className="hover:bg-purple-100">
                        <Camera className="w-5 h-5 text-purple-600" />
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button type="button" variant="ghost" size="sm" className="hover:bg-purple-100">
                        <Gift className="w-5 h-5 text-pink-600" />
                      </Button>
                    </motion.div>
                  </div>
                  
                  <Input
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="flex-1 bg-gray-50 border-0 focus-visible:ring-purple-500"
                  />
                  
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`hover:bg-purple-100 ${isRecording ? 'bg-red-100' : ''}`}
                      onClick={handleVoiceRecord}
                    >
                      <Mic className={`w-5 h-5 ${isRecording ? 'text-red-600' : 'text-purple-600'}`} />
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      type="submit" 
                      disabled={!messageText.trim()}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="w-32 h-32 mx-auto mb-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full flex items-center justify-center"
                >
                  <MessageCircle className="w-16 h-16 text-purple-600" />
                </motion.div>
                <p className="text-xl">Select a conversation to start messaging</p>
              </motion.div>
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
