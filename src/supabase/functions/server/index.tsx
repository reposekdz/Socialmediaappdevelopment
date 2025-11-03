import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// ==================== HELPER FUNCTIONS ====================

// Generate unique ID
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Get current user from token
async function getCurrentUser(request: Request) {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) return null;
  
  const userData = await kv.get(`session:${accessToken}`);
  return userData;
}

// Initialize storage buckets
async function initializeStorageBuckets() {
  const buckets = ['make-9492d450-avatars', 'make-9492d450-posts', 'make-9492d450-stories', 'make-9492d450-reels'];
  
  const { data: existingBuckets } = await supabase.storage.listBuckets();
  
  for (const bucketName of buckets) {
    const bucketExists = existingBuckets?.some(bucket => bucket.name === bucketName);
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 52428800, // 50MB
      });
    }
  }
}

// Initialize buckets on startup
initializeStorageBuckets();

// ==================== AUTHENTICATION ROUTES ====================

// Sign up
app.post("/make-server-9492d450/auth/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, username } = body;

    // Check if user already exists
    const existingUser = await kv.get(`user:email:${email}`);
    if (existingUser) {
      return c.json({ error: 'User already exists' }, 400);
    }

    // Check if username is taken
    const existingUsername = await kv.get(`user:username:${username}`);
    if (existingUsername) {
      return c.json({ error: 'Username already taken' }, 400);
    }

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, username },
      email_confirm: true // Auto-confirm since email server isn't configured
    });

    if (error) {
      console.log('Signup error creating auth user:', error);
      return c.json({ error: error.message }, 400);
    }

    const userId = data.user.id;

    // Create user profile
    const userProfile = {
      id: userId,
      email,
      name,
      username,
      bio: '',
      avatar: '',
      coverPhoto: '',
      followers: [],
      following: [],
      posts: [],
      stories: [],
      reels: [],
      highlights: [],
      savedPosts: [],
      createdAt: new Date().toISOString(),
      isVerified: false,
      isPrivate: false,
      website: '',
      location: '',
      dateOfBirth: '',
    };

    // Store user data
    await kv.set(`user:${userId}`, userProfile);
    await kv.set(`user:email:${email}`, userId);
    await kv.set(`user:username:${username}`, userId);

    return c.json({ 
      success: true, 
      user: userProfile,
      message: 'User created successfully' 
    });

  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Sign in
app.post("/make-server-9492d450/auth/signin", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log('Signin error:', error);
      return c.json({ error: error.message }, 400);
    }

    const userId = data.user.id;
    const accessToken = data.session.access_token;

    // Get user profile
    const userProfile = await kv.get(`user:${userId}`);
    
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    // Store session
    await kv.set(`session:${accessToken}`, userProfile);

    return c.json({ 
      success: true,
      user: userProfile,
      accessToken
    });

  } catch (error) {
    console.log('Signin error:', error);
    return c.json({ error: 'Internal server error during signin' }, 500);
  }
});

// Sign out
app.post("/make-server-9492d450/auth/signout", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (accessToken) {
      await kv.del(`session:${accessToken}`);
    }
    return c.json({ success: true });
  } catch (error) {
    console.log('Signout error:', error);
    return c.json({ error: 'Internal server error during signout' }, 500);
  }
});

// ==================== FILE UPLOAD ROUTES ====================

// Upload avatar
app.post("/make-server-9492d450/upload/avatar", async (c) => {
  try {
    const user = await getCurrentUser(c.req);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.parseBody();
    const file = body['file'] as File;
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const fileBuffer = await file.arrayBuffer();

    const { data, error } = await supabase.storage
      .from('make-9492d450-avatars')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: true
      });

    if (error) {
      console.log('Avatar upload error:', error);
      return c.json({ error: 'Failed to upload avatar' }, 500);
    }

    // Get signed URL (valid for 1 year)
    const { data: urlData } = await supabase.storage
      .from('make-9492d450-avatars')
      .createSignedUrl(fileName, 31536000);

    const avatarUrl = urlData?.signedUrl || '';

    // Update user profile
    user.avatar = avatarUrl;
    await kv.set(`user:${user.id}`, user);

    return c.json({ 
      success: true, 
      url: avatarUrl 
    });

  } catch (error) {
    console.log('Avatar upload error:', error);
    return c.json({ error: 'Internal server error during avatar upload' }, 500);
  }
});

// Upload post media
app.post("/make-server-9492d450/upload/post", async (c) => {
  try {
    const user = await getCurrentUser(c.req);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.parseBody();
    const file = body['file'] as File;
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const fileBuffer = await file.arrayBuffer();

    const { data, error } = await supabase.storage
      .from('make-9492d450-posts')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
      });

    if (error) {
      console.log('Post media upload error:', error);
      return c.json({ error: 'Failed to upload post media' }, 500);
    }

    const { data: urlData } = await supabase.storage
      .from('make-9492d450-posts')
      .createSignedUrl(fileName, 31536000);

    return c.json({ 
      success: true, 
      url: urlData?.signedUrl || '' 
    });

  } catch (error) {
    console.log('Post media upload error:', error);
    return c.json({ error: 'Internal server error during post media upload' }, 500);
  }
});

// Upload story media
app.post("/make-server-9492d450/upload/story", async (c) => {
  try {
    const user = await getCurrentUser(c.req);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.parseBody();
    const file = body['file'] as File;
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const fileBuffer = await file.arrayBuffer();

    const { data, error } = await supabase.storage
      .from('make-9492d450-stories')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
      });

    if (error) {
      console.log('Story media upload error:', error);
      return c.json({ error: 'Failed to upload story media' }, 500);
    }

    const { data: urlData } = await supabase.storage
      .from('make-9492d450-stories')
      .createSignedUrl(fileName, 31536000);

    return c.json({ 
      success: true, 
      url: urlData?.signedUrl || '' 
    });

  } catch (error) {
    console.log('Story media upload error:', error);
    return c.json({ error: 'Internal server error during story media upload' }, 500);
  }
});

// Upload reel video
app.post("/make-server-9492d450/upload/reel", async (c) => {
  try {
    const user = await getCurrentUser(c.req);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.parseBody();
    const file = body['file'] as File;
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const fileBuffer = await file.arrayBuffer();

    const { data, error } = await supabase.storage
      .from('make-9492d450-reels')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
      });

    if (error) {
      console.log('Reel upload error:', error);
      return c.json({ error: 'Failed to upload reel' }, 500);
    }

    const { data: urlData } = await supabase.storage
      .from('make-9492d450-reels')
      .createSignedUrl(fileName, 31536000);

    return c.json({ 
      success: true, 
      url: urlData?.signedUrl || '' 
    });

  } catch (error) {
    console.log('Reel upload error:', error);
    return c.json({ error: 'Internal server error during reel upload' }, 500);
  }
});

// ==================== USER ROUTES ====================

// Get user profile by ID
app.get("/make-server-9492d450/users/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const user = await kv.get(`user:${userId}`);
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({ success: true, user });
  } catch (error) {
    console.log('Get user error:', error);
    return c.json({ error: 'Internal server error while fetching user' }, 500);
  }
});

// Get user profile by username
app.get("/make-server-9492d450/users/username/:username", async (c) => {
  try {
    const username = c.req.param('username');
    const userId = await kv.get(`user:username:${username}`);
    
    if (!userId) {
      return c.json({ error: 'User not found' }, 404);
    }

    const user = await kv.get(`user:${userId}`);
    return c.json({ success: true, user });
  } catch (error) {
    console.log('Get user by username error:', error);
    return c.json({ error: 'Internal server error while fetching user by username' }, 500);
  }
});

// Update user profile
app.put("/make-server-9492d450/users/:userId", async (c) => {
  try {
    const currentUser = await getCurrentUser(c.req);
    if (!currentUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = c.req.param('userId');
    if (currentUser.id !== userId) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    const updates = await c.req.json();
    const user = await kv.get(`user:${userId}`);
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Update allowed fields
    const allowedFields = ['name', 'bio', 'website', 'location', 'dateOfBirth', 'isPrivate', 'coverPhoto'];
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        user[field] = updates[field];
      }
    }

    await kv.set(`user:${userId}`, user);

    return c.json({ success: true, user });
  } catch (error) {
    console.log('Update user error:', error);
    return c.json({ error: 'Internal server error while updating user' }, 500);
  }
});

// Search users
app.get("/make-server-9492d450/users/search/:query", async (c) => {
  try {
    const query = c.req.param('query').toLowerCase();
    const allUsers = await kv.getByPrefix('user:username:');
    
    const matchingUsers = [];
    for (const item of allUsers) {
      if (item.key.toLowerCase().includes(query)) {
        const userId = item.value;
        const user = await kv.get(`user:${userId}`);
        if (user) {
          matchingUsers.push({
            id: user.id,
            name: user.name,
            username: user.username,
            avatar: user.avatar,
            isVerified: user.isVerified
          });
        }
      }
    }

    return c.json({ success: true, users: matchingUsers });
  } catch (error) {
    console.log('Search users error:', error);
    return c.json({ error: 'Internal server error while searching users' }, 500);
  }
});

// ==================== FOLLOW ROUTES ====================

// Follow user
app.post("/make-server-9492d450/follow/:userId", async (c) => {
  try {
    const currentUser = await getCurrentUser(c.req);
    if (!currentUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userIdToFollow = c.req.param('userId');
    
    if (currentUser.id === userIdToFollow) {
      return c.json({ error: 'Cannot follow yourself' }, 400);
    }

    const userToFollow = await kv.get(`user:${userIdToFollow}`);
    if (!userToFollow) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Add to following list
    if (!currentUser.following.includes(userIdToFollow)) {
      currentUser.following.push(userIdToFollow);
      await kv.set(`user:${currentUser.id}`, currentUser);
    }

    // Add to followers list
    if (!userToFollow.followers.includes(currentUser.id)) {
      userToFollow.followers.push(currentUser.id);
      await kv.set(`user:${userIdToFollow}`, userToFollow);

      // Create notification
      const notificationId = generateId();
      const notification = {
        id: notificationId,
        type: 'follow',
        userId: userIdToFollow,
        fromUserId: currentUser.id,
        fromUserName: currentUser.name,
        fromUserAvatar: currentUser.avatar,
        fromUserUsername: currentUser.username,
        createdAt: new Date().toISOString(),
        read: false
      };
      await kv.set(`notification:${notificationId}`, notification);
      
      // Add to user's notifications
      const userNotifications = await kv.get(`notifications:${userIdToFollow}`) || [];
      userNotifications.unshift(notificationId);
      await kv.set(`notifications:${userIdToFollow}`, userNotifications);
    }

    return c.json({ success: true, message: 'User followed successfully' });
  } catch (error) {
    console.log('Follow user error:', error);
    return c.json({ error: 'Internal server error while following user' }, 500);
  }
});

// Unfollow user
app.post("/make-server-9492d450/unfollow/:userId", async (c) => {
  try {
    const currentUser = await getCurrentUser(c.req);
    if (!currentUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userIdToUnfollow = c.req.param('userId');
    const userToUnfollow = await kv.get(`user:${userIdToUnfollow}`);
    
    if (!userToUnfollow) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Remove from following list
    currentUser.following = currentUser.following.filter((id: string) => id !== userIdToUnfollow);
    await kv.set(`user:${currentUser.id}`, currentUser);

    // Remove from followers list
    userToUnfollow.followers = userToUnfollow.followers.filter((id: string) => id !== currentUser.id);
    await kv.set(`user:${userIdToUnfollow}`, userToUnfollow);

    return c.json({ success: true, message: 'User unfollowed successfully' });
  } catch (error) {
    console.log('Unfollow user error:', error);
    return c.json({ error: 'Internal server error while unfollowing user' }, 500);
  }
});

// Remove follower
app.post("/make-server-9492d450/remove-follower/:userId", async (c) => {
  try {
    const currentUser = await getCurrentUser(c.req);
    if (!currentUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const followerIdToRemove = c.req.param('userId');
    const follower = await kv.get(`user:${followerIdToRemove}`);
    
    if (!follower) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Remove from current user's followers
    currentUser.followers = currentUser.followers.filter((id: string) => id !== followerIdToRemove);
    await kv.set(`user:${currentUser.id}`, currentUser);

    // Remove from follower's following
    follower.following = follower.following.filter((id: string) => id !== currentUser.id);
    await kv.set(`user:${followerIdToRemove}`, follower);

    return c.json({ success: true, message: 'Follower removed successfully' });
  } catch (error) {
    console.log('Remove follower error:', error);
    return c.json({ error: 'Internal server error while removing follower' }, 500);
  }
});

// Get followers
app.get("/make-server-9492d450/users/:userId/followers", async (c) => {
  try {
    const userId = c.req.param('userId');
    const user = await kv.get(`user:${userId}`);
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    const followers = [];
    for (const followerId of user.followers) {
      const follower = await kv.get(`user:${followerId}`);
      if (follower) {
        followers.push({
          id: follower.id,
          name: follower.name,
          username: follower.username,
          avatar: follower.avatar,
          isVerified: follower.isVerified
        });
      }
    }

    return c.json({ success: true, followers });
  } catch (error) {
    console.log('Get followers error:', error);
    return c.json({ error: 'Internal server error while fetching followers' }, 500);
  }
});

// Get following
app.get("/make-server-9492d450/users/:userId/following", async (c) => {
  try {
    const userId = c.req.param('userId');
    const user = await kv.get(`user:${userId}`);
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    const following = [];
    for (const followingId of user.following) {
      const followingUser = await kv.get(`user:${followingId}`);
      if (followingUser) {
        following.push({
          id: followingUser.id,
          name: followingUser.name,
          username: followingUser.username,
          avatar: followingUser.avatar,
          isVerified: followingUser.isVerified
        });
      }
    }

    return c.json({ success: true, following });
  } catch (error) {
    console.log('Get following error:', error);
    return c.json({ error: 'Internal server error while fetching following' }, 500);
  }
});

// ==================== POST ROUTES ====================

// Create post
app.post("/make-server-9492d450/posts", async (c) => {
  try {
    const currentUser = await getCurrentUser(c.req);
    if (!currentUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { content, images, feeling, location, taggedUsers } = body;

    const postId = generateId();
    const post = {
      id: postId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userUsername: currentUser.username,
      content,
      images: images || [],
      feeling: feeling || '',
      location: location || '',
      taggedUsers: taggedUsers || [],
      likes: [],
      comments: [],
      shares: 0,
      saves: [],
      createdAt: new Date().toISOString(),
    };

    await kv.set(`post:${postId}`, post);

    // Add to user's posts
    currentUser.posts.unshift(postId);
    await kv.set(`user:${currentUser.id}`, currentUser);

    // Add to global feed
    const feed = await kv.get('feed:global') || [];
    feed.unshift(postId);
    await kv.set('feed:global', feed);

    return c.json({ success: true, post });
  } catch (error) {
    console.log('Create post error:', error);
    return c.json({ error: 'Internal server error while creating post' }, 500);
  }
});

// Get post by ID
app.get("/make-server-9492d450/posts/:postId", async (c) => {
  try {
    const postId = c.req.param('postId');
    const post = await kv.get(`post:${postId}`);
    
    if (!post) {
      return c.json({ error: 'Post not found' }, 404);
    }

    return c.json({ success: true, post });
  } catch (error) {
    console.log('Get post error:', error);
    return c.json({ error: 'Internal server error while fetching post' }, 500);
  }
});

// Get feed
app.get("/make-server-9492d450/feed", async (c) => {
  try {
    const currentUser = await getCurrentUser(c.req);
    if (!currentUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const globalFeed = await kv.get('feed:global') || [];
    
    const posts = [];
    for (const postId of globalFeed) {
      const post = await kv.get(`post:${postId}`);
      if (post) {
        posts.push(post);
      }
    }

    return c.json({ success: true, posts });
  } catch (error) {
    console.log('Get feed error:', error);
    return c.json({ error: 'Internal server error while fetching feed' }, 500);
  }
});

// Get user posts
app.get("/make-server-9492d450/users/:userId/posts", async (c) => {
  try {
    const userId = c.req.param('userId');
    const user = await kv.get(`user:${userId}`);
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    const posts = [];
    for (const postId of user.posts) {
      const post = await kv.get(`post:${postId}`);
      if (post) {
        posts.push(post);
      }
    }

    return c.json({ success: true, posts });
  } catch (error) {
    console.log('Get user posts error:', error);
    return c.json({ error: 'Internal server error while fetching user posts' }, 500);
  }
});

// Like post
app.post("/make-server-9492d450/posts/:postId/like", async (c) => {
  try {
    const currentUser = await getCurrentUser(c.req);
    if (!currentUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const postId = c.req.param('postId');
    const post = await kv.get(`post:${postId}`);
    
    if (!post) {
      return c.json({ error: 'Post not found' }, 404);
    }

    if (!post.likes.includes(currentUser.id)) {
      post.likes.push(currentUser.id);
      await kv.set(`post:${postId}`, post);

      // Create notification if not own post
      if (post.userId !== currentUser.id) {
        const notificationId = generateId();
        const notification = {
          id: notificationId,
          type: 'like',
          userId: post.userId,
          fromUserId: currentUser.id,
          fromUserName: currentUser.name,
          fromUserAvatar: currentUser.avatar,
          fromUserUsername: currentUser.username,
          postId: postId,
          createdAt: new Date().toISOString(),
          read: false
        };
        await kv.set(`notification:${notificationId}`, notification);
        
        const userNotifications = await kv.get(`notifications:${post.userId}`) || [];
        userNotifications.unshift(notificationId);
        await kv.set(`notifications:${post.userId}`, userNotifications);
      }
    }

    return c.json({ success: true, likes: post.likes.length });
  } catch (error) {
    console.log('Like post error:', error);
    return c.json({ error: 'Internal server error while liking post' }, 500);
  }
});

// Unlike post
app.post("/make-server-9492d450/posts/:postId/unlike", async (c) => {
  try {
    const currentUser = await getCurrentUser(c.req);
    if (!currentUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const postId = c.req.param('postId');
    const post = await kv.get(`post:${postId}`);
    
    if (!post) {
      return c.json({ error: 'Post not found' }, 404);
    }

    post.likes = post.likes.filter((id: string) => id !== currentUser.id);
    await kv.set(`post:${postId}`, post);

    return c.json({ success: true, likes: post.likes.length });
  } catch (error) {
    console.log('Unlike post error:', error);
    return c.json({ error: 'Internal server error while unliking post' }, 500);
  }
});

// Comment on post
app.post("/make-server-9492d450/posts/:postId/comments", async (c) => {
  try {
    const currentUser = await getCurrentUser(c.req);
    if (!currentUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const postId = c.req.param('postId');
    const post = await kv.get(`post:${postId}`);
    
    if (!post) {
      return c.json({ error: 'Post not found' }, 404);
    }

    const body = await c.req.json();
    const { content } = body;

    const commentId = generateId();
    const comment = {
      id: commentId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userUsername: currentUser.username,
      content,
      likes: [],
      createdAt: new Date().toISOString(),
    };

    post.comments.push(comment);
    await kv.set(`post:${postId}`, post);

    // Create notification if not own post
    if (post.userId !== currentUser.id) {
      const notificationId = generateId();
      const notification = {
        id: notificationId,
        type: 'comment',
        userId: post.userId,
        fromUserId: currentUser.id,
        fromUserName: currentUser.name,
        fromUserAvatar: currentUser.avatar,
        fromUserUsername: currentUser.username,
        postId: postId,
        content: content,
        createdAt: new Date().toISOString(),
        read: false
      };
      await kv.set(`notification:${notificationId}`, notification);
      
      const userNotifications = await kv.get(`notifications:${post.userId}`) || [];
      userNotifications.unshift(notificationId);
      await kv.set(`notifications:${post.userId}`, userNotifications);
    }

    return c.json({ success: true, comment });
  } catch (error) {
    console.log('Comment on post error:', error);
    return c.json({ error: 'Internal server error while commenting on post' }, 500);
  }
});

// Save post
app.post("/make-server-9492d450/posts/:postId/save", async (c) => {
  try {
    const currentUser = await getCurrentUser(c.req);
    if (!currentUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const postId = c.req.param('postId');
    const post = await kv.get(`post:${postId}`);
    
    if (!post) {
      return c.json({ error: 'Post not found' }, 404);
    }

    if (!currentUser.savedPosts.includes(postId)) {
      currentUser.savedPosts.push(postId);
      await kv.set(`user:${currentUser.id}`, currentUser);
    }

    if (!post.saves.includes(currentUser.id)) {
      post.saves.push(currentUser.id);
      await kv.set(`post:${postId}`, post);
    }

    return c.json({ success: true });
  } catch (error) {
    console.log('Save post error:', error);
    return c.json({ error: 'Internal server error while saving post' }, 500);
  }
});

// Unsave post
app.post("/make-server-9492d450/posts/:postId/unsave", async (c) => {
  try {
    const currentUser = await getCurrentUser(c.req);
    if (!currentUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const postId = c.req.param('postId');
    const post = await kv.get(`post:${postId}`);
    
    if (!post) {
      return c.json({ error: 'Post not found' }, 404);
    }

    currentUser.savedPosts = currentUser.savedPosts.filter((id: string) => id !== postId);
    await kv.set(`user:${currentUser.id}`, currentUser);

    post.saves = post.saves.filter((id: string) => id !== currentUser.id);
    await kv.set(`post:${postId}`, post);

    return c.json({ success: true });
  } catch (error) {
    console.log('Unsave post error:', error);
    return c.json({ error: 'Internal server error while unsaving post' }, 500);
  }
});

// Share post
app.post("/make-server-9492d450/posts/:postId/share", async (c) => {
  try {
    const currentUser = await getCurrentUser(c.req);
    if (!currentUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const postId = c.req.param('postId');
    const post = await kv.get(`post:${postId}`);
    
    if (!post) {
      return c.json({ error: 'Post not found' }, 404);
    }

    post.shares = (post.shares || 0) + 1;
    await kv.set(`post:${postId}`, post);

    return c.json({ success: true, shares: post.shares });
  } catch (error) {
    console.log('Share post error:', error);
    return c.json({ error: 'Internal server error while sharing post' }, 500);
  }
});

// Delete post
app.delete("/make-server-9492d450/posts/:postId", async (c) => {
  try {
    const currentUser = await getCurrentUser(c.req);
    if (!currentUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const postId = c.req.param('postId');
    const post = await kv.get(`post:${postId}`);
    
    if (!post) {
      return c.json({ error: 'Post not found' }, 404);
    }

    if (post.userId !== currentUser.id) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    // Remove from user's posts
    currentUser.posts = currentUser.posts.filter((id: string) => id !== postId);
    await kv.set(`user:${currentUser.id}`, currentUser);

    // Remove from global feed
    const feed = await kv.get('feed:global') || [];
    const updatedFeed = feed.filter((id: string) => id !== postId);
    await kv.set('feed:global', updatedFeed);

    // Delete post
    await kv.del(`post:${postId}`);

    return c.json({ success: true });
  } catch (error) {
    console.log('Delete post error:', error);
    return c.json({ error: 'Internal server error while deleting post' }, 500);
  }
});

// ==================== STORY ROUTES ====================

// Create story
app.post("/make-server-9492d450/stories", async (c) => {
  try {
    const currentUser = await getCurrentUser(c.req);
    if (!currentUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { mediaUrl, mediaType, text, backgroundColor, duration } = body;

    const storyId = generateId();
    const story = {
      id: storyId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userUsername: currentUser.username,
      mediaUrl,
      mediaType,
      text: text || '',
      backgroundColor: backgroundColor || '#000000',
      duration: duration || 5,
      views: [],
      likes: [],
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    };

    await kv.set(`story:${storyId}`, story);

    // Add to user's stories
    currentUser.stories.unshift(storyId);
    await kv.set(`user:${currentUser.id}`, currentUser);

    return c.json({ success: true, story });
  } catch (error) {
    console.log('Create story error:', error);
    return c.json({ error: 'Internal server error while creating story' }, 500);
  }
});

// Get all stories (from followed users)
app.get("/make-server-9492d450/stories", async (c) => {
  try {
    const currentUser = await getCurrentUser(c.req);
    if (!currentUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const stories = [];
    const userIds = [currentUser.id, ...currentUser.following];

    for (const userId of userIds) {
      const user = await kv.get(`user:${userId}`);
      if (!user || !user.stories || user.stories.length === 0) continue;

      const userStories = [];
      for (const storyId of user.stories) {
        const story = await kv.get(`story:${storyId}`);
        if (story && new Date(story.expiresAt) > new Date()) {
          userStories.push(story);
        }
      }

      if (userStories.length > 0) {
        stories.push({
          userId: user.id,
          userName: user.name,
          userAvatar: user.avatar,
          userUsername: user.username,
          stories: userStories
        });
      }
    }

    return c.json({ success: true, stories });
  } catch (error) {
    console.log('Get stories error:', error);
    return c.json({ error: 'Internal server error while fetching stories' }, 500);
  }
});

// Get user stories
app.get("/make-server-9492d450/users/:userId/stories", async (c) => {
  try {
    const userId = c.req.param('userId');
    const user = await kv.get(`user:${userId}`);
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    const stories = [];
    for (const storyId of user.stories) {
      const story = await kv.get(`story:${storyId}`);
      if (story && new Date(story.expiresAt) > new Date()) {
        stories.push(story);
      }
    }

    return c.json({ success: true, stories });
  } catch (error) {
    console.log('Get user stories error:', error);
    return c.json({ error: 'Internal server error while fetching user stories' }, 500);
  }
});

// View story
app.post("/make-server-9492d450/stories/:storyId/view", async (c) => {
  try {
    const currentUser = await getCurrentUser(c.req);
    if (!currentUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const storyId = c.req.param('storyId');
    const story = await kv.get(`story:${storyId}`);
    
    if (!story) {
      return c.json({ error: 'Story not found' }, 404);
    }

    if (!story.views.includes(currentUser.id)) {
      story.views.push(currentUser.id);
      await kv.set(`story:${storyId}`, story);
    }

    return c.json({ success: true });
  } catch (error) {
    console.log('View story error:', error);
    return c.json({ error: 'Internal server error while viewing story' }, 500);
  }
});

// Like story
app.post("/make-server-9492d450/stories/:storyId/like", async (c) => {
  try {
    const currentUser = await getCurrentUser(c.req);
    if (!currentUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const storyId = c.req.param('storyId');
    const story = await kv.get(`story:${storyId}`);
    
    if (!story) {
      return c.json({ error: 'Story not found' }, 404);
    }

    if (!story.likes.includes(currentUser.id)) {
      story.likes.push(currentUser.id);
      await kv.set(`story:${storyId}`, story);

      // Create notification if not own story
      if (story.userId !== currentUser.id) {
        const notificationId = generateId();
        const notification = {
          id: notificationId,
          type: 'story_like',
          userId: story.userId,
          fromUserId: currentUser.id,
          fromUserName: currentUser.name,
          fromUserAvatar: currentUser.avatar,
          fromUserUsername: currentUser.username,
          storyId: storyId,
          createdAt: new Date().toISOString(),
          read: false
        };
        await kv.set(`notification:${notificationId}`, notification);
        
        const userNotifications = await kv.get(`notifications:${story.userId}`) || [];
        userNotifications.unshift(notificationId);
        await kv.set(`notifications:${story.userId}`, userNotifications);
      }
    }

    return c.json({ success: true, likes: story.likes.length });
  } catch (error) {
    console.log('Like story error:', error);
    return c.json({ error: 'Internal server error while liking story' }, 500);
  }
});

// Delete story
app.delete("/make-server-9492d450/stories/:storyId", async (c) => {
  try {
    const currentUser = await getCurrentUser(c.req);
    if (!currentUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const storyId = c.req.param('storyId');
    const story = await kv.get(`story:${storyId}`);
    
    if (!story) {
      return c.json({ error: 'Story not found' }, 404);
    }

    if (story.userId !== currentUser.id) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    // Remove from user's stories
    currentUser.stories = currentUser.stories.filter((id: string) => id !== storyId);
    await kv.set(`user:${currentUser.id}`, currentUser);

    // Delete story
    await kv.del(`story:${storyId}`);

    return c.json({ success: true });
  } catch (error) {
    console.log('Delete story error:', error);
    return c.json({ error: 'Internal server error while deleting story' }, 500);
  }
});

// ==================== REEL ROUTES ====================

// Create reel
app.post("/make-server-9492d450/reels", async (c) => {
  try {
    const currentUser = await getCurrentUser(c.req);
    if (!currentUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { videoUrl, caption, music, thumbnail } = body;

    const reelId = generateId();
    const reel = {
      id: reelId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userUsername: currentUser.username,
      videoUrl,
      caption: caption || '',
      music: music || '',
      thumbnail: thumbnail || '',
      likes: [],
      comments: [],
      shares: 0,
      saves: [],
      views: 0,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`reel:${reelId}`, reel);

    // Add to user's reels
    currentUser.reels.unshift(reelId);
    await kv.set(`user:${currentUser.id}`, currentUser);

    // Add to explore feed
    const exploreFeed = await kv.get('feed:explore') || [];
    exploreFeed.unshift(reelId);
    await kv.set('feed:explore', exploreFeed);

    return c.json({ success: true, reel });
  } catch (error) {
    console.log('Create reel error:', error);
    return c.json({ error: 'Internal server error while creating reel' }, 500);
  }
});

// Get all reels (Explore)
app.get("/make-server-9492d450/reels", async (c) => {
  try {
    const exploreFeed = await kv.get('feed:explore') || [];
    
    const reels = [];
    for (const reelId of exploreFeed) {
      const reel = await kv.get(`reel:${reelId}`);
      if (reel) {
        reels.push(reel);
      }
    }

    return c.json({ success: true, reels });
  } catch (error) {
    console.log('Get reels error:', error);
    return c.json({ error: 'Internal server error while fetching reels' }, 500);
  }
});

// Get user reels
app.get("/make-server-9492d450/users/:userId/reels", async (c) => {
  try {
    const userId = c.req.param('userId');
    const user = await kv.get(`user:${userId}`);
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    const reels = [];
    for (const reelId of user.reels) {
      const reel = await kv.get(`reel:${reelId}`);
      if (reel) {
        reels.push(reel);
      }
    }

    return c.json({ success: true, reels });
  } catch (error) {
    console.log('Get user reels error:', error);
    return c.json({ error: 'Internal server error while fetching user reels' }, 500);
  }
});

// Like reel
app.post("/make-server-9492d450/reels/:reelId/like", async (c) => {
  try {
    const currentUser = await getCurrentUser(c.req);
    if (!currentUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const reelId = c.req.param('reelId');
    const reel = await kv.get(`reel:${reelId}`);
    
    if (!reel) {
      return c.json({ error: 'Reel not found' }, 404);
    }

    if (!reel.likes.includes(currentUser.id)) {
      reel.likes.push(currentUser.id);
      await kv.set(`reel:${reelId}`, reel);

      // Create notification if not own reel
      if (reel.userId !== currentUser.id) {
        const notificationId = generateId();
        const notification = {
          id: notificationId,
          type: 'reel_like',
          userId: reel.userId,
          fromUserId: currentUser.id,
          fromUserName: currentUser.name,
          fromUserAvatar: currentUser.avatar,
          fromUserUsername: currentUser.username,
          reelId: reelId,
          createdAt: new Date().toISOString(),
          read: false
        };
        await kv.set(`notification:${notificationId}`, notification);
        
        const userNotifications = await kv.get(`notifications:${reel.userId}`) || [];
        userNotifications.unshift(notificationId);
        await kv.set(`notifications:${reel.userId}`, userNotifications);
      }
    }

    return c.json({ success: true, likes: reel.likes.length });
  } catch (error) {
    console.log('Like reel error:', error);
    return c.json({ error: 'Internal server error while liking reel' }, 500);
  }
});

// Unlike reel
app.post("/make-server-9492d450/reels/:reelId/unlike", async (c) => {
  try {
    const currentUser = await getCurrentUser(c.req);
    if (!currentUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const reelId = c.req.param('reelId');
    const reel = await kv.get(`reel:${reelId}`);
    
    if (!reel) {
      return c.json({ error: 'Reel not found' }, 404);
    }

    reel.likes = reel.likes.filter((id: string) => id !== currentUser.id);
    await kv.set(`reel:${reelId}`, reel);

    return c.json({ success: true, likes: reel.likes.length });
  } catch (error) {
    console.log('Unlike reel error:', error);
    return c.json({ error: 'Internal server error while unliking reel' }, 500);
  }
});

// Comment on reel
app.post("/make-server-9492d450/reels/:reelId/comments", async (c) => {
  try {
    const currentUser = await getCurrentUser(c.req);
    if (!currentUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const reelId = c.req.param('reelId');
    const reel = await kv.get(`reel:${reelId}`);
    
    if (!reel) {
      return c.json({ error: 'Reel not found' }, 404);
    }

    const body = await c.req.json();
    const { content } = body;

    const commentId = generateId();
    const comment = {
      id: commentId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userUsername: currentUser.username,
      content,
      likes: [],
      createdAt: new Date().toISOString(),
    };

    reel.comments.push(comment);
    await kv.set(`reel:${reelId}`, reel);

    // Create notification if not own reel
    if (reel.userId !== currentUser.id) {
      const notificationId = generateId();
      const notification = {
        id: notificationId,
        type: 'reel_comment',
        userId: reel.userId,
        fromUserId: currentUser.id,
        fromUserName: currentUser.name,
        fromUserAvatar: currentUser.avatar,
        fromUserUsername: currentUser.username,
        reelId: reelId,
        content: content,
        createdAt: new Date().toISOString(),
        read: false
      };
      await kv.set(`notification:${notificationId}`, notification);
      
      const userNotifications = await kv.get(`notifications:${reel.userId}`) || [];
      userNotifications.unshift(notificationId);
      await kv.set(`notifications:${reel.userId}`, userNotifications);
    }

    return c.json({ success: true, comment });
  } catch (error) {
    console.log('Comment on reel error:', error);
    return c.json({ error: 'Internal server error while commenting on reel' }, 500);
  }
});

// Share reel
app.post("/make-server-9492d450/reels/:reelId/share", async (c) => {
  try {
    const currentUser = await getCurrentUser(c.req);
    if (!currentUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const reelId = c.req.param('reelId');
    const reel = await kv.get(`reel:${reelId}`);
    
    if (!reel) {
      return c.json({ error: 'Reel not found' }, 404);
    }

    reel.shares = (reel.shares || 0) + 1;
    await kv.set(`reel:${reelId}`, reel);

    return c.json({ success: true, shares: reel.shares });
  } catch (error) {
    console.log('Share reel error:', error);
    return c.json({ error: 'Internal server error while sharing reel' }, 500);
  }
});

// View reel
app.post("/make-server-9492d450/reels/:reelId/view", async (c) => {
  try {
    const reelId = c.req.param('reelId');
    const reel = await kv.get(`reel:${reelId}`);
    
    if (!reel) {
      return c.json({ error: 'Reel not found' }, 404);
    }

    reel.views = (reel.views || 0) + 1;
    await kv.set(`reel:${reelId}`, reel);

    return c.json({ success: true, views: reel.views });
  } catch (error) {
    console.log('View reel error:', error);
    return c.json({ error: 'Internal server error while viewing reel' }, 500);
  }
});

// Save reel
app.post("/make-server-9492d450/reels/:reelId/save", async (c) => {
  try {
    const currentUser = await getCurrentUser(c.req);
    if (!currentUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const reelId = c.req.param('reelId');
    const reel = await kv.get(`reel:${reelId}`);
    
    if (!reel) {
      return c.json({ error: 'Reel not found' }, 404);
    }

    if (!reel.saves.includes(currentUser.id)) {
      reel.saves.push(currentUser.id);
      await kv.set(`reel:${reelId}`, reel);
    }

    return c.json({ success: true });
  } catch (error) {
    console.log('Save reel error:', error);
    return c.json({ error: 'Internal server error while saving reel' }, 500);
  }
});

// Delete reel
app.delete("/make-server-9492d450/reels/:reelId", async (c) => {
  try {
    const currentUser = await getCurrentUser(c.req);
    if (!currentUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const reelId = c.req.param('reelId');
    const reel = await kv.get(`reel:${reelId}`);
    
    if (!reel) {
      return c.json({ error: 'Reel not found' }, 404);
    }

    if (reel.userId !== currentUser.id) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    // Remove from user's reels
    currentUser.reels = currentUser.reels.filter((id: string) => id !== reelId);
    await kv.set(`user:${currentUser.id}`, currentUser);

    // Remove from explore feed
    const exploreFeed = await kv.get('feed:explore') || [];
    const updatedFeed = exploreFeed.filter((id: string) => id !== reelId);
    await kv.set('feed:explore', updatedFeed);

    // Delete reel
    await kv.del(`reel:${reelId}`);

    return c.json({ success: true });
  } catch (error) {
    console.log('Delete reel error:', error);
    return c.json({ error: 'Internal server error while deleting reel' }, 500);
  }
});

// ==================== NOTIFICATION ROUTES ====================

// Get user notifications
app.get("/make-server-9492d450/notifications", async (c) => {
  try {
    const currentUser = await getCurrentUser(c.req);
    if (!currentUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const notificationIds = await kv.get(`notifications:${currentUser.id}`) || [];
    
    const notifications = [];
    for (const notificationId of notificationIds) {
      const notification = await kv.get(`notification:${notificationId}`);
      if (notification) {
        notifications.push(notification);
      }
    }

    return c.json({ success: true, notifications });
  } catch (error) {
    console.log('Get notifications error:', error);
    return c.json({ error: 'Internal server error while fetching notifications' }, 500);
  }
});

// Mark notification as read
app.post("/make-server-9492d450/notifications/:notificationId/read", async (c) => {
  try {
    const currentUser = await getCurrentUser(c.req);
    if (!currentUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const notificationId = c.req.param('notificationId');
    const notification = await kv.get(`notification:${notificationId}`);
    
    if (!notification) {
      return c.json({ error: 'Notification not found' }, 404);
    }

    notification.read = true;
    await kv.set(`notification:${notificationId}`, notification);

    return c.json({ success: true });
  } catch (error) {
    console.log('Mark notification as read error:', error);
    return c.json({ error: 'Internal server error while marking notification as read' }, 500);
  }
});

// ==================== EXPLORE ROUTES ====================

// Get explore content
app.get("/make-server-9492d450/explore", async (c) => {
  try {
    const currentUser = await getCurrentUser(c.req);
    if (!currentUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get reels from explore feed
    const exploreFeed = await kv.get('feed:explore') || [];
    const reels = [];
    for (const reelId of exploreFeed) {
      const reel = await kv.get(`reel:${reelId}`);
      if (reel) {
        reels.push(reel);
      }
    }

    // Get popular posts
    const globalFeed = await kv.get('feed:global') || [];
    const posts = [];
    for (const postId of globalFeed.slice(0, 20)) {
      const post = await kv.get(`post:${postId}`);
      if (post && post.images && post.images.length > 0) {
        posts.push(post);
      }
    }

    return c.json({ success: true, reels, posts });
  } catch (error) {
    console.log('Get explore content error:', error);
    return c.json({ error: 'Internal server error while fetching explore content' }, 500);
  }
});

// ==================== WEBRTC SIGNALING ROUTES ====================

// Send call offer
app.post("/make-server-9492d450/webrtc/offer", async (c) => {
  try {
    const currentUser = await getCurrentUser(c.req);
    if (!currentUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { to, type, offer } = body;

    const callId = generateId();
    const callData = {
      id: callId,
      from: currentUser.id,
      to,
      type,
      offer,
      answer: null,
      iceCandidates: [],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await kv.set(`call:${callId}`, callData);
    await kv.set(`call:user:${to}`, callId);

    return c.json({ success: true, callId });
  } catch (error) {
    console.log('WebRTC offer error:', error);
    return c.json({ error: 'Internal server error while processing call offer' }, 500);
  }
});

// Send call answer
app.post("/make-server-9492d450/webrtc/answer", async (c) => {
  try {
    const currentUser = await getCurrentUser(c.req);
    if (!currentUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { callId, answer } = body;

    const callData = await kv.get(`call:${callId}`);
    if (!callData) {
      return c.json({ error: 'Call not found' }, 404);
    }

    callData.answer = answer;
    callData.status = 'connected';
    await kv.set(`call:${callId}`, callData);

    return c.json({ success: true });
  } catch (error) {
    console.log('WebRTC answer error:', error);
    return c.json({ error: 'Internal server error while processing call answer' }, 500);
  }
});

// Get call answer
app.get("/make-server-9492d450/webrtc/answer/:callId", async (c) => {
  try {
    const currentUser = await getCurrentUser(c.req);
    if (!currentUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const callId = c.req.param('callId');
    const callData = await kv.get(`call:${callId}`);

    if (!callData) {
      return c.json({ error: 'Call not found' }, 404);
    }

    return c.json({ success: true, answer: callData.answer });
  } catch (error) {
    console.log('Get call answer error:', error);
    return c.json({ error: 'Internal server error while fetching call answer' }, 500);
  }
});

// Send ICE candidate
app.post("/make-server-9492d450/webrtc/ice-candidate", async (c) => {
  try {
    const currentUser = await getCurrentUser(c.req);
    if (!currentUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { callId, candidate } = body;

    const callData = await kv.get(`call:${callId}`);
    if (!callData) {
      return c.json({ error: 'Call not found' }, 404);
    }

    if (!callData.iceCandidates) {
      callData.iceCandidates = [];
    }
    callData.iceCandidates.push({ candidate, from: currentUser.id, timestamp: Date.now() });
    await kv.set(`call:${callId}`, callData);

    return c.json({ success: true });
  } catch (error) {
    console.log('ICE candidate error:', error);
    return c.json({ error: 'Internal server error while processing ICE candidate' }, 500);
  }
});

// Get ICE candidates
app.get("/make-server-9492d450/webrtc/ice-candidates/:callId", async (c) => {
  try {
    const currentUser = await getCurrentUser(c.req);
    if (!currentUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const callId = c.req.param('callId');
    const callData = await kv.get(`call:${callId}`);

    if (!callData) {
      return c.json({ error: 'Call not found' }, 404);
    }

    // Return candidates from the other user
    const candidates = (callData.iceCandidates || [])
      .filter((item: any) => item.from !== currentUser.id)
      .map((item: any) => item.candidate);

    return c.json({ success: true, candidates });
  } catch (error) {
    console.log('Get ICE candidates error:', error);
    return c.json({ error: 'Internal server error while fetching ICE candidates' }, 500);
  }
});

// End call
app.post("/make-server-9492d450/webrtc/end/:callId", async (c) => {
  try {
    const currentUser = await getCurrentUser(c.req);
    if (!currentUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const callId = c.req.param('callId');
    const callData = await kv.get(`call:${callId}`);

    if (callData) {
      callData.status = 'ended';
      callData.endedAt = new Date().toISOString();
      await kv.set(`call:${callId}`, callData);
    }

    return c.json({ success: true });
  } catch (error) {
    console.log('End call error:', error);
    return c.json({ error: 'Internal server error while ending call' }, 500);
  }
});

// Check for incoming call
app.get("/make-server-9492d450/webrtc/incoming", async (c) => {
  try {
    const currentUser = await getCurrentUser(c.req);
    if (!currentUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const callId = await kv.get(`call:user:${currentUser.id}`);
    if (!callId) {
      return c.json({ success: true, call: null });
    }

    const callData = await kv.get(`call:${callId}`);
    if (!callData || callData.status !== 'pending') {
      return c.json({ success: true, call: null });
    }

    // Get caller info
    const caller = await kv.get(`user:${callData.from}`);

    return c.json({ 
      success: true, 
      call: {
        id: callData.id,
        from: {
          id: caller.id,
          name: caller.name,
          username: caller.username,
          avatar: caller.avatar,
        },
        type: callData.type,
        offer: callData.offer,
      } 
    });
  } catch (error) {
    console.log('Check incoming call error:', error);
    return c.json({ error: 'Internal server error while checking incoming call' }, 500);
  }
});

// Health check endpoint
app.get("/make-server-9492d450/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);
