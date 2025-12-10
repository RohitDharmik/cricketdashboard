import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { 
  MatchState, 
  MatchSetup, 
  TossResult, 
  InningsState, 
  Team, 
  Player,
  BatsmanStats,
  BowlerStats,
  Extras,
  BallRecord,
  Over,
  FallOfWicket
} from '@/types/cricket';

type MatchAction =
  | { type: 'SETUP_MATCH'; payload: MatchSetup }
  | { type: 'SET_TOSS'; payload: TossResult }
  | { type: 'START_INNINGS' }
  | { type: 'SELECT_BATSMEN'; payload: { striker: string; nonStriker: string } }
  | { type: 'SELECT_BOWLER'; payload: string }
  | { type: 'ADD_RUNS'; payload: { runs: number; isBoundary?: boolean } }
  | { type: 'ADD_WIDE'; payload: number }
  | { type: 'ADD_NO_BALL'; payload: number }
  | { type: 'ADD_BYE'; payload: number }
  | { type: 'ADD_LEG_BYE'; payload: number }
  | { type: 'ADD_WICKET'; payload: { howOut: string; bowlerCredit?: boolean } }
  | { type: 'CHANGE_STRIKE' }
  | { type: 'UNDO' }
  | { type: 'END_INNINGS' }
  | { type: 'END_MATCH' }
  | { type: 'RESET' };

interface MatchContextType {
  match: MatchState | null;
  dispatch: React.Dispatch<MatchAction>;
  currentInnings: InningsState | null;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function createPlayer(name: string): Player {
  return { id: generateId(), name };
}

function createTeam(name: string, playerNames: string[], color: 'team-a' | 'team-b'): Team {
  return {
    name,
    players: playerNames.map(createPlayer),
    color,
  };
}

function createBatsmanStats(player: Player): BatsmanStats {
  return {
    playerId: player.id,
    name: player.name,
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    isOut: false,
    isOnStrike: false,
  };
}

function createBowlerStats(player: Player): BowlerStats {
  return {
    playerId: player.id,
    name: player.name,
    overs: 0,
    balls: 0,
    runs: 0,
    wickets: 0,
    maidens: 0,
    wides: 0,
    noBalls: 0,
  };
}

function createEmptyExtras(): Extras {
  return { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalty: 0, total: 0 };
}

function createInningsState(battingTeam: Team, bowlingTeam: Team): InningsState {
  return {
    battingTeam,
    bowlingTeam,
    runs: 0,
    wickets: 0,
    overs: 0,
    balls: 0,
    extras: createEmptyExtras(),
    batsmen: battingTeam.players.map(createBatsmanStats),
    bowlers: bowlingTeam.players.map(createBowlerStats),
    currentBatsmen: [null, null],
    currentBowler: null,
    oversHistory: [],
    fallOfWickets: [],
    partnerships: [],
    currentPartnership: null,
    isFreeHit: false,
    isComplete: false,
  };
}

function formatOvers(overs: number, balls: number): string {
  return `${overs}.${balls}`;
}

function matchReducer(state: MatchState | null, action: MatchAction): MatchState | null {
  switch (action.type) {
    case 'SETUP_MATCH': {
      const { matchType, overs, teamA, teamB } = action.payload;
      return {
        id: generateId(),
        matchType,
        totalOvers: overs,
        teamA: createTeam(teamA.name, teamA.players, 'team-a'),
        teamB: createTeam(teamB.name, teamB.players, 'team-b'),
        tossWinner: 'teamA',
        tossDecision: 'bat',
        currentInnings: 1,
        innings1: null,
        innings2: null,
        isComplete: false,
        winner: null,
        createdAt: new Date(),
      };
    }

    case 'SET_TOSS': {
      if (!state) return null;
      const { winner, decision } = action.payload;
      
      const battingFirst = decision === 'bat' 
        ? (winner === 'teamA' ? state.teamA : state.teamB)
        : (winner === 'teamA' ? state.teamB : state.teamA);
      
      const bowlingFirst = battingFirst === state.teamA ? state.teamB : state.teamA;
      
      return {
        ...state,
        tossWinner: winner,
        tossDecision: decision,
        innings1: createInningsState(battingFirst, bowlingFirst),
      };
    }

    case 'SELECT_BATSMEN': {
      if (!state) return null;
      const innings = state.currentInnings === 1 ? state.innings1 : state.innings2;
      if (!innings) return state;

      const updatedBatsmen = innings.batsmen.map(b => ({
        ...b,
        isOnStrike: b.playerId === action.payload.striker,
      }));

      const updatedInnings: InningsState = {
        ...innings,
        batsmen: updatedBatsmen,
        currentBatsmen: [action.payload.striker, action.payload.nonStriker],
        currentPartnership: {
          batsman1: updatedBatsmen.find(b => b.playerId === action.payload.striker)?.name || '',
          batsman2: updatedBatsmen.find(b => b.playerId === action.payload.nonStriker)?.name || '',
          runs: 0,
          balls: 0,
        },
      };

      return {
        ...state,
        [state.currentInnings === 1 ? 'innings1' : 'innings2']: updatedInnings,
      };
    }

    case 'SELECT_BOWLER': {
      if (!state) return null;
      const innings = state.currentInnings === 1 ? state.innings1 : state.innings2;
      if (!innings) return state;

      const updatedInnings: InningsState = {
        ...innings,
        currentBowler: action.payload,
      };

      return {
        ...state,
        [state.currentInnings === 1 ? 'innings1' : 'innings2']: updatedInnings,
      };
    }

    case 'ADD_RUNS': {
      if (!state) return null;
      const inningsKey = state.currentInnings === 1 ? 'innings1' : 'innings2';
      const innings = state[inningsKey];
      if (!innings || !innings.currentBatsmen[0] || !innings.currentBowler) return state;

      const { runs, isBoundary } = action.payload;
      const strikerId = innings.currentBatsmen[0];
      
      // Update batsman stats
      const updatedBatsmen = innings.batsmen.map(b => {
        if (b.playerId === strikerId) {
          return {
            ...b,
            runs: b.runs + runs,
            balls: b.balls + 1,
            fours: b.fours + (isBoundary && runs === 4 ? 1 : 0),
            sixes: b.sixes + (isBoundary && runs === 6 ? 1 : 0),
          };
        }
        return b;
      });

      // Update bowler stats
      const updatedBowlers = innings.bowlers.map(b => {
        if (b.playerId === innings.currentBowler) {
          const newBalls = b.balls + 1;
          return {
            ...b,
            balls: newBalls % 6,
            overs: b.overs + (newBalls === 6 ? 1 : 0),
            runs: b.runs + runs,
          };
        }
        return b;
      });

      // Calculate new over/ball count
      const newBalls = (innings.balls + 1) % 6;
      const newOvers = innings.overs + (innings.balls + 1 === 6 ? 1 : 0);

      // Change strike on odd runs or end of over
      const shouldChangeStrike = runs % 2 === 1 || newBalls === 0;
      const newCurrentBatsmen: [string | null, string | null] = shouldChangeStrike
        ? [innings.currentBatsmen[1], innings.currentBatsmen[0]]
        : innings.currentBatsmen;

      // Update current partnership
      const updatedPartnership = innings.currentPartnership
        ? {
            ...innings.currentPartnership,
            runs: innings.currentPartnership.runs + runs,
            balls: innings.currentPartnership.balls + 1,
          }
        : null;

      // Create ball record
      const ballRecord: BallRecord = {
        ballId: generateId(),
        overNumber: innings.overs,
        ballInOver: innings.balls,
        ballType: 'normal',
        batter: strikerId,
        bowler: innings.currentBowler,
        batterRuns: runs,
        extraRuns: 0,
        isWicket: false,
        isLegalDelivery: true,
        isFreeHit: innings.isFreeHit,
        displayValue: runs === 0 ? '•' : runs.toString(),
      };

      // Update overs history
      let updatedOversHistory = [...innings.oversHistory];
      if (innings.balls === 0 && updatedOversHistory.length <= innings.overs) {
        updatedOversHistory.push({
          overNumber: innings.overs + 1,
          bowlerId: innings.currentBowler,
          balls: [],
          runsThisOver: 0,
          wicketsThisOver: 0,
        });
      }
      
      if (updatedOversHistory.length > 0) {
        const lastOver = updatedOversHistory[updatedOversHistory.length - 1];
        lastOver.balls.push(ballRecord);
        lastOver.runsThisOver += runs;
      }

      // Check if innings complete
      const isInningsComplete = newOvers >= state.totalOvers || innings.wickets >= 10;

      const updatedInnings: InningsState = {
        ...innings,
        runs: innings.runs + runs,
        overs: newOvers,
        balls: newBalls,
        batsmen: updatedBatsmen.map(b => ({
          ...b,
          isOnStrike: b.playerId === newCurrentBatsmen[0],
        })),
        bowlers: updatedBowlers,
        currentBatsmen: newCurrentBatsmen,
        oversHistory: updatedOversHistory,
        currentPartnership: updatedPartnership,
        isFreeHit: false,
        isComplete: isInningsComplete,
      };

      return {
        ...state,
        [inningsKey]: updatedInnings,
      };
    }

    case 'ADD_WIDE': {
      if (!state) return null;
      const inningsKey = state.currentInnings === 1 ? 'innings1' : 'innings2';
      const innings = state[inningsKey];
      if (!innings || !innings.currentBowler) return state;

      const extraRuns = 1 + action.payload;

      const updatedBowlers = innings.bowlers.map(b => {
        if (b.playerId === innings.currentBowler) {
          return { ...b, runs: b.runs + extraRuns, wides: b.wides + 1 };
        }
        return b;
      });

      const updatedExtras: Extras = {
        ...innings.extras,
        wides: innings.extras.wides + extraRuns,
        total: innings.extras.total + extraRuns,
      };

      return {
        ...state,
        [inningsKey]: {
          ...innings,
          runs: innings.runs + extraRuns,
          extras: updatedExtras,
          bowlers: updatedBowlers,
        },
      };
    }

    case 'ADD_NO_BALL': {
      if (!state) return null;
      const inningsKey = state.currentInnings === 1 ? 'innings1' : 'innings2';
      const innings = state[inningsKey];
      if (!innings || !innings.currentBowler) return state;

      const extraRuns = 1 + action.payload;

      const updatedBowlers = innings.bowlers.map(b => {
        if (b.playerId === innings.currentBowler) {
          return { ...b, runs: b.runs + extraRuns, noBalls: b.noBalls + 1 };
        }
        return b;
      });

      const updatedExtras: Extras = {
        ...innings.extras,
        noBalls: innings.extras.noBalls + extraRuns,
        total: innings.extras.total + extraRuns,
      };

      return {
        ...state,
        [inningsKey]: {
          ...innings,
          runs: innings.runs + extraRuns,
          extras: updatedExtras,
          bowlers: updatedBowlers,
          isFreeHit: true,
        },
      };
    }

    case 'ADD_WICKET': {
      if (!state) return null;
      const inningsKey = state.currentInnings === 1 ? 'innings1' : 'innings2';
      const innings = state[inningsKey];
      if (!innings || !innings.currentBatsmen[0] || !innings.currentBowler) return state;
      if (innings.isFreeHit) return state; // Can't get out on free hit (except run out)

      const strikerId = innings.currentBatsmen[0];
      const striker = innings.batsmen.find(b => b.playerId === strikerId);

      // Update batsman as out
      const updatedBatsmen = innings.batsmen.map(b => {
        if (b.playerId === strikerId) {
          return { ...b, isOut: true, howOut: action.payload.howOut, balls: b.balls + 1 };
        }
        return b;
      });

      // Update bowler stats
      const updatedBowlers = innings.bowlers.map(b => {
        if (b.playerId === innings.currentBowler) {
          const newBalls = b.balls + 1;
          return {
            ...b,
            balls: newBalls % 6,
            overs: b.overs + (newBalls === 6 ? 1 : 0),
            wickets: action.payload.bowlerCredit !== false ? b.wickets + 1 : b.wickets,
          };
        }
        return b;
      });

      const newBalls = (innings.balls + 1) % 6;
      const newOvers = innings.overs + (innings.balls + 1 === 6 ? 1 : 0);
      const newWickets = innings.wickets + 1;

      // Record fall of wicket
      const newFoW: FallOfWicket = {
        wicketNumber: newWickets,
        score: `${innings.runs}/${newWickets}`,
        over: formatOvers(newOvers, newBalls),
        batsmanOut: striker?.name || '',
      };

      // Save current partnership
      const savedPartnerships = innings.currentPartnership
        ? [...innings.partnerships, innings.currentPartnership]
        : innings.partnerships;

      const isInningsComplete = newWickets >= 10 || newOvers >= state.totalOvers;

      return {
        ...state,
        [inningsKey]: {
          ...innings,
          wickets: newWickets,
          overs: newOvers,
          balls: newBalls,
          batsmen: updatedBatsmen,
          bowlers: updatedBowlers,
          currentBatsmen: [null, innings.currentBatsmen[1]],
          fallOfWickets: [...innings.fallOfWickets, newFoW],
          partnerships: savedPartnerships,
          currentPartnership: null,
          isComplete: isInningsComplete,
        },
      };
    }

    case 'CHANGE_STRIKE': {
      if (!state) return null;
      const inningsKey = state.currentInnings === 1 ? 'innings1' : 'innings2';
      const innings = state[inningsKey];
      if (!innings) return state;

      const newCurrentBatsmen: [string | null, string | null] = [
        innings.currentBatsmen[1],
        innings.currentBatsmen[0],
      ];

      return {
        ...state,
        [inningsKey]: {
          ...innings,
          currentBatsmen: newCurrentBatsmen,
          batsmen: innings.batsmen.map(b => ({
            ...b,
            isOnStrike: b.playerId === newCurrentBatsmen[0],
          })),
        },
      };
    }

    case 'END_INNINGS': {
      if (!state) return null;
      
      if (state.currentInnings === 1) {
        const innings1 = state.innings1;
        if (!innings1) return state;

        // Start second innings
        const battingSecond = innings1.bowlingTeam;
        const bowlingSecond = innings1.battingTeam;

        return {
          ...state,
          currentInnings: 2,
          innings1: { ...innings1, isComplete: true },
          innings2: createInningsState(battingSecond, bowlingSecond),
        };
      } else {
        // End match
        const innings1 = state.innings1;
        const innings2 = state.innings2;
        if (!innings1 || !innings2) return state;

        let winner: 'teamA' | 'teamB' | 'tie' | null = null;
        if (innings1.runs > innings2.runs) {
          winner = innings1.battingTeam === state.teamA ? 'teamA' : 'teamB';
        } else if (innings2.runs > innings1.runs) {
          winner = innings2.battingTeam === state.teamA ? 'teamA' : 'teamB';
        } else {
          winner = 'tie';
        }

        return {
          ...state,
          innings2: { ...innings2, isComplete: true },
          isComplete: true,
          winner,
        };
      }
    }

    case 'RESET':
      return null;

    default:
      return state;
  }
}

export function MatchProvider({ children }: { children: ReactNode }) {
  const [match, dispatch] = useReducer(matchReducer, null);

  const currentInnings = match 
    ? (match.currentInnings === 1 ? match.innings1 : match.innings2)
    : null;

  return (
    <MatchContext.Provider value={{ match, dispatch, currentInnings }}>
      {children}
    </MatchContext.Provider>
  );
}

export function useMatch() {
  const context = useContext(MatchContext);
  if (context === undefined) {
    throw new Error('useMatch must be used within a MatchProvider');
  }
  return context;
}
