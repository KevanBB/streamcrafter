
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import JoinRoom from '@/components/JoinRoom';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col gap-12">
      <section className="py-12 flex flex-col items-center text-center gap-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
          <span className="streaming-gradient bg-clip-text text-transparent">Live Streaming</span>
          <br /> Made Simple
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Create, share, and enjoy live streams with friends and followers. 
          No complicated setup, just instant streaming.
        </p>
        <div className="flex gap-4 mt-4">
          <Button size="lg" className="streaming-gradient" asChild>
            <Link to="/start-stream">Start Streaming</Link>
          </Button>
          <Button size="lg" variant="outline" className="border-stream-purple text-stream-purple hover:bg-stream-purple hover:text-white" asChild>
            <Link to="/explore">Explore Streams</Link>
          </Button>
        </div>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="aspect-video bg-stream-gray rounded-lg animate-pulse-slow streaming-gradient opacity-80"></div>
        <JoinRoom />
      </section>
      
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Why StreamCrafter?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            {
              title: "Easy to Use",
              description: "No downloads required. Stream directly from your browser with just a few clicks."
            },
            {
              title: "High Quality",
              description: "Enjoy clear audio and video with our optimized streaming technology."
            },
            {
              title: "Connect Anywhere",
              description: "Stream from any device with a camera and internet connection."
            }
          ].map((feature, i) => (
            <div key={i} className="bg-stream-gray p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
