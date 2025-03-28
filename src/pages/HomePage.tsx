import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import JoinRoom from '@/components/JoinRoom';
import { Camera, Users, Globe, Zap, Shield, Sparkles } from "lucide-react";

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <Camera className="h-8 w-8 text-stream-purple" />,
      title: "Easy to Use",
      description: "No downloads required. Stream directly from your browser with just a few clicks."
    },
    {
      icon: <Zap className="h-8 w-8 text-stream-purple" />,
      title: "High Quality",
      description: "Enjoy clear audio and video with our optimized streaming technology."
    },
    {
      icon: <Globe className="h-8 w-8 text-stream-purple" />,
      title: "Connect Anywhere",
      description: "Stream from any device with a camera and internet connection."
    },
    {
      icon: <Shield className="h-8 w-8 text-stream-purple" />,
      title: "Secure & Private",
      description: "Your streams are encrypted and protected with industry-standard security."
    },
    {
      icon: <Users className="h-8 w-8 text-stream-purple" />,
      title: "Real-time Interaction",
      description: "Engage with your audience through live chat and reactions."
    },
    {
      icon: <Sparkles className="h-8 w-8 text-stream-purple" />,
      title: "Professional Features",
      description: "Access advanced features like screen sharing and custom overlays."
    }
  ];

  return (
    <div className="flex flex-col gap-16">
      {/* Hero Section */}
      <section className="relative py-20 flex flex-col items-center text-center gap-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-stream-dark/50 to-transparent z-0" />
        <div className="relative z-10 animate-fade-in">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="streaming-gradient bg-clip-text text-transparent">Live Streaming</span>
            <br /> Made Simple
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Create, share, and enjoy live streams with friends and followers. 
            No complicated setup, just instant streaming.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="streaming-gradient text-lg px-8 py-6" asChild>
              <Link to="/start-stream">Start Streaming</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-stream-purple text-stream-purple hover:bg-stream-purple hover:text-white text-lg px-8 py-6" asChild>
              <Link to="/explore">Explore Streams</Link>
            </Button>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-stream-purple/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-stream-purple/20 rounded-full blur-3xl animate-pulse-slow delay-1000" />
        </div>
      </section>
      
      {/* Preview Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4">
        <div className="relative animate-slide-in-left">
          <div className="aspect-video bg-stream-gray rounded-lg overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-stream-purple/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Camera className="h-16 w-16 text-stream-purple/50" />
            </div>
          </div>
        </div>
        
        <div className="animate-slide-in-right">
          <JoinRoom />
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">Why StreamCrafter?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the future of live streaming with our powerful platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-stream-gray/50 p-8 rounded-xl border border-stream-gray hover:border-stream-purple/50 transition-colors animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 bg-stream-gray/30">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Streaming?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of creators who are already streaming with StreamCrafter
          </p>
          <Button size="lg" className="streaming-gradient text-lg px-8 py-6" asChild>
            <Link to="/start-stream">Get Started Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
