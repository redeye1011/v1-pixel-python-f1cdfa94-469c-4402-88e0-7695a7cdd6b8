export const GRID_SIZE = 20;
export const GAME_SPEED_START = 200; // ms per tick
export const GAME_TIMER_START = 180; // seconds
// Scoring
export const SCORE_FOOD = 10;
export const SCORE_BONUS_FRUIT = 50;
export const SCORE_PIXEL_RUSH_BONUS = 5;
// Timings
export const BONUS_FRUIT_SPAWN_RATE = 20; // seconds
export const BOOST_SPAWN_RATE = 15; // seconds
// Boost Durations (in seconds)
export const BOOST_DURATION = {
  CHRONO_BRAKE: 8,
  PIXEL_RUSH: 10,
  GLITCH_MULTIPLIER: 7,
  PHASE_SHIFT: 6,
};
export const BOOST_TYPES = {
  CHRONO_BRAKE: 'CHRONO_BRAKE',
  PIXEL_RUSH: 'PIXEL_RUSH',
  GLITCH_MULTIPLIER: 'GLITCH_MULTIPLIER',
  PHASE_SHIFT: 'PHASE_SHIFT',
  FRUIT_FIESTA: 'FRUIT_FIESTA',
} as const;
export type BoostType = keyof typeof BOOST_TYPES;
export const BOOST_CONFIG = {
  [BOOST_TYPES.CHRONO_BRAKE]: { id: BOOST_TYPES.CHRONO_BRAKE, symbol: 'S', duration: BOOST_DURATION.CHRONO_BRAKE },
  [BOOST_TYPES.PIXEL_RUSH]: { id: BOOST_TYPES.PIXEL_RUSH, symbol: '»', duration: BOOST_DURATION.PIXEL_RUSH },
  [BOOST_TYPES.GLITCH_MULTIPLIER]: { id: BOOST_TYPES.GLITCH_MULTIPLIER, symbol: 'x2', duration: BOOST_DURATION.GLITCH_MULTIPLIER },
  [BOOST_TYPES.PHASE_SHIFT]: { id: BOOST_TYPES.PHASE_SHIFT, symbol: '░', duration: BOOST_DURATION.PHASE_SHIFT },
  [BOOST_TYPES.FRUIT_FIESTA]: { id: BOOST_TYPES.FRUIT_FIESTA, symbol: '!!!', duration: 0 }, // Instant
} as const;
export const SCORING_TIERS = [
  { min: 0, rank: "Pixel Pilot" },
  { min: 500, rank: "Grid Runner" },
  { min: 1000, rank: "Vector Viper" },
  { min: 1500, rank: "CRT Conqueror" },
  { min: 2000, rank: "Glitch God" },
];