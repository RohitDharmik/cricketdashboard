import { useNavigate } from 'react-router-dom';
import { useMatch } from '@/context/MatchContext';
import { Button } from '@/components/ui/button';
import { Trophy, Home, Share2, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MatchSummary() {
  const navigate = useNavigate();
  const { match, dispatch } = useMatch();

  if (!match) {
    navigate('/');
    return null;
  }

  const innings1 = match.innings1;
  const innings2 = match.innings2;

  const getWinnerText = () => {
    if (!match.winner || match.winner === 'tie') return 'Match Tied!';
    
    const winningTeam = match.winner === 'teamA' ? match.teamA : match.teamB;
    
    if (!innings1 || !innings2) return `${winningTeam.name} Won!`;
    
    if (innings2.battingTeam === winningTeam) {
      const wicketsRemaining = 10 - innings2.wickets;
      return `${winningTeam.name} won by ${wicketsRemaining} wickets`;
    } else {
      const runsDiff = innings1.runs - innings2.runs;
      return `${winningTeam.name} won by ${runsDiff} runs`;
    }
  };

  const getTopBatsmen = (innings: typeof innings1) => {
    if (!innings) return [];
    return [...innings.batsmen]
      .filter(b => b.balls > 0)
      .sort((a, b) => b.runs - a.runs)
      .slice(0, 3);
  };

  const getTopBowlers = (innings: typeof innings1) => {
    if (!innings) return [];
    return [...innings.bowlers]
      .filter(b => b.overs > 0 || b.balls > 0)
      .sort((a, b) => b.wickets - a.wickets || a.runs - b.runs)
      .slice(0, 3);
  };

  const handleNewMatch = () => {
    dispatch({ type: 'RESET' });
    navigate('/setup');
  };

  const handleHome = () => {
    dispatch({ type: 'RESET' });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Celebration Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-4xl">
        {/* Winner Banner */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-accent/20 rounded-full mb-6 animate-pulse-glow">
            <Trophy className="w-12 h-12 text-accent" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Match Complete</h1>
          <p className="text-2xl text-primary font-semibold">{getWinnerText()}</p>
        </div>

        {/* Score Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* First Innings */}
          {innings1 && (
            <div className="glass-panel animate-slide-in-left">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">{innings1.battingTeam.name}</h3>
                <span className="text-xs text-muted-foreground">1st Innings</span>
              </div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold font-mono">{innings1.runs}</span>
                <span className="text-2xl text-muted-foreground">/</span>
                <span className="text-2xl font-semibold text-wicket">{innings1.wickets}</span>
                <span className="text-lg text-muted-foreground">
                  ({innings1.overs}.{innings1.balls})
                </span>
              </div>
              
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Top Batsmen</p>
                {getTopBatsmen(innings1).map((b) => (
                  <div key={b.playerId} className="flex justify-between text-sm">
                    <span>{b.name}</span>
                    <span className="font-mono">
                      {b.runs} ({b.balls})
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Top Bowlers</p>
                {getTopBowlers(innings1).map((b) => (
                  <div key={b.playerId} className="flex justify-between text-sm">
                    <span>{b.name}</span>
                    <span className="font-mono">
                      {b.wickets}/{b.runs} ({b.overs}.{b.balls})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Second Innings */}
          {innings2 && (
            <div className="glass-panel animate-slide-in-right">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">{innings2.battingTeam.name}</h3>
                <span className="text-xs text-muted-foreground">2nd Innings</span>
              </div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold font-mono">{innings2.runs}</span>
                <span className="text-2xl text-muted-foreground">/</span>
                <span className="text-2xl font-semibold text-wicket">{innings2.wickets}</span>
                <span className="text-lg text-muted-foreground">
                  ({innings2.overs}.{innings2.balls})
                </span>
              </div>
              
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Top Batsmen</p>
                {getTopBatsmen(innings2).map((b) => (
                  <div key={b.playerId} className="flex justify-between text-sm">
                    <span>{b.name}</span>
                    <span className="font-mono">
                      {b.runs} ({b.balls})
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Top Bowlers</p>
                {getTopBowlers(innings2).map((b) => (
                  <div key={b.playerId} className="flex justify-between text-sm">
                    <span>{b.name}</span>
                    <span className="font-mono">
                      {b.wickets}/{b.runs} ({b.overs}.{b.balls})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Button variant="outline" size="lg" onClick={handleHome}>
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
          <Button variant="hero" size="lg" onClick={handleNewMatch}>
            New Match
          </Button>
        </div>
      </div>
    </div>
  );
}
