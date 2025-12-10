import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play, History, Settings, Trophy, Users, Timer } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25">
              <Trophy className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4 tracking-tight">
            Cricket Scorecard
            <span className="text-primary"> Pro</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto">
            Professional cricket scoring with beautiful animations, 
            real-time stats, and milestone celebrations
          </p>
        </header>

        {/* Main Navigation Cards */}
        <div className="grid gap-4 mb-12">
          <Link to="/setup" className="block">
            <div className="glass-panel group hover:shadow-glow transition-all duration-300 cursor-pointer animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:scale-105 transition-all duration-300">
                  <Play className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    New Match
                  </h2>
                  <p className="text-muted-foreground">
                    Start a new T20, ODI, or Test match
                  </p>
                </div>
                <div className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all">
                  →
                </div>
              </div>
            </div>
          </Link>

          <Link to="/history" className="block">
            <div className="glass-panel group hover:shadow-md transition-all duration-300 cursor-pointer animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-all duration-300">
                  <History className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground">
                    Match History
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    View past matches and summaries
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/settings" className="block">
            <div className="glass-panel group hover:shadow-md transition-all duration-300 cursor-pointer animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-all duration-300">
                  <Settings className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground">
                    Settings
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Theme, sounds, and preferences
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="glass-card text-center">
            <Users className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="font-medium text-foreground">11 Players</h3>
            <p className="text-xs text-muted-foreground">Full squad management</p>
          </div>
          <div className="glass-card text-center">
            <Timer className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="font-medium text-foreground">All Formats</h3>
            <p className="text-xs text-muted-foreground">T20, ODI, Test</p>
          </div>
          <div className="glass-card text-center">
            <Trophy className="w-8 h-8 text-accent mx-auto mb-2" />
            <h3 className="font-medium text-foreground">Celebrations</h3>
            <p className="text-xs text-muted-foreground">Animated milestones</p>
          </div>
        </div>

        {/* Version */}
        <footer className="text-center mt-12 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <p>Cricket Scorecard Pro v1.1.0</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
