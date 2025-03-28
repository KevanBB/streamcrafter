
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import StreamMedia from '@/components/StreamMedia';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const StreamPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const viewerMode = searchParams.get('viewerMode') === 'true';
  const username = searchParams.get('username') || 'Anonymous';
  const { toast } = useToast();
  
  // In a real application, we would connect to WebSocket here and handle signaling
  useEffect(() => {
    console.log(`Connected to room: ${roomId} as ${username}${viewerMode ? ' (Viewer)' : ''}`);
    
    if (viewerMode) {
      toast({
        title: "Viewer Mode Active",
        description: "You're watching this stream without broadcasting.",
      });
    }
    
    // This would be replaced with actual WebSocket connection
    // Example:
    // const socket = io('http://localhost:3001');
    // socket.emit('join-room', { roomId, username, isViewer: viewerMode });
    
    return () => {
      console.log(`Disconnected from room: ${roomId}`);
      // socket.disconnect();
    };
  }, [roomId, username, viewerMode]);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Stream Room: {roomId}</h1>
          {viewerMode && (
            <div className="bg-stream-purple/20 text-stream-purple px-3 py-1 rounded-full text-sm">
              Viewer Mode
            </div>
          )}
        </div>
        
        <StreamMedia roomId={roomId} viewerMode={viewerMode} />
        
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">About this Stream</h2>
          <p className="text-muted-foreground">
            You are currently in room {roomId} as {username}. 
            {viewerMode 
              ? " You are in viewer mode and won't broadcast your camera or microphone."
              : " Share this room ID with others to let them join your stream."}
          </p>
        </div>
      </div>
      
      <div className="lg:col-span-1">
        <Card className="bg-stream-gray border-stream-gray h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">Live Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="flex-1 bg-stream-dark rounded p-4 mb-4 overflow-y-auto">
              <div className="text-muted-foreground text-center p-4">
                Chat messages will appear here.
                <p className="mt-2 text-sm">
                  This is a placeholder for the real-time chat functionality that would be implemented with WebSockets.
                </p>
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full p-3 rounded bg-stream-dark border-stream-gray"
                disabled
              />
              <span className="absolute right-3 top-3 text-xs text-muted-foreground">
                Chat disabled in demo
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StreamPage;
