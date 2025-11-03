// WebRTC Service for Real Video/Audio Calling
import { projectId, publicAnonKey } from './supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-9492d450`;

// ICE servers configuration (using free STUN servers)
const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
  ],
};

export type CallType = 'video' | 'audio';

export interface CallOffer {
  callId: string;
  from: string;
  to: string;
  type: CallType;
  offer: RTCSessionDescriptionInit;
  timestamp: number;
}

export interface CallAnswer {
  callId: string;
  answer: RTCSessionDescriptionInit;
}

export interface IceCandidate {
  callId: string;
  candidate: RTCIceCandidateInit;
}

export class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private callId: string | null = null;
  private pollingInterval: any = null;
  
  constructor() {
    this.remoteStream = new MediaStream();
  }

  // Initialize local media stream
  async initializeLocalStream(type: CallType): Promise<MediaStream> {
    try {
      const constraints = {
        audio: true,
        video: type === 'video' ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        } : false,
      };

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      return this.localStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw new Error('Failed to access camera/microphone. Please check permissions.');
    }
  }

  // Create peer connection
  private createPeerConnection(): RTCPeerConnection {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    // Add local stream tracks to peer connection
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        pc.addTrack(track, this.localStream!);
      });
    }

    // Handle remote stream
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach(track => {
        this.remoteStream?.addTrack(track);
      });
    };

    // Handle ICE candidates
    pc.onicecandidate = async (event) => {
      if (event.candidate && this.callId) {
        await this.sendIceCandidate(this.callId, event.candidate);
      }
    };

    // Connection state monitoring
    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState);
    };

    pc.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', pc.iceConnectionState);
    };

    return pc;
  }

  // Start a call (caller)
  async startCall(targetUserId: string, type: CallType): Promise<string> {
    try {
      // Initialize local stream
      await this.initializeLocalStream(type);

      // Create peer connection
      this.peerConnection = this.createPeerConnection();

      // Create offer
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      // Send offer to signaling server
      this.callId = await this.sendCallOffer(targetUserId, type, offer);

      // Start polling for answer and ICE candidates
      this.startPolling();

      return this.callId;
    } catch (error) {
      console.error('Error starting call:', error);
      this.cleanup();
      throw error;
    }
  }

  // Answer a call (callee)
  async answerCall(callId: string, offer: RTCSessionDescriptionInit, type: CallType): Promise<void> {
    try {
      this.callId = callId;

      // Initialize local stream
      await this.initializeLocalStream(type);

      // Create peer connection
      this.peerConnection = this.createPeerConnection();

      // Set remote description (offer)
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

      // Create answer
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      // Send answer to signaling server
      await this.sendCallAnswer(callId, answer);

      // Start polling for ICE candidates
      this.startPolling();
    } catch (error) {
      console.error('Error answering call:', error);
      this.cleanup();
      throw error;
    }
  }

  // Send call offer to server
  private async sendCallOffer(targetUserId: string, type: CallType, offer: RTCSessionDescriptionInit): Promise<string> {
    const token = localStorage.getItem('authToken') || publicAnonKey;
    const response = await fetch(`${API_URL}/webrtc/offer`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to: targetUserId, type, offer }),
    });

    if (!response.ok) {
      throw new Error('Failed to send call offer');
    }

    const data = await response.json();
    return data.callId;
  }

  // Send call answer to server
  private async sendCallAnswer(callId: string, answer: RTCSessionDescriptionInit): Promise<void> {
    const token = localStorage.getItem('authToken') || publicAnonKey;
    const response = await fetch(`${API_URL}/webrtc/answer`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ callId, answer }),
    });

    if (!response.ok) {
      throw new Error('Failed to send call answer');
    }
  }

  // Send ICE candidate to server
  private async sendIceCandidate(callId: string, candidate: RTCIceCandidate): Promise<void> {
    const token = localStorage.getItem('authToken') || publicAnonKey;
    try {
      await fetch(`${API_URL}/webrtc/ice-candidate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ callId, candidate: candidate.toJSON() }),
      });
    } catch (error) {
      console.error('Error sending ICE candidate:', error);
    }
  }

  // Poll for call answer and ICE candidates
  private startPolling(): void {
    this.pollingInterval = setInterval(async () => {
      if (!this.callId) return;

      try {
        await this.checkForAnswer();
        await this.checkForIceCandidates();
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 1000);
  }

  // Check for call answer
  private async checkForAnswer(): Promise<void> {
    if (!this.callId || this.peerConnection?.remoteDescription) return;

    const token = localStorage.getItem('authToken') || publicAnonKey;
    const response = await fetch(`${API_URL}/webrtc/answer/${this.callId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.answer) {
        await this.peerConnection?.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
    }
  }

  // Check for ICE candidates
  private async checkForIceCandidates(): Promise<void> {
    if (!this.callId) return;

    const token = localStorage.getItem('authToken') || publicAnonKey;
    const response = await fetch(`${API_URL}/webrtc/ice-candidates/${this.callId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.candidates && data.candidates.length > 0) {
        for (const candidate of data.candidates) {
          try {
            await this.peerConnection?.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (error) {
            console.error('Error adding ICE candidate:', error);
          }
        }
      }
    }
  }

  // Toggle microphone
  toggleMicrophone(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  // Toggle camera
  toggleCamera(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  // Get local stream
  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  // Get remote stream
  getRemoteStream(): MediaStream | null {
    return this.remoteStream;
  }

  // End call and cleanup
  cleanup(): void {
    // Stop polling
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }

    // Close peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    // Clear remote stream
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach(track => track.stop());
      this.remoteStream = new MediaStream();
    }

    this.callId = null;
  }

  // End call
  async endCall(): Promise<void> {
    if (this.callId) {
      const token = localStorage.getItem('authToken') || publicAnonKey;
      try {
        await fetch(`${API_URL}/webrtc/end/${this.callId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Error ending call:', error);
      }
    }
    this.cleanup();
  }
}

// Singleton instance
let webrtcInstance: WebRTCService | null = null;

export function getWebRTCInstance(): WebRTCService {
  if (!webrtcInstance) {
    webrtcInstance = new WebRTCService();
  }
  return webrtcInstance;
}

export function createNewWebRTCInstance(): WebRTCService {
  if (webrtcInstance) {
    webrtcInstance.cleanup();
  }
  webrtcInstance = new WebRTCService();
  return webrtcInstance;
}
