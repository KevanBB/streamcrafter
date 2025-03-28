import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Video, VideoOff, RefreshCw, Eye, Camera, Play } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { WebRTCService } from '@/lib/webrtc';
import { supabase } from '@/lib/supabase';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

interface StreamMediaProps {
  roomId?: string;
  viewerMode?: boolean;
}

const StreamMedia: React.FC<StreamMediaProps> = ({ roomId, viewerMode = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webrtc] = useState(() => new WebRTCService());
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const { toast } = useToast();

  // Subscribe to ICE candidates
  useEffect(() => {
    if (!roomId) return;

    const subscription = supabase
      .channel(`ice_candidates:${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'ice_candidates',
        filter: `room_id=eq.${roomId}`
      }, async (payload) => {
        const candidate = JSON.parse(payload.new.candidate);
        await webrtc.handleIceCandidate(candidate);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [roomId, webrtc]);

  // Request permissions explicitly
  const requestMediaPermissions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setShowPermissionDialog(false);
    
    try {
      const mediaStream = await webrtc.startLocalStream(isCameraEnabled, isMicEnabled);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      toast({
        title: "Media connected",
        description: "Camera and microphone connected successfully",
      });
      
      if (!isStreamActive) {
        setIsStreamActive(true);
        startAudioVisualization(mediaStream);
      }
      
    } catch (err) {
      console.error('Error accessing media devices:', err);
      setError('Could not access camera or microphone. Please check permissions in your browser settings.');
      setShowPermissionDialog(true);
    } finally {
      setIsLoading(false);
    }
  }, [isCameraEnabled, isMicEnabled, toast, isStreamActive, webrtc]);

  // Initialize media stream if not in viewer mode
  useEffect(() => {
    if (viewerMode) {
      setError(null);
      setIsStreamActive(true);
      return;
    }
    
    if (!webrtc.getLocalStream()) {
      setShowPermissionDialog(true);
    }
    
    return () => {
      webrtc.stop();
    };
  }, [viewerMode, webrtc]);

  // Audio visualization
  const startAudioVisualization = (mediaStream: MediaStream) => {
    if (!canvasRef.current) return;
    
    try {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(mediaStream);
      
      source.connect(analyser);
      analyser.fftSize = 256;
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const canvas = canvasRef.current;
      const canvasCtx = canvas.getContext('2d');
      
      if (!canvasCtx) return;
      
      const width = canvas.width;
      const height = canvas.height;
      
      function draw() {
        if (!isStreamActive) return;
        
        requestAnimationFrame(draw);
        
        analyser.getByteFrequencyData(dataArray);
        
        canvasCtx.fillStyle = 'rgb(26, 31, 44)';
        canvasCtx.fillRect(0, 0, width, height);
        
        const barWidth = (width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;
        
        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i] / 2;
          
          canvasCtx.fillStyle = `rgb(${155 + i}, ${135}, ${245})`;
          canvasCtx.fillRect(x, height - barHeight, barWidth, barHeight);
          
          x += barWidth + 1;
        }
      }
      
      draw();
    } catch (err) {
      console.error('Audio visualization error:', err);
    }
  };

  // Toggle microphone
  const toggleMic = () => {
    const stream = webrtc.getLocalStream();
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !isMicEnabled;
      });
      setIsMicEnabled(!isMicEnabled);
      
      toast({
        title: isMicEnabled ? "Microphone Disabled" : "Microphone Enabled",
        description: isMicEnabled ? "You are now muted" : "Others can hear you now"
      });
    }
  };

  // Toggle camera
  const toggleCamera = () => {
    const stream = webrtc.getLocalStream();
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !isCameraEnabled;
      });
      setIsCameraEnabled(!isCameraEnabled);
      
      toast({
        title: isCameraEnabled ? "Camera Disabled" : "Camera Enabled",
        description: isCameraEnabled ? "Your video is now hidden" : "Others can see you now"
      });
    }
  };

  // Start/stop streaming
  const toggleStreaming = async () => {
    if (isStreamActive) {
      setIsStreamActive(false);
      webrtc.stop();
      toast({
        title: "Stream Ended",
        description: "Your stream has been stopped",
      });
    } else {
      try {
        const stream = await webrtc.startLocalStream(isCameraEnabled, isMicEnabled);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsStreamActive(true);
        startAudioVisualization(stream);
        
        // Create and send offer if we're the broadcaster
        if (!viewerMode && roomId) {
          const offer = await webrtc.createOffer();
          await supabase
            .from('stream_offers')
            .insert([{ room_id: roomId, offer: JSON.stringify(offer) }]);
        }
        
        toast({
          title: "Stream Started",
          description: "You are now live!",
        });
      } catch (err) {
        console.error('Error starting stream:', err);
        toast({
          title: "Error",
          description: "Failed to start stream. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card className="overflow-hidden bg-stream-gray border-stream-gray">
      <div className="relative aspect-video bg-stream-gray">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-stream-dark bg-opacity-90 p-6 text-center">
            <Alert variant="destructive" className="mb-4 max-w-md">
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-3 mt-4">
              <Button 
                onClick={requestMediaPermissions} 
                className="gap-2"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted={!viewerMode}
              className="w-full h-full object-cover"
            />
            <canvas
              ref={canvasRef}
              className="absolute bottom-0 left-0 w-full h-16 opacity-50"
              width={800}
              height={64}
            />
          </>
        )}
        
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          <Button
            onClick={toggleMic}
            variant="secondary"
            size="icon"
            className="rounded-full bg-stream-dark/80 hover:bg-stream-dark"
          >
            {isMicEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>
          
          <Button
            onClick={toggleCamera}
            variant="secondary"
            size="icon"
            className="rounded-full bg-stream-dark/80 hover:bg-stream-dark"
          >
            {isCameraEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>
          
          <Button
            onClick={toggleStreaming}
            variant="secondary"
            size="icon"
            className="rounded-full bg-stream-dark/80 hover:bg-stream-dark"
          >
            {isStreamActive ? <Play className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <Dialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Camera & Microphone Access</DialogTitle>
            <DialogDescription>
              StreamCrafter needs access to your camera and microphone to enable streaming.
              Please allow access in your browser settings.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={requestMediaPermissions}>
              Allow Access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default StreamMedia;
