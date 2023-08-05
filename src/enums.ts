import { Vector3 } from '@babylonjs/core';

export type MeshType = { positions: Vector3[]; faces: ([number, number, number] | [number, number, number, number])[] };
