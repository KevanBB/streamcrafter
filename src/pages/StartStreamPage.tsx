
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StreamMedia from '@/components/StreamMedia';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Users, PenSquare } from "lucide-react";

const StartStreamPage: React.FC = () => {
  const [roomId, setRoomId] = useState(Math.random().toString(36).substring(2, 9));
  const [streamTitle, setStreamTitle] = useState('');
  const [username, setUsername] = useState('');
  const [streamCategory, setStreamCategory] = useState('Coding');
  const navigate = useNavigate();

  const handleStartStream = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId && username) {
      navigate(`/stream/${roomId}?username=${encodeURIComponent(username)}`);
    }
  };

  const handleJoinAsViewer = () => {
    if (roomId && username) {
      navigate(`/stream/${roomId}?username=${encodeURIComponent(username)}&viewerMode=true`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Start a New Stream</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <StreamMedia />
          
          <div className="mt-4 p-4 bg-stream-gray rounded-lg">
            <h2 className="text-lg font-semibold mb-2 flex items-center">
              <Camera className="mr-2 h-5 w-5 text-stream-purple" />
              Camera Preview
            </h2>
            <p className="text-sm text-muted-foreground">
              This is how viewers will see you. Make sure you have good lighting and your camera is positioned correctly.
            </p>
          </div>
        </div>
        
        <div>
          <Card className="bg-stream-gray border-stream-gray mb-4">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PenSquare className="mr-2 h-5 w-5 text-stream-purple" />
                Stream Settings
              </CardTitle>
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
                  <label className="text-sm font-medium">Stream Category</label>
                  <select
                    value={streamCategory}
                    onChange={(e) => setStreamCategory(e.target.value)}
                    className="w-full p-2 rounded bg-stream-dark border-stream-gray"
                  >
                    <option value="Coding">Coding</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Music">Music</option>
                    <option value="Art">Art</option>
                    <option value="Just Chatting">Just Chatting</option>
                  </select>
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
                
                <div className="flex flex-col gap-2">
                  <Button 
                    type="submit" 
                    className="w-full streaming-gradient"
                    disabled={!roomId || !username}
                  >
                    Start Streaming
                  </Button>
                  
                  <Button 
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleJoinAsViewer}
                    disabled={!roomId || !username}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Join as Viewer
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card className="bg-stream-gray border-stream-gray">
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Users className="mr-2 h-5 w-5 text-stream-purple" />
                Streaming Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 text-sm">
                <li>Make sure you have good lighting and a stable internet connection.</li>
                <li>Test your audio before starting your stream.</li>
                <li>Share your room ID with your audience through social media.</li>
                <li>Interact with your viewers through the live chat.</li>
                <li>Position yourself so viewers can see you clearly.</li>
                <li>Consider using headphones to prevent audio feedback.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StartStreamPage;
