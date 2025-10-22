import { useState } from 'react';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { MapPin, Link as LinkIcon, Calendar, MoreVertical, Grid, Bookmark, Tag, Video } from 'lucide-react';
import { Badge } from './ui/badge';

interface ProfileProps {
  currentUser: any;
}

export function Profile({ currentUser }: ProfileProps) {
  const highlights = [
    { id: 1, title: 'Travel', thumbnail: 'https://images.unsplash.com/photo-1528543606781-2f6e6857f318?w=100' },
    { id: 2, title: 'Food', thumbnail: 'https://images.unsplash.com/photo-1532980400857-e8d9d275d858?w=100' },
    { id: 3, title: 'Tech', thumbnail: 'https://images.unsplash.com/photo-1519662978799-2f05096d3636?w=100' },
    { id: 4, title: 'Nature', thumbnail: 'https://images.unsplash.com/photo-1617634667039-8e4cb277ab46?w=100' },
  ];

  const userPosts = [
    { id: 1, image: 'https://images.unsplash.com/photo-1519662978799-2f05096d3636?w=400', likes: 1234, comments: 89 },
    { id: 2, image: 'https://images.unsplash.com/photo-1617634667039-8e4cb277ab46?w=400', likes: 2567, comments: 134 },
    { id: 3, image: 'https://images.unsplash.com/photo-1532980400857-e8d9d275d858?w=400', likes: 892, comments: 56 },
    { id: 4, image: 'https://images.unsplash.com/photo-1513061379709-ef0cd1695189?w=400', likes: 3421, comments: 178 },
    { id: 5, image: 'https://images.unsplash.com/photo-1528543606781-2f6e6857f318?w=400', likes: 1876, comments: 203 },
    { id: 6, image: 'https://images.unsplash.com/photo-1647962431451-d0fdaf1cf21c?w=400', likes: 4532, comments: 312 },
  ];

  const savedPosts = [
    { id: 1, image: 'https://images.unsplash.com/photo-1532980400857-e8d9d275d858?w=400', likes: 892, comments: 56 },
    { id: 2, image: 'https://images.unsplash.com/photo-1528543606781-2f6e6857f318?w=400', likes: 1876, comments: 203 },
  ];

  const taggedPosts = [
    { id: 1, image: 'https://images.unsplash.com/photo-1519662978799-2f05096d3636?w=400', likes: 1234, comments: 89 },
    { id: 2, image: 'https://images.unsplash.com/photo-1617634667039-8e4cb277ab46?w=400', likes: 2567, comments: 134 },
  ];

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <Card className="shadow-sm">
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 relative">
          <Button variant="ghost" size="sm" className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        {/* Profile Info */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="-mt-20">
              <Avatar className="w-32 h-32 border-4 border-white">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback>{currentUser.fullName[0]}</AvatarFallback>
              </Avatar>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl">{currentUser.fullName}</h1>
                    {currentUser.verified && (
                      <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <p className="text-gray-600">@{currentUser.username}</p>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  <Button>Edit Profile</Button>
                  <Button variant="outline">Share Profile</Button>
                </div>
              </div>

              {/* Bio */}
              <p className="mt-4">{currentUser.bio}</p>

              {/* Profile Details */}
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-1">
                  <LinkIcon className="w-4 h-4" />
                  <a href="#" className="text-blue-600 hover:underline">socialhub.com/{currentUser.username}</a>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined October 2023</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-6 mt-4">
                <div className="text-center">
                  <p className="text-xl">{userPosts.length}</p>
                  <p className="text-sm text-gray-600">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-xl">{currentUser.followers.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-xl">{currentUser.following}</p>
                  <p className="text-sm text-gray-600">Following</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Highlights */}
      <Card className="p-4 shadow-sm">
        <div className="flex gap-4 overflow-x-auto">
          {/* Add New Highlight */}
          <button className="flex-shrink-0 flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-xs text-gray-600">New</span>
          </button>

          {/* Existing Highlights */}
          {highlights.map((highlight) => (
            <button key={highlight.id} className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500">
                <img
                  src={highlight.thumbnail}
                  alt={highlight.title}
                  className="w-full h-full rounded-full border-2 border-white object-cover"
                />
              </div>
              <span className="text-xs text-gray-600 max-w-[64px] truncate">{highlight.title}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Posts Tabs */}
      <Card className="shadow-sm">
        <Tabs defaultValue="posts" className="w-full">
          <div className="border-b">
            <TabsList className="w-full justify-center bg-transparent">
              <TabsTrigger value="posts" className="gap-2 flex-1">
                <Grid className="w-4 h-4" />
                Posts
              </TabsTrigger>
              <TabsTrigger value="reels" className="gap-2 flex-1">
                <Video className="w-4 h-4" />
                Reels
              </TabsTrigger>
              <TabsTrigger value="saved" className="gap-2 flex-1">
                <Bookmark className="w-4 h-4" />
                Saved
              </TabsTrigger>
              <TabsTrigger value="tagged" className="gap-2 flex-1">
                <Tag className="w-4 h-4" />
                Tagged
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="posts" className="p-0 m-0">
            <div className="grid grid-cols-3 gap-1">
              {userPosts.map((post) => (
                <div
                  key={post.id}
                  className="relative aspect-square overflow-hidden group cursor-pointer"
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
          </TabsContent>

          <TabsContent value="reels" className="p-8 m-0">
            <div className="text-center text-gray-500">
              <Video className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No reels yet</p>
              <Button className="mt-4">Create Your First Reel</Button>
            </div>
          </TabsContent>

          <TabsContent value="saved" className="p-0 m-0">
            <div className="grid grid-cols-3 gap-1">
              {savedPosts.map((post) => (
                <div
                  key={post.id}
                  className="relative aspect-square overflow-hidden group cursor-pointer"
                >
                  <img
                    src={post.image}
                    alt={`Saved post ${post.id}`}
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
          </TabsContent>

          <TabsContent value="tagged" className="p-0 m-0">
            <div className="grid grid-cols-3 gap-1">
              {taggedPosts.map((post) => (
                <div
                  key={post.id}
                  className="relative aspect-square overflow-hidden group cursor-pointer"
                >
                  <img
                    src={post.image}
                    alt={`Tagged post ${post.id}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <Tag className="w-5 h-5 text-white drop-shadow-lg" />
                  </div>
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
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
