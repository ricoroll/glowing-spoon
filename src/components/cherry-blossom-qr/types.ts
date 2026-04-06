export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface BlockData {
  positions:  number[];
  heights:    number[];
  baseY:      number[];
  types:      number[];
  gridSize:   number;
  numBlocks:  number;
}

export const BlockType = {
  Dirt:          0,
  CherryBlossom: 1,
  Trunk:         2,
  Grass:         3,
  FallenPetals:  4,
} as const;
