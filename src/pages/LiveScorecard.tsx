import { useNavigate } from 'react-router-dom';
import { useMatch } from '@/context/MatchContext';
import { Button } from '@/components/ui/button';
import { ScoreHeader } from '@/components/ScoreHeader';
import { BattingCard } from '@/components/BattingCard';
import { BowlingCard } from '@/components/BowlingCard';
import { ScoringPanel } from '@/components/ScoringPanel';
import { PlayerSelector } from '@/components/PlayerSelector';
import { OverHistory } from '@/components/OverHistory';
import { ArrowLeft, Flag } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useEffect } from 'react';

export default function LiveScorecard() {
  const navigate = useNavigate();
  const { match, currentInnings, dispatch } = useMatch();

  useEffect(() => {
    if (!match) {
      navigate('/setup');
    }
  }, [match, navigate]);

  if (!match || !currentInnings) {
    return null;
  }

  const handleEndInnings = () => {
    dispatch({ type: 'END_INNINGS' });
    if (match.currentInnings === 2) {
      navigate('/summary');
    }
  };

  // Check if innings is complete
  useEffect(() => {
    if (currentInnings.isComplete) {
      if (match.currentInnings === 1) {
        // Automatically transition to second innings
        dispatch({ type: 'END_INNINGS' });
      } else {
        navigate('/summary');
      }
    }
  }, [currentInnings.isComplete, match.currentInnings, dispatch, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40">
        <div className="bg-background/80 backdrop-blur-md border-b border-border px-4 py-2">
          <div className="container mx-auto flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Home
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Flag className="w-4 h-4 mr-1" />
                  End Innings
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>End Innings?</DialogTitle>
                </DialogHeader>
                <p className="text-muted-foreground">
                  Are you sure you want to end the current innings?
                </p>
                <div className="flex justify-end gap-3 mt-4">
                  <Button variant="outline">Cancel</Button>
                  <Button variant="destructive" onClick={handleEndInnings}>
                    End Innings
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <ScoreHeader />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Player Selector */}
        <PlayerSelector className="mb-6 animate-slide-up" />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Batting & Bowling */}
          <div className="lg:col-span-2 space-y-6">
            <BattingCard className="animate-slide-in-left" />
            <BowlingCard className="animate-slide-in-left" />
          </div>

          {/* Right Column - Scoring & Over History */}
          <div className="space-y-6">
            <ScoringPanel className="animate-slide-in-right" />
            <OverHistory className="animate-slide-in-right" />
          </div>
        </div>
      </div>
    </div>
  );
}
