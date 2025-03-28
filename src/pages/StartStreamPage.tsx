
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StreamMedia from '@/components/StreamMedia';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StartStreamPage: React.FC = () => {
  const [roomId, setRoomId] = useState(Math.random().toString(36).substring(2, 9));
  const [streamTitle, setStreamTitle] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleStartStream = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId && username) {
      navigate(`/stream/${roomId}?username=${encodeURIComponent(username)}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Start a New Stream</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <StreamMedia />
        </div>
        
        <div>
          <Card className="bg-stream-gray border-stream-gray">
            <CardHeader>
              <CardTitle>Stream Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStartStream} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Name</label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Display name for the stream"
                    className="bg-stream-dark border-stream-gray"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Stream Title</label>
                  <Input
                    value={streamTitle}
                    onChange={(e) => setStreamTitle(e.target.value)}
                    placeholder="Give your stream a title"
                    className="bg-stream-dark border-stream-gray"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Room ID</label>
                  <Input
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="Room ID"
                    className="bg-stream-dark border-stream-gray"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Share this ID with people you want to join your stream.</p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full streaming-gradient"
                  disabled={!roomId || !username}
                >
                  Start Streaming
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-stream-gray rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Streaming Tips</h2>
        <ul className="list-disc list-inside text-muted-foreground space-y-1">
          <li>Make sure you have good lighting and a stable internet connection.</li>
          <li>Test your audio before starting your stream.</li>
          <li>Share your room ID with your audience through social media or messaging apps.</li>
          <li>Interact with your viewers through the live chat.</li>
        </ul>
      </div>
    </div>
  );
};

export default StartStreamPage;
