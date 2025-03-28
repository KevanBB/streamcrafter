
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import StreamMedia from '@/components/StreamMedia';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
}

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    username: 'StreamFan42',
    message: 'Hey everyone! Excited for this stream!',
    timestamp: new Date(Date.now() - 1000 * 60 * 5)
  },
  {
    id: '2',
    username: 'TechGuru',
    message: 'The quality looks great today!',
    timestamp: new Date(Date.now() - 1000 * 60 * 3)
  },
  {
    id: '3',
    username: 'CodingNinja',
    message: 'What are you working on today?',
    timestamp: new Date(Date.now() - 1000 * 60 * 1)
  }
];

const StreamPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const viewerMode = searchParams.get('viewerMode') === 'true';
  const username = searchParams.get('username') || 'Anonymous';
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  
  // Simulate connection to room
  useEffect(() => {
    console.log(`Connected to room: ${roomId} as ${username}${viewerMode ? ' (Viewer)' : ''}`);
    
    // Display connection toast after a short delay to simulate connection
    const connectionTimer = setTimeout(() => {
      setIsConnected(true);
      
      toast({
        title: viewerMode ? "Joined as Viewer" : "Stream Connected",
        description: viewerMode 
          ? "You're watching this stream without broadcasting." 
          : "Your stream is now live! Others can join with your room ID."
      });
    }, 1500);
    
    // Simulate receiving random chat messages
    const chatInterval = setInterval(() => {
      const randomUsers = ['StreamFan99', 'CodeMaster', 'TechEnthusiast', 'WebDev2023', 'ViewerX'];
      const randomMessages = [
        'Great content!',
        'How did you learn to code?',
        'What IDE are you using?',
        'This is awesome!',
        'Hello from California!',
        'First time watching, loving it!',
        'Can you explain that again?'
      ];
      
      if (Math.random() > 0.6) { // 40% chance to get a new message
        const newRandomMessage: ChatMessage = {
          id: Date.now().toString(),
          username: randomUsers[Math.floor(Math.random() * randomUsers.length)],
          message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, newRandomMessage].slice(-20)); // Keep only last 20 messages
      }
    }, 8000);
    
    return () => {
      console.log(`Disconnected from room: ${roomId}`);
      clearTimeout(connectionTimer);
      clearInterval(chatInterval);
    };
  }, [roomId, username, viewerMode, toast]);
  
  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Send a new chat message
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      username: username,
      message: newMessage.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage].slice(-20));
    setNewMessage('');
    
    // Simulate a response to user's message sometimes
    if (Math.random() > 0.7) {
      setTimeout(() => {
        const responses = [
          `Thanks for the comment, ${username}!`,
          'Great question! Let me show you...',
          'I appreciate your feedback!',
          'Good point, let me address that'
        ];
        
        const hostResponse: ChatMessage = {
          id: Date.now().toString(),
          username: 'Host',
          message: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, hostResponse].slice(-20));
      }, 2000 + Math.random() * 3000);
    }
  };
  
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
            <div className="flex-1 bg-stream-dark rounded p-4 mb-4 overflow-y-auto flex flex-col space-y-3">
              {!isConnected ? (
                <div className="text-muted-foreground text-center p-4 opacity-75">
                  Connecting to chat...
                </div>
              ) : messages.length === 0 ? (
                <div className="text-muted-foreground text-center p-4">
                  No messages yet. Be the first to chat!
                </div>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className={`rounded p-2 ${msg.username === username ? 'bg-stream-purple/20' : 'bg-stream-gray/20'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`font-medium ${msg.username === 'Host' ? 'text-stream-purple' : 'text-stream-light'}`}>
                        {msg.username}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm break-words">{msg.message}</p>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={sendMessage} className="relative">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full p-3 pr-12 rounded bg-stream-dark border-stream-gray"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button 
                type="submit" 
                size="icon" 
                className="absolute right-2 top-2 bg-stream-purple/80 hover:bg-stream-purple rounded-full h-8 w-8 p-0"
                disabled={!newMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StreamPage;
