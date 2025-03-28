import { supabase } from './supabase';

// Add type declarations for legacy media methods
declare global {
  interface Navigator {
    webkitGetUserMedia?: (constraints: MediaStreamConstraints, successCallback: (stream: MediaStream) => void, errorCallback: (error: Error) => void) => void;
    mozGetUserMedia?: (constraints: MediaStreamConstraints, successCallback: (stream: MediaStream) => void, errorCallback: (error: Error) => void) => void;
  }
}

export class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;

  constructor() {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      throw new Error('WebRTCService must be used in a browser environment');
    }

    // Initialize mediaDevices if it doesn't exist
    if (!navigator.mediaDevices) {
      // @ts-ignore - This is a polyfill for older browsers
      navigator.mediaDevices = {};
    }

    // Add getUserMedia polyfill for older browsers
    if (!navigator.mediaDevices.getUserMedia) {
      // @ts-ignore - This is a polyfill for older browsers
      navigator.mediaDevices.getUserMedia = function(constraints) {
        const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        
        if (!getUserMedia) {
          return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }

        return new Promise((resolve, reject) => {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      };
    }

    // Check if we're in a secure context (HTTPS or localhost)
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      throw new Error('MediaDevices API requires a secure context (HTTPS or localhost)');
    }

    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    });

    // Handle incoming tracks
    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0];
    };

    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendIceCandidate(event.candidate);
      }
    };
  }

  async startLocalStream(video: boolean, audio: boolean): Promise<MediaStream> {
    try {
      // Double check MediaDevices API availability
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('MediaDevices API is not supported in this browser');
      }

      // Request permissions with specific constraints
      const constraints: MediaStreamConstraints = {
        video: video ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        } : false,
        audio: audio ? {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } : false
      };

      // Add a small delay to ensure the browser has initialized mediaDevices
      await new Promise(resolve => setTimeout(resolve, 100));

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);

      // Add tracks to peer connection
      this.localStream.getTracks().forEach(track => {
        if (this.localStream && this.peerConnection) {
          this.peerConnection.addTrack(track, this.localStream);
        }
      });

      return this.localStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          throw new Error('Camera and microphone access was denied. Please allow access in your browser settings.');
        } else if (error.name === 'NotFoundError') {
          throw new Error('No camera or microphone found. Please connect a device and try again.');
        } else if (error.name === 'NotReadableError') {
          throw new Error('Camera or microphone is already in use by another application.');
        }
      }
      throw error;
    }
  }

  async createOffer(): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) throw new Error('Peer connection not initialized');
    
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    return offer;
  }

  async handleAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.peerConnection) throw new Error('Peer connection not initialized');
    await this.peerConnection.setRemoteDescription(answer);
  }

  async handleIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    if (!this.peerConnection) throw new Error('Peer connection not initialized');
    await this.peerConnection.addIceCandidate(candidate);
  }

  private async sendIceCandidate(candidate: RTCIceCandidate): Promise<void> {
    // Send ICE candidate to signaling server (Supabase)
    await supabase
      .from('ice_candidates')
      .insert([{ candidate: JSON.stringify(candidate) }]);
  }

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  getRemoteStream(): MediaStream | null {
    return this.remoteStream;
  }

  stop(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    this.remoteStream = null;
  }
} 