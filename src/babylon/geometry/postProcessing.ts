import { Vector2, Vector3 } from '@babylonjs/core';
import { sdGyroid } from './distanceFunctions';

// uses a given set of entry data and shift it's positions based on given data
// uses only 2d positiond data that then gets shifted into the right location

function positiveAngle(v0: Vector2, v1: Vector2) {
  const angle = Math.atan2(v1.y, v1.x) - Math.atan2(v0.y, v0.x);
  return angle < 0 ? angle + 2 * Math.PI : angle;
}

function rotate(v: Vector2, angle: number) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return new Vector2(v.x * cos - v.y * sin, v.x * sin + v.y * cos);
}

// assumes they are closed
const getOffsetDirections = (vs: Vector2[]): Vector2[] => {
  const directions = vs.map((v, i) => vs[(i + 1) % vs.length].subtract(v));

  const offsetDirections: Vector2[] = [];

  for (let i = 0; i < vs.length; i++) {
    const d0 = directions[(i + directions.length - 1) % directions.length];
    const d1 = directions[i];
    const posAngle = positiveAngle(d1, d0);
    const offsetVectorScale = 1 / Math.cos(posAngle * 0.5);
    const offsetVectorDirection = rotate(d1, Math.PI * 0.5 + posAngle * 0.5).scale(offsetVectorScale);

    offsetDirections.push(offsetVectorDirection);
  }

  return offsetDirections;
};

export const offsetSimpleValue = (v: Vector2, h: number, hIndex: number): number => -3;

export const offsetPolyline = (
  vs: Vector2[],
  h: number,
  hIndex: number,
  valueFunction: (v: Vector2, h: number, hIndex) => number = offsetSimpleValue
): Vector2[] => {
  const offsetDirections = getOffsetDirections(vs);
  return vs.map((v, i) => v.add(offsetDirections[i].scale(valueFunction(v, h, hIndex))));
};

export const gyroidPostProcessing = (v: Vector2, h: number): number => {
  const location = new Vector3(v.x, v.y, h);
  return sdGyroid(location, 0.1) * 5 + 5;
};

export const defaultZDomain: [number, number] = [0, 500];

export const catmullPolygon = (vs: Vector3[]) => {
  const midPoints = vs.map((v, i) => v.add(vs[(i + 1) % vs.length]).scale(0.5));
  const result = [];
  midPoints.forEach((m, i) => {
    result.push(
      m
        .add(midPoints[(i + midPoints.length - 1) % midPoints.length])
        .scale(0.5)
        .add(vs[i])
        .scale(0.5)
    );
    result.push(m);
  });

  return result;
};

export const catmullPolygonN = (vs: Vector3[], n: number) => {
  n = n > 10 ? 10 : n;
  for (let i = 0; i < n; i++) {
    vs = catmullPolygon(vs);
  }

  return vs;
};

export const catmullPolylineN = (vs: Vector3[], n: number) => {
  const localVS = [vs[0], ...vs, vs[vs.length - 1]];
  const catmullResult = catmullPolygonN(localVS, n);

  return catmullResult.slice((n + 1) * n, catmullResult.length - (n + 1) * (n + 2));
};

export const scaleFunction = (z: number, domain: [number, number] = defaultZDomain): number => {
  return 1 + ((z - domain[0]) / (domain[1] - domain[0])) * -1;
};

export const positionScaling = (v: Vector3, f: (z: number) => number = scaleFunction): Vector3 => {
  const s = f(v.z);
  return new Vector3(v.x, v.y * s, v.z);
};

export const tweeningZ = (layers: Vector3[][], layerHeight): Vector3[] => {
  const tweenedVs = [];

  layers.forEach((layer) => {
    const zStep = layerHeight / layer.length;
    layer.forEach((v, i) => {
      const copy = v.clone();
      copy.z = zStep * i;
      tweenedVs.push(copy);
    });
  });

  return tweenedVs;
};

export const growthPostProcessing = (v: Vector2, h: number, growthScale: number, sliceLightValues: number[], hIndex: number = 0) => {
  const location = new Vector3(v.x, v.y, h);
  const vG = Math.sin(0.2 * sdGyroid(location, 0.1) * sliceLightValues[hIndex] * 0.0002) * growthScale + growthScale;
  return vG;
  // return v.subtract(center2d).length() < (r + outerRadiusDifference - 90) ? 0. : vG;
};
