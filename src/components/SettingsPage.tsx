import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { 
  User, 
  Lock, 
  Bell, 
  Eye, 
  Shield, 
  Smartphone, 
  Globe, 
  Palette,
  Moon,
  Sun,
  Download,
  Trash2,
  Camera,
  Mail,
  Phone,
  MapPin,
  Link as LinkIcon,
  CheckCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { ScrollArea } from './ui/scroll-area';

interface SettingsPageProps {
  currentUser: any;
}

export function SettingsPage({ currentUser }: SettingsPageProps) {
  const [settings, setSettings] = useState({
    // Profile
    fullName: currentUser.fullName,
    username: currentUser.username,
    email: 'user@example.com',
    phone: '+1 234 567 8900',
    bio: currentUser.bio,
    location: 'San Francisco, CA',
    website: 'https://socialhub.com',
    
    // Privacy
    profileVisibility: 'public',
    showOnlineStatus: true,
    showLastSeen: true,
    showReadReceipts: true,
    allowTagging: true,
    allowMentions: true,
    
    // Notifications
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    likeNotifications: true,
    commentNotifications: true,
    followNotifications: true,
    messageNotifications: true,
    
    // Appearance
    theme: 'light',
    language: 'en',
    fontSize: 'medium',
    
    // Security
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: '30',
  });

  const handleSave = (section: string) => {
    toast.success(`${section} settings updated successfully!`);
  };

  return (
    <div className="space-y-4 pb-20 lg:pb-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="shadow-lg">
          <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b">
            <h1 className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <div className="border-b px-4">
              <ScrollArea className="w-full">
                <TabsList className="w-full justify-start bg-transparent flex-nowrap">
                  <TabsTrigger value="profile" className="gap-2 whitespace-nowrap">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Profile</span>
                  </TabsTrigger>
                  <TabsTrigger value="privacy" className="gap-2 whitespace-nowrap">
                    <Lock className="w-4 h-4" />
                    <span className="hidden sm:inline">Privacy</span>
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="gap-2 whitespace-nowrap">
                    <Bell className="w-4 h-4" />
                    <span className="hidden sm:inline">Notifications</span>
                  </TabsTrigger>
                  <TabsTrigger value="security" className="gap-2 whitespace-nowrap">
                    <Shield className="w-4 h-4" />
                    <span className="hidden sm:inline">Security</span>
                  </TabsTrigger>
                  <TabsTrigger value="appearance" className="gap-2 whitespace-nowrap">
                    <Palette className="w-4 h-4" />
                    <span className="hidden sm:inline">Appearance</span>
                  </TabsTrigger>
                  <TabsTrigger value="account" className="gap-2 whitespace-nowrap">
                    <Smartphone className="w-4 h-4" />
                    <span className="hidden sm:inline">Account</span>
                  </TabsTrigger>
                </TabsList>
              </ScrollArea>
            </div>

            {/* Profile Settings */}
            <TabsContent value="profile" className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg">Edit Profile</h3>
                
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <Avatar className="w-24 h-24 ring-4 ring-purple-100">
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback>{currentUser.fullName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                      <Camera className="w-4 h-4 mr-2" />
                      Change Photo
                    </Button>
                    <p className="text-xs text-gray-500">JPG, PNG. Max size 5MB</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={settings.fullName}
                      onChange={(e) => setSettings({ ...settings, fullName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={settings.username}
                      onChange={(e) => setSettings({ ...settings, username: e.target.value })}
                      placeholder="@username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        value={settings.phone}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={settings.bio}
                    onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                  <p className="text-xs text-gray-500">{settings.bio.length}/150 characters</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="location"
                        value={settings.location}
                        onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="website"
                        value={settings.website}
                        onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                  onClick={() => handleSave('Profile')}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </TabsContent>

            {/* Privacy Settings */}
            <TabsContent value="privacy" className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg">Privacy Settings</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Eye className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm">Profile Visibility</p>
                        <p className="text-xs text-gray-500">Who can see your profile</p>
                      </div>
                    </div>
                    <Select value={settings.profileVisibility} onValueChange={(v) => setSettings({ ...settings, profileVisibility: v })}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="friends">Friends</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm">Show Online Status</p>
                        <p className="text-xs text-gray-500">Let others see when you're online</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.showOnlineStatus}
                      onCheckedChange={(v) => setSettings({ ...settings, showOnlineStatus: v })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Eye className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm">Show Last Seen</p>
                        <p className="text-xs text-gray-500">Display when you were last active</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.showLastSeen}
                      onCheckedChange={(v) => setSettings({ ...settings, showLastSeen: v })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm">Read Receipts</p>
                        <p className="text-xs text-gray-500">Show when you've read messages</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.showReadReceipts}
                      onCheckedChange={(v) => setSettings({ ...settings, showReadReceipts: v })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="text-sm">Allow Tagging</p>
                        <p className="text-xs text-gray-500">Let others tag you in posts</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.allowTagging}
                      onCheckedChange={(v) => setSettings({ ...settings, allowTagging: v })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-pink-600" />
                      <div>
                        <p className="text-sm">Allow Mentions</p>
                        <p className="text-xs text-gray-500">Let others mention you in comments</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.allowMentions}
                      onCheckedChange={(v) => setSettings({ ...settings, allowMentions: v })}
                    />
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                  onClick={() => handleSave('Privacy')}
                >
                  Save Privacy Settings
                </Button>
              </div>
            </TabsContent>

            {/* Notifications Settings */}
            <TabsContent value="notifications" className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg">Notification Preferences</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm">Push Notifications</p>
                        <p className="text-xs text-gray-500">Receive push notifications</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(v) => setSettings({ ...settings, pushNotifications: v })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm">Email Notifications</p>
                        <p className="text-xs text-gray-500">Receive email updates</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(v) => setSettings({ ...settings, emailNotifications: v })}
                    />
                  </div>

                  <Separator />

                  <p className="text-sm text-gray-600">Notification Types</p>

                  <div className="space-y-3">
                    {[
                      { key: 'likeNotifications', label: 'Likes', icon: '❤️' },
                      { key: 'commentNotifications', label: 'Comments', icon: '💬' },
                      { key: 'followNotifications', label: 'New Followers', icon: '👥' },
                      { key: 'messageNotifications', label: 'Messages', icon: '✉️' },
                    ].map((notif) => (
                      <div key={notif.key} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{notif.icon}</span>
                          <p className="text-sm">{notif.label}</p>
                        </div>
                        <Switch
                          checked={settings[notif.key as keyof typeof settings] as boolean}
                          onCheckedChange={(v) => setSettings({ ...settings, [notif.key]: v })}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                  onClick={() => handleSave('Notifications')}
                >
                  Save Notification Settings
                </Button>
              </div>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg">Security Settings</h3>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm">Two-Factor Authentication</p>
                          <p className="text-xs text-gray-500">Add an extra layer of security</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.twoFactorAuth}
                        onCheckedChange={(v) => setSettings({ ...settings, twoFactorAuth: v })}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <Label>Change Password</Label>
                    <Input type="password" placeholder="Current password" />
                    <Input type="password" placeholder="New password" />
                    <Input type="password" placeholder="Confirm new password" />
                    <Button variant="outline" className="w-full">Update Password</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="text-sm">Login Alerts</p>
                        <p className="text-xs text-gray-500">Get notified of new logins</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.loginAlerts}
                      onCheckedChange={(v) => setSettings({ ...settings, loginAlerts: v })}
                    />
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <Label>Active Sessions</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-white rounded border">
                        <div>
                          <p className="text-sm">Chrome on MacOS</p>
                          <p className="text-xs text-gray-500">San Francisco, CA • Active now</p>
                        </div>
                        <Button variant="outline" size="sm">Logout</Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                  onClick={() => handleSave('Security')}
                >
                  Save Security Settings
                </Button>
              </div>
            </TabsContent>

            {/* Appearance Settings */}
            <TabsContent value="appearance" className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg">Appearance Settings</h3>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <Label>Theme</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {['light', 'dark', 'auto'].map((theme) => (
                        <button
                          key={theme}
                          onClick={() => setSettings({ ...settings, theme })}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            settings.theme === theme
                              ? 'border-purple-600 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          {theme === 'light' && <Sun className="w-6 h-6 mx-auto mb-2" />}
                          {theme === 'dark' && <Moon className="w-6 h-6 mx-auto mb-2" />}
                          {theme === 'auto' && <Smartphone className="w-6 h-6 mx-auto mb-2" />}
                          <p className="text-sm capitalize">{theme}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <Label>Language</Label>
                    <Select value={settings.language} onValueChange={(v) => setSettings({ ...settings, language: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="zh">中文</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <Label>Font Size</Label>
                    <Select value={settings.fontSize} onValueChange={(v) => setSettings({ ...settings, fontSize: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                  onClick={() => handleSave('Appearance')}
                >
                  Save Appearance Settings
                </Button>
              </div>
            </TabsContent>

            {/* Account Settings */}
            <TabsContent value="account" className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg">Account Management</h3>

                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Download className="w-5 h-5 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm">Download Your Data</p>
                        <p className="text-xs text-gray-600 mt-1">Get a copy of your posts, photos, and account info</p>
                        <Button variant="outline" size="sm" className="mt-3">
                          Request Download
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-start gap-3">
                      <Eye className="w-5 h-5 text-yellow-600 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm">Deactivate Account</p>
                        <p className="text-xs text-gray-600 mt-1">Temporarily disable your account</p>
                        <Button variant="outline" size="sm" className="mt-3">
                          Deactivate
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-start gap-3">
                      <Trash2 className="w-5 h-5 text-red-600 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm">Delete Account</p>
                        <p className="text-xs text-gray-600 mt-1">Permanently delete your account and all data</p>
                        <Button variant="destructive" size="sm" className="mt-3">
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  );
}
