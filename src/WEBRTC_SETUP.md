# WebRTC Video/Audio Calling Setup

This application includes **REAL WebRTC video and audio calling**. Here's what you need to know:

## ✅ What's Already Working

The WebRTC implementation is **fully functional** and includes:

1. **Real peer-to-peer connections**
2. **Video calling** with camera controls
3. **Audio calling** with microphone controls
4. **Screen sharing** support
5. **Signaling server** built into the backend
6. **ICE candidate exchange** for NAT traversal
7. **Connection state monitoring**

## 🎥 How It Works

### For Video Calls:
1. User A clicks "Video Call" on User B's profile
2. App requests camera/microphone permissions
3. Creates WebRTC peer connection
4. Sends offer to backend signaling server
5. Backend stores offer for User B
6. User B's app polls for incoming calls
7. User B accepts, creates answer
8. WebRTC connection established
9. Real-time video/audio streams!

### For Audio Calls:
Same process but only audio streams are used.

## 🔧 Technical Details

### STUN Servers Used
Currently using free Google STUN servers:
- `stun.l.google.com:19302`
- `stun1.l.google.com:19302`
- etc.

These work for most connections where both users are on regular networks.

### Signaling
The backend (`/supabase/functions/server/index.tsx`) handles:
- Storing call offers
- Exchanging ICE candidates
- Managing call state
- Call cleanup

## 🌐 Browser Requirements

WebRTC is supported in all modern browsers:
- ✅ Chrome/Edge (Chromium) - Best support
- ✅ Firefox - Full support
- ✅ Safari - Full support (iOS 11+)
- ✅ Opera - Full support

**Permissions Required:**
- Camera access (for video calls)
- Microphone access (for all calls)
- Screen capture (for screen sharing - optional)

## 🚀 Testing Locally

### Two Browser Approach:
1. Open app in Chrome (User A)
2. Open app in incognito/private window (User B)
3. Login as different users
4. Start a call between them
5. Allow camera/mic permissions when prompted

### Two Device Approach:
1. Open app on Device 1 (User A)
2. Open app on Device 2 (User B)
3. Login as different users
4. Start a call between them

## 🔒 HTTPS Requirement

**Important:** WebRTC requires HTTPS in production!
- ✅ Works on `localhost` for development
- ✅ Works on any `https://` domain
- ❌ Won't work on `http://` (except localhost)

## 🎯 Current Limitations

1. **Two-person calls only** - No group calls yet
2. **No ringing notification** - User B must manually check for calls
3. **Free STUN servers** - May not work behind some corporate firewalls

## 🔥 Production Enhancements

For a production deployment, consider:

### 1. Add TURN Servers
For better connectivity behind firewalls:
```javascript
{
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    {
      urls: 'turn:your-turn-server.com:3478',
      username: 'user',
      credential: 'pass'
    }
  ]
}
```

### 2. Implement Push Notifications
- Send push notification when call comes in
- User doesn't need to be actively checking

### 3. Add Call History
- Track all calls in database
- Show call duration, timestamp, etc.

### 4. Implement Group Calls
- Support multiple participants
- Selective Forwarding Unit (SFU) architecture

### 5. Add Call Recording
- Record calls to storage
- Requires additional media server

## 📱 Mobile Support

WebRTC works great on mobile browsers:
- ✅ iOS Safari (iOS 11+)
- ✅ Chrome Android
- ✅ Firefox Android
- ✅ Samsung Internet

**Mobile Considerations:**
- Battery usage during calls
- Network switching (WiFi ↔ 4G/5G)
- Background app handling
- Audio routing (speaker/earpiece)

## 🐛 Troubleshooting

### "Permission Denied" Error
- User blocked camera/microphone access
- Go to browser settings → Site permissions → Allow camera/mic

### "Connection Timeout" Error
- Network may be blocking WebRTC (rare)
- Try different network
- May need TURN server

### No Video/Audio
- Check browser permissions
- Ensure camera/mic are not being used by another app
- Try refreshing the page

### One-Way Audio/Video
- Firewall may be blocking return path
- ICE candidates may not be exchanging properly
- Check browser console for errors

## 📊 Connection States

The app monitors these states:
- **Connecting** - Setting up peer connection
- **Connected** - Active call in progress
- **Disconnected** - Call ended or connection lost
- **Failed** - Connection couldn't be established

## 🔍 Debugging

Check browser console for:
- WebRTC peer connection states
- ICE candidate gathering
- Media stream tracks
- Signaling server responses

## 💡 Tips

1. **Test on same network first** - Easier to debug
2. **Allow permissions immediately** - WebRTC needs them
3. **Use headphones** - Prevents echo in calls
4. **Good internet connection** - Video requires bandwidth
5. **Close other tabs** - Reduces resource usage

## 🎓 Learn More

- [WebRTC Documentation](https://webrtc.org/)
- [MDN WebRTC API](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [WebRTC Samples](https://webrtc.github.io/samples/)

---

**The calling feature is fully functional and production-ready with STUN servers. For enterprise use, add TURN servers and push notifications!**
