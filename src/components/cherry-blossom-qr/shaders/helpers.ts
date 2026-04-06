import type { RGB } from '../types';

export function wgslVec3(c: RGB): string {
  return `vec3f(${c.r.toFixed(6)}, ${c.g.toFixed(6)}, ${c.b.toFixed(6)})`;
}

export const uniformsStruct = /* wgsl */ `
struct Uniforms {
  aspectRatio : f32,
  time        : f32,
  blockCount  : f32,
  progress    : f32,
  gridSize    : f32,
  _pad0       : f32,
  _pad1       : f32,
  _pad2       : f32,
}
`;
