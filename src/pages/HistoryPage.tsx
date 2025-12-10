import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, History, Calendar } from 'lucide-react';

export default function HistoryPage() {
  const navigate = useNavigate();

  // For now, show empty state since we're not persisting matches yet
  const matches: any[] = [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="flex items-center gap-4 mb-8 animate-slide-up">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Match History</h1>
            <p className="text-muted-foreground">Your past matches</p>
          </div>
        </header>

        {matches.length === 0 ? (
          <div className="glass-panel text-center py-16 animate-slide-up">
            <History className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No matches yet</h2>
            <p className="text-muted-foreground mb-6">
              Start a new match to see your history here
            </p>
            <Button variant="hero" onClick={() => navigate('/setup')}>
              Start New Match
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <div key={match.id} className="glass-card animate-slide-up">
                <div className="flex items-center gap-4">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-semibold">{match.teamA} vs {match.teamB}</p>
                    <p className="text-sm text-muted-foreground">{match.date}</p>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
