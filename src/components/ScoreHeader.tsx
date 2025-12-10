import { useMatch } from '@/context/MatchContext';
import { cn } from '@/lib/utils';

interface ScoreHeaderProps {
  className?: string;
}

export function ScoreHeader({ className }: ScoreHeaderProps) {
  const { currentInnings, match } = useMatch();

  if (!currentInnings || !match) return null;

  const formatOvers = (overs: number, balls: number) => `${overs}.${balls}`;
  
  const runRate = currentInnings.balls > 0 
    ? ((currentInnings.runs / (currentInnings.overs * 6 + currentInnings.balls)) * 6).toFixed(2)
    : '0.00';

  const target = match.currentInnings === 2 && match.innings1 
    ? match.innings1.runs + 1 
    : null;

  const requiredRunRate = target && currentInnings.balls > 0
    ? (((target - currentInnings.runs) / ((match.totalOvers * 6) - (currentInnings.overs * 6 + currentInnings.balls))) * 6).toFixed(2)
    : null;

  return (
    <div className={cn("glass-header px-6 py-4", className)}>
      <div className="flex items-center justify-between">
        {/* Team & Score */}
        <div className="flex items-center gap-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {currentInnings.battingTeam.name}
            </h2>
            <p className="text-xs text-muted-foreground">
              vs {currentInnings.bowlingTeam.name}
            </p>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="score-display text-foreground animate-number-tween">
              {currentInnings.runs}
            </span>
            <span className="text-3xl font-medium text-muted-foreground">/</span>
            <span className="text-3xl font-bold text-wicket">
              {currentInnings.wickets}
            </span>
          </div>

          <div className="text-2xl font-mono text-muted-foreground">
            ({formatOvers(currentInnings.overs, currentInnings.balls)})
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8">
          {/* Run Rate */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">CRR</p>
            <p className="text-xl font-semibold font-mono text-foreground">{runRate}</p>
          </div>

          {/* Target (if chasing) */}
          {target && (
            <>
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Target</p>
                <p className="text-xl font-semibold font-mono text-accent">{target}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">RRR</p>
                <p className="text-xl font-semibold font-mono text-foreground">{requiredRunRate}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Need</p>
                <p className="text-xl font-semibold font-mono text-primary">
                  {target - currentInnings.runs} off {(match.totalOvers * 6) - (currentInnings.overs * 6 + currentInnings.balls)}
                </p>
              </div>
            </>
          )}

          {/* Match Info */}
          <div className="text-center border-l border-border pl-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {match.matchType} • {match.totalOvers} Overs
            </p>
            <p className="text-sm font-medium text-foreground">
              Innings {match.currentInnings}
            </p>
          </div>
        </div>
      </div>

      {/* Free Hit Banner */}
      {currentInnings.isFreeHit && (
        <div className="mt-3 animate-pulse-glow">
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-1.5 rounded-full text-sm font-semibold border border-accent/30">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            FREE HIT
          </div>
        </div>
      )}
    </div>
  );
}
