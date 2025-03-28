
import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Video, VideoOff, RefreshCw, Eye } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface StreamMediaProps {
  roomId?: string;
  viewerMode?: boolean;
}

const StreamMedia: React.FC<StreamMediaProps> = ({ roomId, viewerMode = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize media stream if not in viewer mode
  useEffect(() => {
    if (viewerMode) {
      setError(null);
      return;
    }
    
    initializeMedia();
    
    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
  }, [viewerMode]);

  const initializeMedia = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
        });
      }
      
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
    } catch (err) {
      console.error('Error accessing media devices:', err);
      setError('Could not access camera or microphone. Please check permissions.');
      toast({
        variant: "destructive",
        title: "Permission Error",
        description: "Media access was denied. You can continue in viewer mode.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle microphone
  const toggleMic = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !isMicEnabled;
      });
      setIsMicEnabled(!isMicEnabled);
    }
  };

  // Toggle camera
  const toggleCamera = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !isCameraEnabled;
      });
      setIsCameraEnabled(!isCameraEnabled);
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
                onClick={initializeMedia} 
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
          <div className="absolute inset-0 flex items-center justify-center bg-stream-gray">
            <div className="text-center p-6">
              <Eye className="h-12 w-12 mx-auto mb-4 text-stream-purple opacity-50" />
              <h3 className="text-xl font-medium mb-2">Viewer Mode</h3>
              <p className="text-sm text-stream-light opacity-75 max-w-md">
                You're viewing this stream without broadcasting. When the stream begins, content will appear here.
              </p>
            </div>
          </div>
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className={`w-full h-full object-cover ${!isCameraEnabled ? 'hidden' : ''}`}
          />
        )}
        
        {!isCameraEnabled && !error && !viewerMode && (
          <div className="absolute inset-0 flex items-center justify-center bg-stream-gray">
            <div className="text-stream-light text-xl font-medium">Camera is off</div>
          </div>
        )}

        {!viewerMode && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleMic} 
              className={`rounded-full bg-stream-gray/80 border-0 hover:bg-stream-purple ${!isMicEnabled ? 'bg-red-500/80 hover:bg-red-600' : ''}`}
              disabled={!stream}
            >
              {isMicEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleCamera} 
              className={`rounded-full bg-stream-gray/80 border-0 hover:bg-stream-purple ${!isCameraEnabled ? 'bg-red-500/80 hover:bg-red-600' : ''}`}
              disabled={!stream}
            >
              {isCameraEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StreamMedia;
