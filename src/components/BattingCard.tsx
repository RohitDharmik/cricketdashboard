import { useMatch } from '@/context/MatchContext';
import { cn } from '@/lib/utils';
import { BatsmanStats } from '@/types/cricket';

interface BattingCardProps {
  className?: string;
}

function BatsmanRow({ batsman, isActive }: { batsman: BatsmanStats; isActive: boolean }) {
  const strikeRate = batsman.balls > 0 ? ((batsman.runs / batsman.balls) * 100).toFixed(1) : '0.0';
  
  // Check for milestones
  const hasFifty = batsman.runs >= 50 && batsman.runs < 100;
  const hasCentury = batsman.runs >= 100;

  return (
    <tr className={cn(
      "border-b border-border/50 transition-colors",
      isActive && "bg-primary/5",
      batsman.isOut && "opacity-60"
    )}>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          {isActive && !batsman.isOut && (
            <span className={cn(
              "w-2 h-2 rounded-full",
              batsman.isOnStrike ? "bg-primary animate-pulse" : "bg-muted-foreground"
            )} />
          )}
          <span className={cn("font-medium", isActive && !batsman.isOut && "text-primary")}>
            {batsman.name}
          </span>
          {hasCentury && <span className="milestone-badge">💯 100</span>}
          {hasFifty && !hasCentury && <span className="milestone-badge">⭐ 50</span>}
        </div>
        {batsman.isOut && (
          <p className="text-xs text-muted-foreground mt-0.5">{batsman.howOut}</p>
        )}
      </td>
      <td className={cn(
        "py-3 px-4 text-right font-mono font-semibold",
        hasCentury && "text-accent",
        hasFifty && !hasCentury && "text-primary"
      )}>
        {batsman.runs}
      </td>
      <td className="py-3 px-4 text-right font-mono text-muted-foreground">
        {batsman.balls}
      </td>
      <td className="py-3 px-4 text-right font-mono text-boundary-four">
        {batsman.fours}
      </td>
      <td className="py-3 px-4 text-right font-mono text-boundary-six">
        {batsman.sixes}
      </td>
      <td className="py-3 px-4 text-right font-mono">
        {strikeRate}
      </td>
    </tr>
  );
}

export function BattingCard({ className }: BattingCardProps) {
  const { currentInnings } = useMatch();

  if (!currentInnings) return null;

  const activeBatsmen = currentInnings.batsmen.filter(b => 
    currentInnings.currentBatsmen.includes(b.playerId)
  );
  
  const outBatsmen = currentInnings.batsmen.filter(b => b.isOut);
  const yetToBat = currentInnings.batsmen.filter(b => 
    !b.isOut && !currentInnings.currentBatsmen.includes(b.playerId) && b.balls === 0
  );

  return (
    <div className={cn("glass-panel", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Batting</h3>
        <span className="text-sm text-muted-foreground">
          {currentInnings.battingTeam.name}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
              <th className="py-2 px-4 text-left">Batsman</th>
              <th className="py-2 px-4 text-right">R</th>
              <th className="py-2 px-4 text-right">B</th>
              <th className="py-2 px-4 text-right">4s</th>
              <th className="py-2 px-4 text-right">6s</th>
              <th className="py-2 px-4 text-right">SR</th>
            </tr>
          </thead>
          <tbody>
            {activeBatsmen.map((batsman, idx) => (
              <BatsmanRow 
                key={batsman.playerId} 
                batsman={batsman} 
                isActive={true}
              />
            ))}
            {outBatsmen.map((batsman) => (
              <BatsmanRow 
                key={batsman.playerId} 
                batsman={batsman} 
                isActive={false}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Extras */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Extras</span>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">
              (W: {currentInnings.extras.wides}, NB: {currentInnings.extras.noBalls}, 
              B: {currentInnings.extras.byes}, LB: {currentInnings.extras.legByes})
            </span>
            <span className="font-mono font-semibold text-extras">
              {currentInnings.extras.total}
            </span>
          </div>
        </div>
      </div>

      {/* Yet to bat */}
      {yetToBat.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground mb-2">Yet to bat</p>
          <div className="flex flex-wrap gap-2">
            {yetToBat.map(b => (
              <span key={b.playerId} className="text-sm text-muted-foreground">
                {b.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
