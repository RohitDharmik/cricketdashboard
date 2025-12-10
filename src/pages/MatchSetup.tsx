import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatch } from '@/context/MatchContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MatchType } from '@/types/cricket';
import { ArrowLeft, Users, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const defaultPlayers = (prefix: string) => 
  Array.from({ length: 11 }, (_, i) => `${prefix} Player ${i + 1}`);

const matchTypes: { type: MatchType; label: string; defaultOvers: number }[] = [
  { type: 'T20', label: 'T20', defaultOvers: 20 },
  { type: 'ODI', label: 'ODI', defaultOvers: 50 },
  { type: 'TEST', label: 'Test', defaultOvers: 90 },
];

export default function MatchSetup() {
  const navigate = useNavigate();
  const { dispatch } = useMatch();

  const [matchType, setMatchType] = useState<MatchType>('T20');
  const [overs, setOvers] = useState(20);
  const [teamAName, setTeamAName] = useState('Team A');
  const [teamBName, setTeamBName] = useState('Team B');
  const [teamAPlayers, setTeamAPlayers] = useState(defaultPlayers('A'));
  const [teamBPlayers, setTeamBPlayers] = useState(defaultPlayers('B'));

  const handleMatchTypeChange = (type: MatchType) => {
    setMatchType(type);
    const preset = matchTypes.find(m => m.type === type);
    if (preset) setOvers(preset.defaultOvers);
  };

  const updatePlayer = (team: 'A' | 'B', index: number, name: string) => {
    if (team === 'A') {
      setTeamAPlayers(prev => prev.map((p, i) => i === index ? name : p));
    } else {
      setTeamBPlayers(prev => prev.map((p, i) => i === index ? name : p));
    }
  };

  const handleSubmit = () => {
    dispatch({
      type: 'SETUP_MATCH',
      payload: {
        matchType,
        overs,
        teamA: { name: teamAName, players: teamAPlayers },
        teamB: { name: teamBName, players: teamBPlayers },
      },
    });
    navigate('/toss');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <header className="flex items-center gap-4 mb-8 animate-slide-up">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Match Setup</h1>
            <p className="text-muted-foreground">Configure teams and match settings</p>
          </div>
        </header>

        {/* Match Type Selection */}
        <div className="glass-panel mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-lg font-semibold mb-4">Match Format</h2>
          <div className="flex gap-3 mb-4">
            {matchTypes.map((m) => (
              <Button
                key={m.type}
                variant={matchType === m.type ? 'default' : 'outline'}
                size="lg"
                onClick={() => handleMatchTypeChange(m.type)}
                className="flex-1"
              >
                {m.label}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Label htmlFor="overs" className="text-muted-foreground">Overs</Label>
            <Input
              id="overs"
              type="number"
              value={overs}
              onChange={(e) => setOvers(parseInt(e.target.value) || 1)}
              min={1}
              max={matchType === 'T20' ? 20 : matchType === 'ODI' ? 50 : 450}
              className="w-24 font-mono"
            />
          </div>
        </div>

        {/* Teams */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Team A */}
          <div className="glass-panel animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-team-a/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-team-a" />
              </div>
              <Input
                value={teamAName}
                onChange={(e) => setTeamAName(e.target.value)}
                className="text-lg font-semibold border-0 bg-transparent p-0 h-auto focus-visible:ring-0"
                placeholder="Team A Name"
              />
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {teamAPlayers.map((player, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-6">{idx + 1}</span>
                  <Input
                    value={player}
                    onChange={(e) => updatePlayer('A', idx, e.target.value)}
                    className="flex-1"
                    placeholder={`Player ${idx + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Team B */}
          <div className="glass-panel animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-team-b/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-team-b" />
              </div>
              <Input
                value={teamBName}
                onChange={(e) => setTeamBName(e.target.value)}
                className="text-lg font-semibold border-0 bg-transparent p-0 h-auto focus-visible:ring-0"
                placeholder="Team B Name"
              />
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {teamBPlayers.map((player, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-6">{idx + 1}</span>
                  <Input
                    value={player}
                    onChange={(e) => updatePlayer('B', idx, e.target.value)}
                    className="flex-1"
                    placeholder={`Player ${idx + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4 mt-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Button variant="outline" onClick={() => navigate('/')}>
            Cancel
          </Button>
          <Button variant="hero" size="lg" onClick={handleSubmit}>
            Continue to Toss
          </Button>
        </div>
      </div>
    </div>
  );
}
