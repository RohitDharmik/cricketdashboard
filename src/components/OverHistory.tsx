import { useMatch } from '@/context/MatchContext';
import { cn } from '@/lib/utils';
import { BallRecord } from '@/types/cricket';

interface OverHistoryProps {
  className?: string;
}

function BallDot({ ball }: { ball: BallRecord }) {
  const getBallStyle = () => {
    if (ball.isWicket) return 'ball-indicator ball-wicket';
    if (ball.batterRuns === 6) return 'ball-indicator ball-six';
    if (ball.batterRuns === 4) return 'ball-indicator ball-four';
    if (ball.ballType === 'wide' || ball.ballType === 'noBall') return 'ball-indicator ball-extras';
    if (ball.batterRuns === 0) return 'ball-indicator ball-dot';
    return 'ball-indicator ball-run';
  };

  return (
    <div className={getBallStyle()}>
      {ball.displayValue}
    </div>
  );
}

export function OverHistory({ className }: OverHistoryProps) {
  const { currentInnings } = useMatch();

  if (!currentInnings) return null;

  const recentOvers = currentInnings.oversHistory.slice(-3).reverse();

  return (
    <div className={cn("glass-card", className)}>
      <h4 className="text-sm font-medium text-muted-foreground mb-3">This Over</h4>
      
      {recentOvers.length === 0 ? (
        <p className="text-sm text-muted-foreground">No balls bowled yet</p>
      ) : (
        <div className="space-y-3">
          {recentOvers.map((over) => (
            <div key={over.overNumber} className="flex items-center gap-3">
              <span className="text-xs font-mono text-muted-foreground w-8">
                {over.overNumber}
              </span>
              <div className="flex gap-1">
                {over.balls.map((ball) => (
                  <BallDot key={ball.ballId} ball={ball} />
                ))}
              </div>
              <span className="ml-auto text-sm font-mono font-medium">
                {over.runsThisOver}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Current over if mid-over */}
      {currentInnings.balls > 0 && currentInnings.oversHistory.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-primary w-8">
              {currentInnings.overs + 1}
            </span>
            <div className="flex gap-1">
              {currentInnings.oversHistory[currentInnings.oversHistory.length - 1]?.balls
                .slice(-currentInnings.balls)
                .map((ball) => (
                  <BallDot key={ball.ballId} ball={ball} />
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
