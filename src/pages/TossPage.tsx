import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatch } from '@/context/MatchContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TossPage() {
  const navigate = useNavigate();
  const { match, dispatch } = useMatch();

  const [tossWinner, setTossWinner] = useState<'teamA' | 'teamB' | null>(null);
  const [decision, setDecision] = useState<'bat' | 'bowl' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);

  if (!match) {
    navigate('/setup');
    return null;
  }

  const handleFlipCoin = () => {
    setIsFlipping(true);
    setTossWinner(null);
    setDecision(null);
    
    setTimeout(() => {
      const winner = Math.random() > 0.5 ? 'teamA' : 'teamB';
      setTossWinner(winner);
      setIsFlipping(false);
    }, 1500);
  };

  const handleSubmit = () => {
    if (!tossWinner || !decision) return;
    
    dispatch({
      type: 'SET_TOSS',
      payload: { winner: tossWinner, decision },
    });
    navigate('/live');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <header className="flex items-center gap-4 mb-12 animate-slide-up">
          <Button variant="ghost" size="icon" onClick={() => navigate('/setup')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Toss</h1>
            <p className="text-muted-foreground">{match.teamA.name} vs {match.teamB.name}</p>
          </div>
        </header>

        <div className="glass-panel text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {/* Coin Flip */}
          <div className="mb-8">
            <div 
              className={cn(
                "w-32 h-32 mx-auto bg-accent rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-all",
                isFlipping && "animate-spin"
              )}
              onClick={handleFlipCoin}
            >
              <Coins className="w-16 h-16 text-accent-foreground" />
            </div>
            <p className="text-muted-foreground mt-4">
              {isFlipping ? 'Flipping...' : 'Click to flip or select winner'}
            </p>
          </div>

          {/* Toss Winner Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Who won the toss?</h3>
            <div className="flex gap-4 justify-center">
              <Button
                variant={tossWinner === 'teamA' ? 'default' : 'outline'}
                size="lg"
                className="min-w-[140px]"
                onClick={() => setTossWinner('teamA')}
              >
                {match.teamA.name}
              </Button>
              <Button
                variant={tossWinner === 'teamB' ? 'default' : 'outline'}
                size="lg"
                className="min-w-[140px]"
                onClick={() => setTossWinner('teamB')}
              >
                {match.teamB.name}
              </Button>
            </div>
          </div>

          {/* Decision */}
          {tossWinner && (
            <div className="animate-slide-up">
              <h3 className="text-lg font-semibold mb-4">
                {tossWinner === 'teamA' ? match.teamA.name : match.teamB.name} elected to...
              </h3>
              <div className="flex gap-4 justify-center">
                <Button
                  variant={decision === 'bat' ? 'default' : 'outline'}
                  size="lg"
                  className="min-w-[120px]"
                  onClick={() => setDecision('bat')}
                >
                  🏏 Bat
                </Button>
                <Button
                  variant={decision === 'bowl' ? 'default' : 'outline'}
                  size="lg"
                  className="min-w-[120px]"
                  onClick={() => setDecision('bowl')}
                >
                  🎯 Bowl
                </Button>
              </div>
            </div>
          )}

          {/* Summary & Continue */}
          {tossWinner && decision && (
            <div className="mt-8 pt-8 border-t border-border animate-slide-up">
              <p className="text-lg text-muted-foreground mb-4">
                <span className="font-semibold text-foreground">
                  {tossWinner === 'teamA' ? match.teamA.name : match.teamB.name}
                </span>
                {' '}won the toss and elected to{' '}
                <span className="font-semibold text-primary">
                  {decision === 'bat' ? 'bat' : 'bowl'}
                </span>
                {' '}first
              </p>
              <Button variant="hero" size="lg" onClick={handleSubmit}>
                Start Match
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
