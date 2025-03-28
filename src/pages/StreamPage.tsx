
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import StreamMedia from '@/components/StreamMedia';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StreamPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const username = searchParams.get('username') || 'Anonymous';
  
  // In a real application, we would connect to WebSocket here and handle signaling
  useEffect(() => {
    console.log(`Connected to room: ${roomId} as ${username}`);
    
    // This would be replaced with actual WebSocket connection
    // Example:
    // const socket = io('http://localhost:3001');
    // socket.emit('join-room', { roomId, username });
    
    return () => {
      console.log(`Disconnected from room: ${roomId}`);
      // socket.disconnect();
    };
  }, [roomId, username]);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <h1 className="text-2xl font-bold mb-4">Stream Room: {roomId}</h1>
        <StreamMedia roomId={roomId} />
        
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">About this Stream</h2>
          <p className="text-muted-foreground">
            You are currently in room {roomId} as {username}. Share this room ID with others to let them join your stream.
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
