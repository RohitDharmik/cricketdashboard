import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Volume2, Sparkles, Moon, Sun } from 'lucide-react';

export default function SettingsPage() {
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState({
    enableSound: true,
    enableAnimations: true,
    reduceMotion: false,
  });

  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <header className="flex items-center gap-4 mb-8 animate-slide-up">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Customize your experience</p>
          </div>
        </header>

        <div className="space-y-6">
          {/* Sound Settings */}
          <div className="glass-panel animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-primary" />
              Sound
            </h2>
            <div className="flex items-center justify-between">
              <Label htmlFor="sound" className="flex-1">
                <span className="font-medium">Enable Sounds</span>
                <p className="text-sm text-muted-foreground">
                  Play sounds for boundaries, wickets, and milestones
                </p>
              </Label>
              <Switch
                id="sound"
                checked={settings.enableSound}
                onCheckedChange={(checked) => updateSetting('enableSound', checked)}
              />
            </div>
          </div>

          {/* Animation Settings */}
          <div className="glass-panel animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Animations
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="animations" className="flex-1">
                  <span className="font-medium">Enable Animations</span>
                  <p className="text-sm text-muted-foreground">
                    Show celebration animations and transitions
                  </p>
                </Label>
                <Switch
                  id="animations"
                  checked={settings.enableAnimations}
                  onCheckedChange={(checked) => updateSetting('enableAnimations', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="reduceMotion" className="flex-1">
                  <span className="font-medium">Reduce Motion</span>
                  <p className="text-sm text-muted-foreground">
                    Minimize animations for accessibility
                  </p>
                </Label>
                <Switch
                  id="reduceMotion"
                  checked={settings.reduceMotion}
                  onCheckedChange={(checked) => updateSetting('reduceMotion', checked)}
                />
              </div>
            </div>
          </div>

          {/* About */}
          <div className="glass-card text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <p className="text-sm text-muted-foreground">
              Cricket Scorecard Pro v1.1.0
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Built with ❤️ for cricket lovers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
