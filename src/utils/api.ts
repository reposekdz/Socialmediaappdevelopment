import { projectId, publicAnonKey } from './supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-9492d450`;

// Helper function to get auth token
export function getAuthToken(): string {
  return localStorage.getItem('authToken') || publicAnonKey;
}

// Helper function to make API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP error ${response.status}`);
  }

  return response.json();
}

// ==================== AUTH API ====================

export const authAPI = {
  async signUp(email: string, password: string, name: string, username: string) {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, username }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }

    return response.json();
  },

  async signIn(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signin failed');
    }

    const data = await response.json();
    if (data.accessToken) {
      localStorage.setItem('authToken', data.accessToken);
    }
    return data;
  },

  async signOut() {
    await apiCall('/auth/signout', { method: 'POST' });
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  },
};

// ==================== USER API ====================

export const userAPI = {
  async getUser(userId: string) {
    return apiCall(`/users/${userId}`);
  },

  async getUserByUsername(username: string) {
    return apiCall(`/users/username/${username}`);
  },

  async updateUser(userId: string, updates: any) {
    return apiCall(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async searchUsers(query: string) {
    return apiCall(`/users/search/${query}`);
  },

  async followUser(userId: string) {
    return apiCall(`/follow/${userId}`, { method: 'POST' });
  },

  async unfollowUser(userId: string) {
    return apiCall(`/unfollow/${userId}`, { method: 'POST' });
  },

  async removeFollower(userId: string) {
    return apiCall(`/remove-follower/${userId}`, { method: 'POST' });
  },

  async getFollowers(userId: string) {
    return apiCall(`/users/${userId}/followers`);
  },

  async getFollowing(userId: string) {
    return apiCall(`/users/${userId}/following`);
  },
};

// ==================== UPLOAD API ====================

export const uploadAPI = {
  async uploadAvatar(file: File) {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/upload/avatar`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Avatar upload failed');
    }

    return response.json();
  },

  async uploadPostMedia(file: File) {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/upload/post`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Post media upload failed');
    }

    return response.json();
  },

  async uploadStoryMedia(file: File) {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/upload/story`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Story media upload failed');
    }

    return response.json();
  },

  async uploadReelVideo(file: File) {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/upload/reel`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Reel upload failed');
    }

    return response.json();
  },
};

// ==================== POST API ====================

export const postAPI = {
  async createPost(data: {
    content: string;
    images?: string[];
    feeling?: string;
    location?: string;
    taggedUsers?: string[];
  }) {
    return apiCall('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getPost(postId: string) {
    return apiCall(`/posts/${postId}`);
  },

  async getFeed() {
    return apiCall('/feed');
  },

  async getUserPosts(userId: string) {
    return apiCall(`/users/${userId}/posts`);
  },

  async likePost(postId: string) {
    return apiCall(`/posts/${postId}/like`, { method: 'POST' });
  },

  async unlikePost(postId: string) {
    return apiCall(`/posts/${postId}/unlike`, { method: 'POST' });
  },

  async commentOnPost(postId: string, content: string) {
    return apiCall(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  async savePost(postId: string) {
    return apiCall(`/posts/${postId}/save`, { method: 'POST' });
  },

  async unsavePost(postId: string) {
    return apiCall(`/posts/${postId}/unsave`, { method: 'POST' });
  },

  async sharePost(postId: string) {
    return apiCall(`/posts/${postId}/share`, { method: 'POST' });
  },

  async deletePost(postId: string) {
    return apiCall(`/posts/${postId}`, { method: 'DELETE' });
  },
};

// ==================== STORY API ====================

export const storyAPI = {
  async createStory(data: {
    mediaUrl: string;
    mediaType: 'image' | 'video';
    text?: string;
    backgroundColor?: string;
    duration?: number;
  }) {
    return apiCall('/stories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getStories() {
    return apiCall('/stories');
  },

  async getUserStories(userId: string) {
    return apiCall(`/users/${userId}/stories`);
  },

  async viewStory(storyId: string) {
    return apiCall(`/stories/${storyId}/view`, { method: 'POST' });
  },

  async likeStory(storyId: string) {
    return apiCall(`/stories/${storyId}/like`, { method: 'POST' });
  },

  async deleteStory(storyId: string) {
    return apiCall(`/stories/${storyId}`, { method: 'DELETE' });
  },
};

// ==================== REEL API ====================

export const reelAPI = {
  async createReel(data: {
    videoUrl: string;
    caption?: string;
    music?: string;
    thumbnail?: string;
  }) {
    return apiCall('/reels', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getReels() {
    return apiCall('/reels');
  },

  async getUserReels(userId: string) {
    return apiCall(`/users/${userId}/reels`);
  },

  async likeReel(reelId: string) {
    return apiCall(`/reels/${reelId}/like`, { method: 'POST' });
  },

  async unlikeReel(reelId: string) {
    return apiCall(`/reels/${reelId}/unlike`, { method: 'POST' });
  },

  async commentOnReel(reelId: string, content: string) {
    return apiCall(`/reels/${reelId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  async shareReel(reelId: string) {
    return apiCall(`/reels/${reelId}/share`, { method: 'POST' });
  },

  async viewReel(reelId: string) {
    return apiCall(`/reels/${reelId}/view`, { method: 'POST' });
  },

  async saveReel(reelId: string) {
    return apiCall(`/reels/${reelId}/save`, { method: 'POST' });
  },

  async deleteReel(reelId: string) {
    return apiCall(`/reels/${reelId}`, { method: 'DELETE' });
  },
};

// ==================== NOTIFICATION API ====================

export const notificationAPI = {
  async getNotifications() {
    return apiCall('/notifications');
  },

  async markAsRead(notificationId: string) {
    return apiCall(`/notifications/${notificationId}/read`, { method: 'POST' });
  },
};

// ==================== EXPLORE API ====================

export const exploreAPI = {
  async getExplore() {
    return apiCall('/explore');
  },
};

// ==================== WEBRTC API ====================

export const webrtcAPI = {
  async sendOffer(to: string, type: 'video' | 'audio', offer: RTCSessionDescriptionInit) {
    return apiCall('/webrtc/offer', {
      method: 'POST',
      body: JSON.stringify({ to, type, offer }),
    });
  },

  async sendAnswer(callId: string, answer: RTCSessionDescriptionInit) {
    return apiCall('/webrtc/answer', {
      method: 'POST',
      body: JSON.stringify({ callId, answer }),
    });
  },

  async getAnswer(callId: string) {
    return apiCall(`/webrtc/answer/${callId}`);
  },

  async sendIceCandidate(callId: string, candidate: RTCIceCandidateInit) {
    return apiCall('/webrtc/ice-candidate', {
      method: 'POST',
      body: JSON.stringify({ callId, candidate }),
    });
  },

  async getIceCandidates(callId: string) {
    return apiCall(`/webrtc/ice-candidates/${callId}`);
  },

  async endCall(callId: string) {
    return apiCall(`/webrtc/end/${callId}`, {
      method: 'POST',
    });
  },

  async checkIncomingCall() {
    return apiCall('/webrtc/incoming');
  },
};
