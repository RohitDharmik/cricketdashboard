import { useEffect, useState } from 'react';
import { CelebrationEvent } from '@/types/cricket';
import { cn } from '@/lib/utils';

interface CelebrationOverlayProps {
  event: CelebrationEvent | null;
  message?: string;
  onComplete?: () => void;
}

export function CelebrationOverlay({ event, message, onComplete }: CelebrationOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (event) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [event, onComplete]);

  if (!isVisible || !event) return null;

  const getEventStyles = () => {
    switch (event) {
      case 'boundary4':
        return {
          bg: 'bg-boundary-four/20',
          text: 'text-boundary-four',
          border: 'border-boundary-four/40',
          emoji: '🏏',
          title: 'FOUR!',
        };
      case 'boundary6':
        return {
          bg: 'bg-boundary-six/20',
          text: 'text-boundary-six',
          border: 'border-boundary-six/40',
          emoji: '🚀',
          title: 'SIX!',
        };
      case 'wicket':
        return {
          bg: 'bg-wicket/20',
          text: 'text-wicket',
          border: 'border-wicket/40',
          emoji: '💥',
          title: 'WICKET!',
        };
      case 'fifty':
        return {
          bg: 'bg-primary/20',
          text: 'text-primary',
          border: 'border-primary/40',
          emoji: '⭐',
          title: 'FIFTY!',
        };
      case 'century':
        return {
          bg: 'bg-accent/20',
          text: 'text-accent',
          border: 'border-accent/40',
          emoji: '💯',
          title: 'CENTURY!',
        };
      case 'fiveWickets':
        return {
          bg: 'bg-wicket/20',
          text: 'text-wicket',
          border: 'border-wicket/40',
          emoji: '🔥',
          title: '5 WICKETS!',
        };
      default:
        return {
          bg: 'bg-primary/20',
          text: 'text-primary',
          border: 'border-primary/40',
          emoji: '🎉',
          title: 'MILESTONE!',
        };
    }
  };

  const styles = getEventStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className={cn(
        "relative px-12 py-8 rounded-2xl border-2 backdrop-blur-md animate-score-pop",
        styles.bg,
        styles.border
      )}>
        <div className="text-6xl mb-2 text-center animate-bounce">
          {styles.emoji}
        </div>
        <h2 className={cn("text-4xl font-bold text-center", styles.text)}>
          {styles.title}
        </h2>
        {message && (
          <p className="text-lg text-center mt-2 text-foreground">
            {message}
          </p>
        )}

        {/* Confetti effect for big celebrations */}
        {(event === 'boundary6' || event === 'century' || event === 'fiveWickets') && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'][i % 5],
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `confetti ${1 + Math.random()}s ease-out forwards`,
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
