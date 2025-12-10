export type MatchType = 'T20' | 'ODI' | 'TEST';

export type BallType = 'normal' | 'wide' | 'noBall' | 'bye' | 'legBye' | 'penalty';

export type DismissalType = 'bowled' | 'caught' | 'lbw' | 'runOut' | 'stumped' | 'hitWicket' | 'retired' | 'obstructingField';

export interface Player {
  id: string;
  name: string;
}

export interface BatsmanStats {
  playerId: string;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isOut: boolean;
  howOut?: string;
  isOnStrike: boolean;
}

export interface BowlerStats {
  playerId: string;
  name: string;
  overs: number;
  balls: number;
  runs: number;
  wickets: number;
  maidens: number;
  wides: number;
  noBalls: number;
}

export interface Extras {
  wides: number;
  noBalls: number;
  byes: number;
  legByes: number;
  penalty: number;
  total: number;
}

export interface BallRecord {
  ballId: string;
  overNumber: number;
  ballInOver: number;
  ballType: BallType;
  batter: string | null;
  bowler: string;
  batterRuns: number;
  extraRuns: number;
  isWicket: boolean;
  isLegalDelivery: boolean;
  isFreeHit: boolean;
  displayValue: string;
}

export interface Over {
  overNumber: number;
  bowlerId: string;
  balls: BallRecord[];
  runsThisOver: number;
  wicketsThisOver: number;
}

export interface FallOfWicket {
  wicketNumber: number;
  score: string;
  over: string;
  batsmanOut: string;
}

export interface Partnership {
  batsman1: string;
  batsman2: string;
  runs: number;
  balls: number;
}

export interface Team {
  name: string;
  players: Player[];
  color: 'team-a' | 'team-b';
}

export interface InningsState {
  battingTeam: Team;
  bowlingTeam: Team;
  runs: number;
  wickets: number;
  overs: number;
  balls: number;
  extras: Extras;
  batsmen: BatsmanStats[];
  bowlers: BowlerStats[];
  currentBatsmen: [string | null, string | null]; // [striker, non-striker]
  currentBowler: string | null;
  oversHistory: Over[];
  fallOfWickets: FallOfWicket[];
  partnerships: Partnership[];
  currentPartnership: Partnership | null;
  isFreeHit: boolean;
  isComplete: boolean;
}

export interface MatchState {
  id: string;
  matchType: MatchType;
  totalOvers: number;
  teamA: Team;
  teamB: Team;
  tossWinner: 'teamA' | 'teamB';
  tossDecision: 'bat' | 'bowl';
  currentInnings: 1 | 2;
  innings1: InningsState | null;
  innings2: InningsState | null;
  isComplete: boolean;
  winner: 'teamA' | 'teamB' | 'tie' | null;
  createdAt: Date;
}

export interface MatchSetup {
  matchType: MatchType;
  overs: number;
  teamA: {
    name: string;
    players: string[];
  };
  teamB: {
    name: string;
    players: string[];
  };
}

export interface TossResult {
  winner: 'teamA' | 'teamB';
  decision: 'bat' | 'bowl';
}

export type CelebrationEvent = 
  | 'boundary4'
  | 'boundary6'
  | 'wicket'
  | 'fifty'
  | 'century'
  | 'fiveWickets'
  | 'teamMilestone'
  | 'inningsEnd'
  | 'matchEnd';
