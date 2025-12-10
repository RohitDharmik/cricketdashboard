import { useState } from 'react';
import { useMatch } from '@/context/MatchContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Undo2, RotateCcw, RefreshCw } from 'lucide-react';

interface ScoringPanelProps {
  className?: string;
}

export function ScoringPanel({ className }: ScoringPanelProps) {
  const { dispatch, currentInnings } = useMatch();
  const [showWicketDialog, setShowWicketDialog] = useState(false);
  const [showExtrasDialog, setShowExtrasDialog] = useState(false);

  if (!currentInnings) return null;

  const canScore = currentInnings.currentBatsmen[0] && currentInnings.currentBowler;

  const handleRuns = (runs: number, isBoundary = false) => {
    if (!canScore) return;
    dispatch({ type: 'ADD_RUNS', payload: { runs, isBoundary } });
  };

  const handleWicket = (howOut: string) => {
    if (!canScore) return;
    dispatch({ type: 'ADD_WICKET', payload: { howOut } });
    setShowWicketDialog(false);
  };

  const handleWide = (additionalRuns = 0) => {
    dispatch({ type: 'ADD_WIDE', payload: additionalRuns });
    setShowExtrasDialog(false);
  };

  const handleNoBall = (additionalRuns = 0) => {
    dispatch({ type: 'ADD_NO_BALL', payload: additionalRuns });
    setShowExtrasDialog(false);
  };

  const handleChangeStrike = () => {
    dispatch({ type: 'CHANGE_STRIKE' });
  };

  const dismissalTypes = [
    'Bowled',
    'Caught',
    'LBW',
    'Run Out',
    'Stumped',
    'Hit Wicket',
  ];

  return (
    <div className={cn("glass-panel", className)}>
      <h3 className="text-lg font-semibold text-foreground mb-4">Score</h3>

      {!canScore ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>Select batsmen and bowler to start scoring</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Run buttons */}
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant="run"
              size="lg"
              className="h-14 text-lg"
              onClick={() => handleRuns(0)}
            >
              •
            </Button>
            <Button
              variant="run"
              size="lg"
              className="h-14 text-lg"
              onClick={() => handleRuns(1)}
            >
              1
            </Button>
            <Button
              variant="run"
              size="lg"
              className="h-14 text-lg"
              onClick={() => handleRuns(2)}
            >
              2
            </Button>
            <Button
              variant="run"
              size="lg"
              className="h-14 text-lg"
              onClick={() => handleRuns(3)}
            >
              3
            </Button>
          </div>

          {/* Boundary buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="boundary"
              size="lg"
              className="h-14 text-lg"
              onClick={() => handleRuns(4, true)}
            >
              4
            </Button>
            <Button
              variant="six"
              size="lg"
              className="h-14 text-lg"
              onClick={() => handleRuns(6, true)}
            >
              6
            </Button>
          </div>

          {/* Wicket button */}
          <Dialog open={showWicketDialog} onOpenChange={setShowWicketDialog}>
            <DialogTrigger asChild>
              <Button
                variant="wicket"
                size="lg"
                className="w-full h-12"
                disabled={currentInnings.isFreeHit}
              >
                WICKET
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>How Out?</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {dismissalTypes.map((type) => (
                  <Button
                    key={type}
                    variant="outline"
                    className="h-12"
                    onClick={() => handleWicket(type)}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {/* Extras */}
          <Dialog open={showExtrasDialog} onOpenChange={setShowExtrasDialog}>
            <DialogTrigger asChild>
              <Button variant="extras" size="lg" className="w-full h-12">
                EXTRAS
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Extras</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <p className="text-sm font-medium mb-2">Wide</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 1, 2, 3].map((runs) => (
                      <Button
                        key={`wide-${runs}`}
                        variant="extras"
                        onClick={() => handleWide(runs)}
                      >
                        Wd{runs > 0 ? `+${runs}` : ''}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">No Ball</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 1, 2, 4].map((runs) => (
                      <Button
                        key={`nb-${runs}`}
                        variant="extras"
                        onClick={() => handleNoBall(runs)}
                      >
                        NB{runs > 0 ? `+${runs}` : ''}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50">
            <Button
              variant="ghost"
              size="sm"
              className="h-10"
              onClick={handleChangeStrike}
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Strike
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-10"
              onClick={() => dispatch({ type: 'UNDO' })}
              disabled
            >
              <Undo2 className="w-4 h-4 mr-1" />
              Undo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-10"
              disabled
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Redo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
