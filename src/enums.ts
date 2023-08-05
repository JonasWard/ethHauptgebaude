import { Vector3 } from '@babylonjs/core';

export type MeshType = { positions: Vector3[]; faces: ([number, number, number] | [number, number, number, number])[] };

export const EXAMPLE_TRIANGLE: MeshType = {
  positions: [new Vector3(0, 0, 0), new Vector3(1000, 0, 0), new Vector3(0, 0, 1000)],
  faces: [[0, 1, 2]],
};

export const EXAMPLE_QUAD: MeshType = {
  positions: [new Vector3(0, 0, 0), new Vector3(1000, 0, 0), new Vector3(1000, 0, 1000), new Vector3(0, 0, 1000)],
  faces: [[0, 1, 2, 3]],
};

export const EXAMPLE_CUBE: MeshType = {
  positions: [
    new Vector3(0, 0, 0),
    new Vector3(1000, 0, 0),
    new Vector3(1000, 0, 1000),
    new Vector3(0, 0, 1000),
    new Vector3(0, 1000, 0),
    new Vector3(1000, 1000, 0),
    new Vector3(1000, 1000, 1000),
    new Vector3(0, 1000, 1000),
  ],
  faces: [
    [3, 2, 1, 0],
    [4, 5, 6, 7],
    [0, 1, 5, 4],
    [1, 2, 6, 5],
    [2, 3, 7, 6],
    [3, 0, 4, 7],
  ],
};
