import { useMatch } from '@/context/MatchContext';
import { cn } from '@/lib/utils';
import { BowlerStats } from '@/types/cricket';

interface BowlingCardProps {
  className?: string;
}

function BowlerRow({ bowler, isCurrentBowler }: { bowler: BowlerStats; isCurrentBowler: boolean }) {
  const economy = (bowler.overs * 6 + bowler.balls) > 0 
    ? (bowler.runs / ((bowler.overs * 6 + bowler.balls) / 6)).toFixed(2)
    : '0.00';
  
  const formatOvers = () => `${bowler.overs}.${bowler.balls}`;
  
  // Check for milestones
  const hasFiveWickets = bowler.wickets >= 5;

  return (
    <tr className={cn(
      "border-b border-border/50 transition-colors",
      isCurrentBowler && "bg-primary/5"
    )}>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          {isCurrentBowler && (
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          )}
          <span className={cn("font-medium", isCurrentBowler && "text-primary")}>
            {bowler.name}
          </span>
          {hasFiveWickets && <span className="milestone-badge">🔥 5W</span>}
        </div>
      </td>
      <td className="py-3 px-4 text-right font-mono text-muted-foreground">
        {formatOvers()}
      </td>
      <td className="py-3 px-4 text-right font-mono text-muted-foreground">
        {bowler.maidens}
      </td>
      <td className="py-3 px-4 text-right font-mono">
        {bowler.runs}
      </td>
      <td className={cn(
        "py-3 px-4 text-right font-mono font-semibold",
        hasFiveWickets && "text-wicket"
      )}>
        {bowler.wickets}
      </td>
      <td className={cn(
        "py-3 px-4 text-right font-mono",
        parseFloat(economy) < 6 && "text-boundary-four",
        parseFloat(economy) >= 10 && "text-wicket"
      )}>
        {economy}
      </td>
    </tr>
  );
}

export function BowlingCard({ className }: BowlingCardProps) {
  const { currentInnings } = useMatch();

  if (!currentInnings) return null;

  const activeBowlers = currentInnings.bowlers.filter(b => 
    b.overs > 0 || b.balls > 0 || b.playerId === currentInnings.currentBowler
  );

  return (
    <div className={cn("glass-panel", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Bowling</h3>
        <span className="text-sm text-muted-foreground">
          {currentInnings.bowlingTeam.name}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
              <th className="py-2 px-4 text-left">Bowler</th>
              <th className="py-2 px-4 text-right">O</th>
              <th className="py-2 px-4 text-right">M</th>
              <th className="py-2 px-4 text-right">R</th>
              <th className="py-2 px-4 text-right">W</th>
              <th className="py-2 px-4 text-right">Econ</th>
            </tr>
          </thead>
          <tbody>
            {activeBowlers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-muted-foreground">
                  Select a bowler to start
                </td>
              </tr>
            ) : (
              activeBowlers.map((bowler) => (
                <BowlerRow 
                  key={bowler.playerId} 
                  bowler={bowler} 
                  isCurrentBowler={bowler.playerId === currentInnings.currentBowler}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Current Partnership */}
      {currentInnings.currentPartnership && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground mb-2">Current Partnership</p>
          <div className="flex items-center justify-between">
            <span className="text-sm">
              {currentInnings.currentPartnership.batsman1} & {currentInnings.currentPartnership.batsman2}
            </span>
            <span className="font-mono font-semibold">
              {currentInnings.currentPartnership.runs} ({currentInnings.currentPartnership.balls})
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
