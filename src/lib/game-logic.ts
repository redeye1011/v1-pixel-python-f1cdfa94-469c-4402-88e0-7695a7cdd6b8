import { GRID_SIZE } from './constants';
export type Coord = { x: number; y: number };
export const getRandomCoord = (exclude: Coord[] = []): Coord => {
  let newCoord: Coord;
  do {
    newCoord = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (exclude.some(c => c.x === newCoord.x && c.y === newCoord.y));
  return newCoord;
};
export const isCollision = (head: Coord, body: Coord[]): boolean => {
  // Check collision against the tail only (all segments except the head)
  return body.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
};
export const isOutOfBounds = (coord: Coord): boolean => {
  return coord.x < 0 || coord.x >= GRID_SIZE || coord.y < 0 || coord.y >= GRID_SIZE;
};