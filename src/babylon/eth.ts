import { Vector3 } from '@babylonjs/core';
import { MeshType } from '../enums';
import { invertFaces } from './geometry/makeMesh';

const arcPrecisionHigh = 100;

const interpolateArc = (o: Vector3, xDir: Vector3, yDir: Vector3): Vector3[] => {
  const aStep = (Math.PI * 0.5) / arcPrecisionHigh;
  const positions: Vector3[] = [];
  for (let i = 0; i < arcPrecisionHigh + 1; i++) {
    const a = aStep * i;
    positions.push(o.add(xDir.scale(Math.cos(a))).add(yDir.scale(Math.sin(a))));
  }

  return positions;
};

const mainProfile = (xDir: Vector3, zDir: Vector3): Vector3[] => {
  const r0 = 20;
  const r = 100;
  const thv0 = 5;
  const thv1 = 25;
  const thh0 = 5;
  const h0 = 150;
  const h1 = 170;
  const h2 = 140;

  const outerR = r0 + r + thv0 + thv1;
  const topH = h0 + h1 + thh0 + h2 + r;

  const domeOrigin = zDir.scale(h0 + h1 + thh0 + h2);
  const domeXDir = xDir
    .scale(r0 + r)
    .add(zDir.scale(h0 + h1 + thh0 + h2))
    .subtract(domeOrigin);
  const domeYDir = xDir.scale(r0).add(zDir.scale(topH)).subtract(domeOrigin);
  return [
    xDir.scale(outerR),
    xDir.scale(outerR).add(zDir.scale(h0)),
    xDir.scale(outerR - thv1).add(zDir.scale(h0)),
    xDir.scale(outerR - thv1).add(zDir.scale(h0 + h1)),
    xDir.scale(outerR).add(zDir.scale(h0 + h1)),
    xDir.scale(outerR).add(zDir.scale(h0 + h1 + thh0)),
    xDir.scale(outerR - thv1).add(zDir.scale(h0 + h1 + thh0)),
    xDir.scale(outerR - thv1).add(zDir.scale(h0 + h1 + thh0 + h2)),
    ...interpolateArc(domeOrigin, domeXDir, domeYDir),
    zDir.scale(topH),
  ];
};

const loftProfiles = (positions: Vector3[][], close: boolean = true): MeshType => {
  const mesh: MeshType = { positions: [], faces: [] };
  mesh.positions = positions.flat();

  for (let i = 0; i < positions.length + (close ? 1 : 0); i++) {
    for (let j = 0; j < positions[i % positions.length].length - 1; j++) {
      const a = (i * positions[i % positions.length].length + j) % mesh.positions.length;
      const b = (i * positions[i % positions.length].length + j + 1) % mesh.positions.length;
      const c = ((i + 1) * positions[i % positions.length].length + j) % mesh.positions.length;
      const d = ((i + 1) * positions[i % positions.length].length + j + 1) % mesh.positions.length;

      mesh.faces.push([a, b, d, c]);
    }
  }

  return mesh;
};

export const ethMesh = (): MeshType => {
  const profiles: Vector3[][] = [];

  const divs = 24;
  const angleStep = (2 * Math.PI) / divs;
  for (let i = 0; i < divs; i++) {
    const angle = angleStep * i;
    const xDir = new Vector3(Math.cos(angle), 0, Math.sin(angle));
    const zDir = new Vector3(0, 1, 0);
    profiles.push(mainProfile(xDir, zDir));
  }

  const mesh = loftProfiles(profiles, true);
  invertFaces(mesh);

  return mesh;
};
