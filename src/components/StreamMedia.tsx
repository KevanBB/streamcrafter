
import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";

interface StreamMediaProps {
  roomId?: string;
}

const StreamMedia: React.FC<StreamMediaProps> = ({ roomId }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize media stream
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: isCameraEnabled,
          audio: isMicEnabled
        });
        setStream(mediaStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error('Error accessing media devices:', err);
        setError('Could not access camera or microphone. Please check permissions.');
      }
    };

    initializeMedia();

    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
  }, []);

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

  return (
    <Card className="overflow-hidden bg-stream-gray border-stream-gray">
      <div className="relative aspect-video bg-stream-gray">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center text-white bg-stream-dark bg-opacity-90 p-4 text-center">
            <p>{error}</p>
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
        
        {!isCameraEnabled && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-stream-gray">
            <div className="text-stream-light text-xl font-medium">Camera is off</div>
          </div>
        )}

        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleMic} 
            className={`rounded-full bg-stream-gray/80 border-0 hover:bg-stream-purple ${!isMicEnabled ? 'bg-red-500/80 hover:bg-red-600' : ''}`}
          >
            {isMicEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleCamera} 
            className={`rounded-full bg-stream-gray/80 border-0 hover:bg-stream-purple ${!isCameraEnabled ? 'bg-red-500/80 hover:bg-red-600' : ''}`}
          >
            {isCameraEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default StreamMedia;
