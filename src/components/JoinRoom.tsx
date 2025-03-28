
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

const JoinRoom: React.FC = () => {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim() && username.trim()) {
      navigate(`/stream/${roomId}?username=${encodeURIComponent(username)}`);
    }
  };

  const handleCreateRoom = () => {
    // Generate a random room ID
    const newRoomId = Math.random().toString(36).substring(2, 9);
    setRoomId(newRoomId);
  };

  return (
    <Card className="w-full max-w-md shadow-lg border-stream-gray bg-stream-gray">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Join a Stream</CardTitle>
        <CardDescription className="text-center">
          Enter a room code to join an existing stream or create a new one
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleJoinRoom} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Your display name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-stream-dark border-stream-gray"
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="bg-stream-dark border-stream-gray"
                required
              />
              <Button 
                type="button" 
                onClick={handleCreateRoom}
                variant="outline"
                className="whitespace-nowrap border-stream-purple text-stream-purple hover:bg-stream-purple hover:text-white"
              >
                Generate
              </Button>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full streaming-gradient hover:opacity-90"
            disabled={!roomId.trim() || !username.trim()}
          >
            Join Stream
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        <p>Joining as a viewer? Just enter the room ID and your name.</p>
      </CardFooter>
    </Card>
  );
};

export default JoinRoom;
