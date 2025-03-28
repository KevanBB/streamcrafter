
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ExplorePage: React.FC = () => {
  // In a real application, we would fetch active streams from the server
  const demoStreams = [
    { id: 'demo1', title: 'Gaming Session', username: 'GameMaster', viewers: 42 },
    { id: 'demo2', title: 'Cooking Italian Pasta', username: 'ChefJulia', viewers: 128 },
    { id: 'demo3', title: 'Live Coding', username: 'TechDev', viewers: 76 },
    { id: 'demo4', title: 'Music Session', username: 'MusicLover', viewers: 53 },
    { id: 'demo5', title: 'Travel Vlog - Paris', username: 'Wanderer', viewers: 95 },
    { id: 'demo6', title: 'Art & Design', username: 'CreativeArtist', viewers: 31 },
  ];
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Explore Streams</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoStreams.map((stream) => (
          <Card key={stream.id} className="overflow-hidden bg-stream-gray border-stream-gray hover:border-stream-purple transition-colors">
            <div className="aspect-video bg-stream-dark relative">
              <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md">
                LIVE
              </div>
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-md">
                {stream.viewers} viewers
              </div>
              <div className="h-full streaming-gradient opacity-10"></div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg truncate">{stream.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{stream.username}</p>
              <Button 
                className="w-full streaming-gradient" 
                size="sm"
                asChild
              >
                <Link to={`/stream/${stream.id}?username=Viewer`}>
                  Join Stream
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-muted-foreground mb-4">
          Don't see anything you like? Start your own stream!
        </p>
        <Button className="streaming-gradient" asChild>
          <Link to="/start-stream">Start Streaming</Link>
        </Button>
      </div>
    </div>
  );
};

export default ExplorePage;
