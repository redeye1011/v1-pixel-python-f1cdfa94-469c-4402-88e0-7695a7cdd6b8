import { create } from 'zustand';
import {
  BOOST_CONFIG,
  BOOST_TYPES,
  GAME_SPEED_START,
  GAME_TIMER_START,
  GRID_SIZE,
  SCORE_BONUS_FRUIT,
  SCORE_FOOD,
  SCORE_PIXEL_RUSH_BONUS,
  BoostType,
  BONUS_FRUIT_SPAWN_RATE,
  BOOST_SPAWN_RATE,
} from '@/lib/constants';
import { Coord, getRandomCoord } from '@/lib/game-logic';
type GameStatus = 'idle' | 'playing' | 'gameOver';
type ActiveBoost = {
  type: BoostType;
  timeLeft: number;
} | null;
type GameState = {
  gameStatus: GameStatus;
  snake: Coord[];
  direction: Coord;
  food: Coord;
  bonusFruit: Coord | null;
  boosts: { type: BoostType; location: Coord }[];
  score: number;
  gameTimer: number;
  bonusFruitTimer: number;
  boostSpawnTimer: number;
  gameSpeed: number;
  activeBoost: ActiveBoost;
  lastTick: number;
};
type GameActions = {
  startGame: () => void;
  tick: () => void;
  changeDirection: (newDirection: Coord) => void;
  resetGame: () => void;
  advanceTimers: () => void;
};
const initialSnake: Coord[] = [{ x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) }];
const initialFood = getRandomCoord(initialSnake);
const initialState: GameState = {
  gameStatus: 'idle',
  snake: initialSnake,
  direction: { x: 0, y: -1 }, // Start moving up
  food: initialFood,
  bonusFruit: null,
  boosts: [],
  score: 0,
  gameTimer: GAME_TIMER_START,
  bonusFruitTimer: BONUS_FRUIT_SPAWN_RATE,
  boostSpawnTimer: BOOST_SPAWN_RATE,
  gameSpeed: GAME_SPEED_START,
  activeBoost: null,
  lastTick: 0,
};
export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...initialState,
  startGame: () => {
    set({ ...initialState, gameStatus: 'playing', food: getRandomCoord(initialState.snake), boosts: [], bonusFruit: null });
  },
  resetGame: () => {
    set({ ...initialState, food: getRandomCoord(initialState.snake), boosts: [], bonusFruit: null });
  },
  changeDirection: (newDirection) => {
    const { direction } = get();
    // Prevent reversing direction
    if (newDirection.x === -direction.x && newDirection.y === -direction.y) {
      return;
    }
    set({ direction: newDirection });
  },
  advanceTimers: () => {
    if (get().gameStatus !== 'playing') return;
    set((state) => ({
      gameTimer: state.gameTimer - 1,
      bonusFruitTimer: state.bonusFruitTimer - 1,
      boostSpawnTimer: state.boostSpawnTimer - 1,
      activeBoost: state.activeBoost ? { ...state.activeBoost, timeLeft: state.activeBoost.timeLeft - 1 } : null,
    }));
    const { gameTimer, bonusFruitTimer, boostSpawnTimer, activeBoost, snake, food } = get();
    if (gameTimer <= 0) {
      set({ gameStatus: 'gameOver' });
      return;
    }
    if (activeBoost && activeBoost.timeLeft <= 0) {
      set({ activeBoost: null });
    }
    if (bonusFruitTimer <= 0) {
      set({
        bonusFruit: getRandomCoord([...snake, food]),
        bonusFruitTimer: BONUS_FRUIT_SPAWN_RATE,
      });
    }
    if (boostSpawnTimer <= 0) {
      const boostTypes = Object.keys(BOOST_TYPES) as BoostType[];
      const randomBoostType = boostTypes[Math.floor(Math.random() * boostTypes.length)];
      set(state => ({
        boosts: [...state.boosts, { type: randomBoostType, location: getRandomCoord([...state.snake, state.food, ...(state.bonusFruit ? [state.bonusFruit] : [])]) }],
        boostSpawnTimer: BOOST_SPAWN_RATE,
      }));
    }
  },
  tick: () => {
    const { snake, direction, food, bonusFruit, boosts, score, activeBoost, gameStatus } = get();
    if (gameStatus !== 'playing') return;
    let newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    let newSnake = [...snake];
    let newScore = score;
    let ateFood = false;
    let newActiveBoost = activeBoost;
    let newBoosts = [...boosts];
    let newBonusFruit = bonusFruit;
    // Phase Shift Logic
    if (activeBoost?.type === BOOST_TYPES.PHASE_SHIFT) {
      if (newHead.x < 0) newHead.x = GRID_SIZE - 1;
      if (newHead.x >= GRID_SIZE) newHead.x = 0;
      if (newHead.y < 0) newHead.y = GRID_SIZE - 1;
      if (newHead.y >= GRID_SIZE) newHead.y = 0;
    }
    // Collision Detection
    const isOutOfBounds = newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE;
    const selfCollision = newSnake.slice(1).some(segment => segment.x === newHead.x && segment.y === newHead.y);
    if ((isOutOfBounds || selfCollision) && activeBoost?.type !== BOOST_TYPES.PHASE_SHIFT) {
      set({ gameStatus: 'gameOver' });
      return;
    }
    newSnake.unshift(newHead);
    // Food Consumption
    if (newHead.x === food.x && newHead.y === food.y) {
      ateFood = true;
      let points = SCORE_FOOD;
      if (activeBoost?.type === BOOST_TYPES.PIXEL_RUSH) points += SCORE_PIXEL_RUSH_BONUS;
      if (activeBoost?.type === BOOST_TYPES.GLITCH_MULTIPLIER) points *= 2;
      newScore += points;
      set({ food: getRandomCoord(newSnake) });
    }
    // Bonus Fruit Consumption
    if (newBonusFruit && newHead.x === newBonusFruit.x && newHead.y === newBonusFruit.y) {
      ateFood = true;
      let points = SCORE_BONUS_FRUIT;
      if (activeBoost?.type === BOOST_TYPES.GLITCH_MULTIPLIER) points *= 2;
      newScore += points;
      newBonusFruit = null;
    }
    // Boost Consumption
    const collectedBoostIndex = newBoosts.findIndex(b => b.location.x === newHead.x && b.location.y === newHead.y);
    if (collectedBoostIndex > -1) {
      const collectedBoost = newBoosts[collectedBoostIndex];
      newBoosts.splice(collectedBoostIndex, 1);
      if (collectedBoost.type === BOOST_TYPES.FRUIT_FIESTA) {
        // This is a simplified version due to state limitations. It just moves the food.
        // A full implementation would require food to be an array.
        set(state => ({ food: getRandomCoord([...state.snake, state.food]) }));
      } else {
        newActiveBoost = {
          type: collectedBoost.type,
          timeLeft: BOOST_CONFIG[collectedBoost.type].duration,
        };
      }
    }
    if (!ateFood) {
      newSnake.pop();
    }
    // Update Game Speed based on active boost
    let newGameSpeed = GAME_SPEED_START;
    if (newActiveBoost) {
      switch (newActiveBoost.type) {
        case BOOST_TYPES.PIXEL_RUSH:
          newGameSpeed /= 2;
          break;
        case BOOST_TYPES.CHRONO_BRAKE:
          newGameSpeed *= 2;
          break;
      }
    }
    set({
      snake: newSnake,
      score: newScore,
      activeBoost: newActiveBoost,
      boosts: newBoosts,
      bonusFruit: newBonusFruit,
      gameSpeed: newGameSpeed,
      lastTick: Date.now(),
    });
  },
}));