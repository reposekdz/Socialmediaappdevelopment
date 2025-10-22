import { useState } from 'react';
import { ResponsiveLeftSidebar } from './ResponsiveLeftSidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { RightSidebar } from './RightSidebar';
import { Feed } from './Feed';
import { Reels } from './Reels';
import { Explore } from './Explore';
import { EnhancedMessages } from './EnhancedMessages';
import { Notifications } from './Notifications';
import { AdvancedProfile } from './AdvancedProfile';
import { Groups } from './Groups';
import { Search } from './Search';
import { SettingsPage } from './SettingsPage';
import { VideoCallModal } from './VideoCallModal';
import { AudioCallModal } from './AudioCallModal';
import { EnhancedCreatePost } from './EnhancedCreatePost';
import { LiveStreamingModal } from './LiveStreamingModal';
import { StoryCreator } from './StoryCreator';
import { ReelsCreator } from './ReelsCreator';
import { HighlightManager } from './HighlightManager';
import { MediaUploader } from './MediaUploader';

interface MainLayoutProps {
  currentUser: any;
  onLogout: () => void;
}

export function MainLayout({ currentUser, onLogout }: MainLayoutProps) {
  const [currentView, setCurrentView] = useState('feed');
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showAudioCall, setShowAudioCall] = useState(false);
  const [callUser, setCallUser] = useState<any>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showLiveStream, setShowLiveStream] = useState(false);
  const [showStoryCreator, setShowStoryCreator] = useState(false);
  const [showReelsCreator, setShowReelsCreator] = useState(false);
  const [showHighlightManager, setShowHighlightManager] = useState(false);
  const [showMediaUploader, setShowMediaUploader] = useState(false);

  const handleStartVideoCall = (user: any) => {
    setCallUser(user);
    setShowVideoCall(true);
  };

  const handleStartAudioCall = (user: any) => {
    setCallUser(user);
    setShowAudioCall(true);
  };

  const handleViewChange = (view: string) => {
    if (view === 'create') {
      setShowCreatePost(true);
    } else if (view === 'live') {
      setShowLiveStream(true);
    } else if (view === 'story') {
      setShowStoryCreator(true);
    } else if (view === 'createReel') {
      setShowReelsCreator(true);
    } else if (view === 'highlights') {
      setShowHighlightManager(true);
    } else if (view === 'upload') {
      setShowMediaUploader(true);
    } else {
      setCurrentView(view);
    }
  };

  const renderMainContent = () => {
    switch (currentView) {
      case 'feed':
        return <Feed currentUser={currentUser} onStartVideoCall={handleStartVideoCall} onStartAudioCall={handleStartAudioCall} />;
      case 'reels':
        return <Reels currentUser={currentUser} />;
      case 'explore':
        return <Explore currentUser={currentUser} />;
      case 'messages':
        return <EnhancedMessages currentUser={currentUser} onStartVideoCall={handleStartVideoCall} onStartAudioCall={handleStartAudioCall} />;
      case 'notifications':
        return <Notifications currentUser={currentUser} />;
      case 'profile':
        return <AdvancedProfile currentUser={currentUser} />;
      case 'groups':
        return <Groups currentUser={currentUser} />;
      case 'search':
        return <Search currentUser={currentUser} />;
      case 'settings':
        return <SettingsPage currentUser={currentUser} />;
      default:
        return <Feed currentUser={currentUser} onStartVideoCall={handleStartVideoCall} onStartAudioCall={handleStartAudioCall} />;
    }
  };

  const handleCreatePost = (post: any) => {
    setShowCreatePost(false);
    // Handle post creation
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1920px] mx-auto grid grid-cols-12 lg:gap-6 p-0 lg:p-4">
        {/* Left Sidebar - Desktop Only */}
        <div className="hidden lg:block lg:col-span-2 xl:col-span-2">
          <ResponsiveLeftSidebar 
            currentUser={currentUser} 
            currentView={currentView}
            onViewChange={handleViewChange}
            onLogout={onLogout}
          />
        </div>

        {/* Main Content */}
        <div className="col-span-12 lg:col-span-7 xl:col-span-7 px-4 lg:px-0 pb-20 lg:pb-0">
          {renderMainContent()}
        </div>

        {/* Right Sidebar - Desktop Only */}
        <div className="hidden lg:block lg:col-span-3 xl:col-span-3">
          <RightSidebar currentUser={currentUser} />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav 
        currentView={currentView}
        onViewChange={handleViewChange}
        unreadMessages={12}
      />

      {/* Video Call Modal */}
      {showVideoCall && (
        <VideoCallModal
          user={callUser}
          currentUser={currentUser}
          onClose={() => setShowVideoCall(false)}
        />
      )}

      {/* Audio Call Modal */}
      {showAudioCall && (
        <AudioCallModal
          user={callUser}
          currentUser={currentUser}
          onClose={() => setShowAudioCall(false)}
        />
      )}

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <EnhancedCreatePost
              currentUser={currentUser}
              onCreatePost={handleCreatePost}
            />
            <button
              onClick={() => setShowCreatePost(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center z-10"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Live Streaming Modal */}
      {showLiveStream && (
        <LiveStreamingModal
          onClose={() => setShowLiveStream(false)}
          currentUser={currentUser}
        />
      )}

      {/* Story Creator Modal */}
      {showStoryCreator && (
        <StoryCreator
          onClose={() => setShowStoryCreator(false)}
          onPublish={(story) => {
            console.log('Story published:', story);
            setShowStoryCreator(false);
          }}
        />
      )}

      {/* Reels Creator Modal */}
      {showReelsCreator && (
        <ReelsCreator
          onClose={() => setShowReelsCreator(false)}
          onPublish={(reel) => {
            console.log('Reel published:', reel);
            setShowReelsCreator(false);
          }}
        />
      )}

      {/* Highlight Manager */}
      <HighlightManager
        open={showHighlightManager}
        onClose={() => setShowHighlightManager(false)}
        currentUser={currentUser}
      />

      {/* Media Uploader */}
      <MediaUploader
        open={showMediaUploader}
        onClose={() => setShowMediaUploader(false)}
        onUpload={(media) => {
          console.log('Media uploaded:', media);
          setShowMediaUploader(false);
        }}
      />
    </div>
  );
}
