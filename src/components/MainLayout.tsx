
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-stream-dark flex flex-col">
      <header className="border-b border-stream-gray py-4">
        <div className="container flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white streaming-gradient bg-clip-text text-transparent">StreamCrafter</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/" className="text-white hover:text-stream-purple">Home</Link>
            </Button>
            <Button className="streaming-gradient" asChild>
              <Link to="/start-stream">Start Streaming</Link>
            </Button>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 container py-6">
        <Outlet />
      </main>
      
      <footer className="border-t border-stream-gray py-4 text-sm text-muted-foreground">
        <div className="container text-center">
          <p>© 2023 StreamCrafter. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
