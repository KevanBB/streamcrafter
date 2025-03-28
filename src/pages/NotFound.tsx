
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold mb-4 streaming-gradient bg-clip-text text-transparent">404</h1>
      <p className="text-xl text-muted-foreground mb-8">The stream you're looking for doesn't exist.</p>
      <div className="flex gap-4">
        <Button asChild>
          <Link to="/">Return Home</Link>
        </Button>
        <Button variant="outline" className="border-stream-purple text-stream-purple" asChild>
          <Link to="/start-stream">Start Streaming</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
