import { useState } from 'react';
import { useMatch } from '@/context/MatchContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Users, User } from 'lucide-react';

interface PlayerSelectorProps {
  className?: string;
}

export function PlayerSelector({ className }: PlayerSelectorProps) {
  const { dispatch, currentInnings } = useMatch();
  const [showBatsmenDialog, setShowBatsmenDialog] = useState(false);
  const [showBowlerDialog, setShowBowlerDialog] = useState(false);
  const [selectedStriker, setSelectedStriker] = useState<string | null>(null);

  if (!currentInnings) return null;

  const availableBatsmen = currentInnings.batsmen.filter(b => !b.isOut);
  const availableBowlers = currentInnings.bowlers;

  const needNewBatsman = !currentInnings.currentBatsmen[0] || 
    !currentInnings.currentBatsmen[1];

  const handleSelectBatsmen = (strikerId: string, nonStrikerId: string) => {
    dispatch({ type: 'SELECT_BATSMEN', payload: { striker: strikerId, nonStriker: nonStrikerId } });
    setShowBatsmenDialog(false);
    setSelectedStriker(null);
  };

  const handleSelectBowler = (bowlerId: string) => {
    dispatch({ type: 'SELECT_BOWLER', payload: bowlerId });
    setShowBowlerDialog(false);
  };

  const currentStriker = currentInnings.batsmen.find(
    b => b.playerId === currentInnings.currentBatsmen[0]
  );
  const currentNonStriker = currentInnings.batsmen.find(
    b => b.playerId === currentInnings.currentBatsmen[1]
  );
  const currentBowler = currentInnings.bowlers.find(
    b => b.playerId === currentInnings.currentBowler
  );

  return (
    <div className={cn("glass-card", className)}>
      <div className="flex items-center justify-between gap-4">
        {/* Batsmen Selection */}
        <Dialog open={showBatsmenDialog} onOpenChange={setShowBatsmenDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex-1 h-auto py-3 justify-start">
              <Users className="w-4 h-4 mr-2 text-muted-foreground" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Batsmen</p>
                {currentStriker && currentNonStriker ? (
                  <p className="text-sm font-medium">
                    {currentStriker.name}* & {currentNonStriker.name}
                  </p>
                ) : (
                  <p className="text-sm text-primary">Select Batsmen</p>
                )}
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedStriker ? 'Select Non-Striker' : 'Select Striker'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-2 mt-4 max-h-[400px] overflow-y-auto">
              {availableBatsmen
                .filter(b => b.playerId !== selectedStriker)
                .map((batsman) => (
                  <Button
                    key={batsman.playerId}
                    variant="outline"
                    className={cn(
                      "h-12 justify-start",
                      currentInnings.currentBatsmen.includes(batsman.playerId) && "border-primary"
                    )}
                    onClick={() => {
                      if (!selectedStriker) {
                        setSelectedStriker(batsman.playerId);
                      } else {
                        handleSelectBatsmen(selectedStriker, batsman.playerId);
                      }
                    }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    {batsman.name}
                    {batsman.balls > 0 && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        {batsman.runs}({batsman.balls})
                      </span>
                    )}
                  </Button>
                ))}
            </div>
            {selectedStriker && (
              <Button
                variant="ghost"
                className="mt-2"
                onClick={() => setSelectedStriker(null)}
              >
                Back
              </Button>
            )}
          </DialogContent>
        </Dialog>

        {/* Bowler Selection */}
        <Dialog open={showBowlerDialog} onOpenChange={setShowBowlerDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex-1 h-auto py-3 justify-start">
              <User className="w-4 h-4 mr-2 text-muted-foreground" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Bowler</p>
                {currentBowler ? (
                  <p className="text-sm font-medium">{currentBowler.name}</p>
                ) : (
                  <p className="text-sm text-primary">Select Bowler</p>
                )}
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Bowler</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-2 mt-4 max-h-[400px] overflow-y-auto">
              {availableBowlers.map((bowler) => (
                <Button
                  key={bowler.playerId}
                  variant="outline"
                  className={cn(
                    "h-12 justify-start",
                    currentInnings.currentBowler === bowler.playerId && "border-primary"
                  )}
                  onClick={() => handleSelectBowler(bowler.playerId)}
                >
                  <User className="w-4 h-4 mr-2" />
                  {bowler.name}
                  {(bowler.overs > 0 || bowler.balls > 0) && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      {bowler.overs}.{bowler.balls} - {bowler.wickets}/{bowler.runs}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
