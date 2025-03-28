
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Video, VideoOff, RefreshCw, Eye, Camera, Play } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
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
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [mockViewerCount, setMockViewerCount] = useState(0);
  const { toast } = useToast();

  // Initialize mock viewer count
  useEffect(() => {
    if (isStreamActive) {
      const interval = setInterval(() => {
        // Randomly increment or decrement viewer count (1-20 range)
        setMockViewerCount(prev => {
          const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
          const newCount = Math.max(1, Math.min(20, prev + change));
          return newCount;
        });
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isStreamActive]);

  // Request permissions explicitly
  const requestMediaPermissions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setShowPermissionDialog(false);
    
    try {
      // First just check if permissions are already granted
      const permissions = await navigator.permissions.query({ 
        name: 'camera' as PermissionName 
      });
      
      if (permissions.state === 'denied') {
        setError('Permission for camera/microphone has been denied. Please enable in your browser settings.');
        setShowPermissionDialog(true);
        return;
      }
      
      // Actually request the media stream
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: isCameraEnabled,
        audio: isMicEnabled
      });
      
      setStream(mediaStream);
      
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
  }, [isCameraEnabled, isMicEnabled, toast, isStreamActive]);

  // Initialize media stream if not in viewer mode
  useEffect(() => {
    if (viewerMode) {
      setError(null);
      setIsStreamActive(true); // Start mock stream for viewers
      return;
    }
    
    // Show permission dialog on component mount
    if (!stream) {
      setShowPermissionDialog(true);
    }
    
    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
  }, [viewerMode, stream]);
  
  // Audio visualization for mock streaming
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
  const toggleStreaming = () => {
    if (isStreamActive) {
      setIsStreamActive(false);
      toast({
        title: "Stream Ended",
        description: "Your stream has been stopped",
      });
    } else {
      setIsStreamActive(true);
      if (stream) {
        startAudioVisualization(stream);
      }
      toast({
        title: "Stream Started",
        description: "You are now live!",
      });
    }
  };

  // Switch to viewer mode
  const enableViewerMode = () => window.location.search = '?viewerMode=true';

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
              
              <Button 
                onClick={enableViewerMode}
                variant="outline" 
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                Continue as Viewer
              </Button>
            </div>
          </div>
        ) : viewerMode ? (
          <div className="absolute inset-0 flex items-center justify-center bg-stream-dark">
            {isStreamActive ? (
              <div className="text-center w-full h-full flex flex-col items-center justify-center">
                <div className="w-full h-full relative">
                  <canvas ref={canvasRef} width="640" height="360" className="w-full h-full" />
                  <div className="absolute bottom-4 right-4 bg-stream-purple/30 text-white px-2 py-1 rounded-md text-sm flex items-center">
                    <Eye className="h-4 w-4 mr-1" /> {mockViewerCount}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-6">
                <Eye className="h-12 w-12 mx-auto mb-4 text-stream-purple opacity-50" />
                <h3 className="text-xl font-medium mb-2">Waiting for Stream</h3>
                <p className="text-sm text-stream-light opacity-75 max-w-md">
                  The streamer hasn't started broadcasting yet. The stream will appear here once it begins.
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className={`w-full h-full object-cover ${!isCameraEnabled || !isStreamActive ? 'hidden' : ''}`}
            />
            <canvas 
              ref={canvasRef} 
              width="640" 
              height="360" 
              className={`w-full h-full ${!isStreamActive || isCameraEnabled ? 'hidden' : ''}`} 
            />
          </>
        )}
        
        {(!isCameraEnabled || !isStreamActive) && !error && !viewerMode && (
          <div className="absolute inset-0 flex items-center justify-center bg-stream-dark">
            <div className="text-center">
              {!isStreamActive ? (
                <>
                  <Camera className="h-12 w-12 mx-auto mb-4 text-stream-purple opacity-50" />
                  <h3 className="text-xl font-medium mb-2">Ready to Stream</h3>
                  <p className="text-sm text-stream-light opacity-75 max-w-md mb-4">
                    Click the Start Streaming button below to go live.
                  </p>
                </>
              ) : (
                <div className="text-stream-light text-xl font-medium">Camera is off</div>
              )}
            </div>
          </div>
        )}

        {!viewerMode && (
          <>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={toggleMic} 
                className={`rounded-full bg-stream-gray/80 border-0 hover:bg-stream-purple ${!isMicEnabled ? 'bg-red-500/80 hover:bg-red-600' : ''}`}
                disabled={!stream || !isStreamActive}
              >
                {isMicEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={toggleCamera} 
                className={`rounded-full bg-stream-gray/80 border-0 hover:bg-stream-purple ${!isCameraEnabled ? 'bg-red-500/80 hover:bg-red-600' : ''}`}
                disabled={!stream || !isStreamActive}
              >
                {isCameraEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>
              
              <Button
                onClick={toggleStreaming}
                className={`rounded-full ${isStreamActive ? 'bg-red-500 hover:bg-red-600' : 'bg-stream-purple hover:bg-stream-purple/80'} border-0 px-4`}
                disabled={!stream}
              >
                {isStreamActive ? 'End Stream' : 'Start Streaming'}
              </Button>
            </div>
            
            {isStreamActive && (
              <div className="absolute top-4 right-4 bg-stream-purple/30 text-white px-2 py-1 rounded-md text-sm flex items-center">
                <Eye className="h-4 w-4 mr-1" /> {mockViewerCount}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Permission Dialog */}
      <Dialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
        <DialogContent className="bg-stream-gray text-white border-stream-dark">
          <DialogHeader>
            <DialogTitle>Allow Camera & Microphone Access</DialogTitle>
            <DialogDescription className="text-stream-light">
              This app needs permission to use your camera and microphone for streaming. Please allow access when prompted by your browser.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <Camera className="h-16 w-16 text-stream-purple mx-2" />
            <Mic className="h-16 w-16 text-stream-purple mx-2" />
          </div>
          <DialogFooter>
            <Button onClick={requestMediaPermissions} className="w-full streaming-gradient">
              <Camera className="h-4 w-4 mr-2" /> Request Permissions
            </Button>
            <Button onClick={enableViewerMode} variant="outline" className="w-full mt-2">
              <Eye className="h-4 w-4 mr-2" /> Continue as Viewer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default StreamMedia;
