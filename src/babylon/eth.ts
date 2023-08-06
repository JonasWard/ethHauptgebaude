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

const mainProfileFromRhinoValuesA = [
  [0, 0],
  [-307.3873134448529, 0.0],
  [-307.3873134448529, 114.71700637457494],
  [-309.53095947689604, 114.71700637457494],
  [-309.53095947689604, 117.43562080556964],
  [-313.64561915623943, 122.57894540474896],
  [-307.3873134448529, 122.57894540474896],
  [-307.3873134448529, 126.8358806718006],
  [-305.45912794536747, 126.8358806718006],
  [-305.45912794536747, 137.63686233007704],
  [-307.3873134448529, 137.63686233007704],
  [-307.3873134448529, 139.97355962021138],
  [-305.45912794536747, 139.97355962021138],
  [-305.45912794536747, 145.0919023570518],
  [-300.78237698322283, 145.0919023570518],
  [-298.6533790884623, 153.40463619222353],
];
const mainProfileFromRhinoValuesB = [
  [-298.6533790884623, 283.3981785176454],
  [-298.6533790884623, 283.3981785176454],
  [-298.6533790884623, 291.0492454796315],
  [-298.6533790884623, 291.0492454796315],
  [-298.6533790884623, 293.18005138500587],
  [-300.78237698322283, 293.18005138500587],
  [-305.45912794536747, 304.0545091089849],
  [-298.6533790884623, 304.0545091089849],
  [-298.6533790884623, 319.3736741464338],
  [-309.53095947689604, 319.3736741464338],
  [-313.64561915623943, 326.8870841137657],
  [-313.64561915623943, 326.8870841137657],
  [-313.64561915623943, 329.12686663784916],
  [-300.78237698322283, 329.12686663784916],
  [-300.78237698322283, 336.1821815887124],
  [-298.6533790884623, 336.1821815887124],
  [-298.6533790884623, 340.21379013206285],
  [-296.69177626927336, 340.21379013206285],
  [-296.69177626927336, 350.79290710504335],
  [-298.6533790884623, 350.79290710504335],
  [-298.6533790884623, 354.97106384517815],
  [-243.16894112901127, 354.97106384517815],
  [-243.16894112901127, 404.4043707011077],
  [-245.18403089589765, 407.6699736212215],
  [-243.16894112901127, 407.6699736212215],
  [-243.16894112901127, 444.6144743387233],
  [-245.18403089589765, 446.78381844055855],
  [-253.21843351010625, 446.78381844055855],
  [-253.21843351010625, 449.72885012566417],
  [-256.25707478499044, 452.58559956017973],
  [-250.4245446895211, 452.58559956017973],
  [-248.40101384007255, 454.7281616360665],
  [-248.40101384007255, 461.87003522235545],
  [-245.18403089589765, 461.87003522235545],
  [-245.18403089589765, 464.88681151135495],
  [-238.95777450591277, 470.00515424819537],
  [-227.6704804281361, 470.00515424819537],
];
const mainProfileFromRhinoValuesC = [
  [-47.84044739232047, 650.8848837758551],
  [-47.84044739232047, 659.5556984445145],
  [-46.242071707168634, 661.2355353375773],
  [-44.898202192718486, 665.2671438809277],
  [-44.898202192718486, 705.5866990919235],
  [-47.84044739232047, 709.5544066398618],
  [-47.84044739232047, 714.6242551733385],
  [-50.09594655220792, 717.7102499328461],
  [-46.242071707168634, 717.7102499328461],
  [-46.242071707168634, 722.984628166746],
  [-44.898202192718486, 725.0419580064178],
  [-46.242071707168634, 725.0419580064178],
  [-46.242071707168634, 729.4505219485713],
  [-42.568432729505275, 732.7569449051866],
  [-35.882110750572224, 732.7569449051866],
  [-28.093647786100632, 737.0920327816378],
  [-23.1013519303159, 742.8496805836018],
  [-21.891854842398516, 748.0972761153525],
  [-24.355615618890397, 750.1130803870278],
  [-23.1013519303159, 750.1130803870278],
  [-23.1013519303159, 756.7204388330744],
  [-24.355615618890397, 756.7204388330744],
  [-26.931365521586486, 760.1921017454039],
  [-23.1013519303159, 760.1921017454039],
  [-21.891854842398516, 763.3277972791209],
  [-21.891854842398516, 767.0234384438587],
  [-23.1013519303159, 769.2632209679423],
  [-20.77196358035667, 769.2632209679423],
  [-20.77196358035667, 773.9667642685179],
  [-19.28670854064353, 779.4403800480497],
  [-16.565372773882018, 784.701629197122],
  [-12.574080315965148, 790.4164343073212],
  [-7.2568953780307766, 795.3096126100579],
  [-3.0841805356631085, 798.6659267223971],
  [0.0, 799.8451722213272],
];

const joinMesh = (meshA: MeshType, meshB: MeshType): MeshType => {
  const mesh: MeshType = { positions: [], faces: [] };
  mesh.positions = [...meshA.positions, ...meshB.positions];
  mesh.faces = [
    ...meshA.faces,
    ...(meshB.faces.map((f) => f.map((i) => i + meshA.positions.length)) as ([number, number, number] | [number, number, number, number])[]),
  ];

  return mesh;
};

const mainProfileFromRhinoBottom = (xDir: Vector3, zDir: Vector3): Vector3[] => mainProfileFromRhinoValuesA.map(([x, y]) => xDir.scale(x).add(zDir.scale(y)));

const mainProfileFromRhinoTop = (xDir: Vector3, zDir: Vector3): Vector3[] => {
  const psB = mainProfileFromRhinoValuesB.map(([x, y]) => xDir.scale(x).add(zDir.scale(y)));
  const psC = mainProfileFromRhinoValuesC.map(([x, y]) => xDir.scale(x).add(zDir.scale(y)));

  const domeOrigin = xDir.scale(mainProfileFromRhinoValuesC[0][0]).add(zDir.scale(mainProfileFromRhinoValuesB[mainProfileFromRhinoValuesB.length - 1][1]));
  const domeXDir = psB[psB.length - 1].subtract(domeOrigin);
  const domeYDir = psC[0].subtract(domeOrigin);

  return [...psB, ...interpolateArc(domeOrigin, domeXDir, domeYDir), ...psC];
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

export const ethMeshRhino = (): MeshType => {
  const profilesA: Vector3[][] = [];
  const profilesB: Vector3[][] = [];

  const divs = 24;
  const angleStep = (2 * Math.PI) / divs;
  for (let i = 0; i < divs; i++) {
    const angle = angleStep * i;
    const xDir = new Vector3(Math.cos(angle), 0, Math.sin(angle));
    const zDir = new Vector3(0, 1, 0);
    profilesA.push(mainProfileFromRhinoBottom(xDir, zDir));
    profilesB.push(mainProfileFromRhinoTop(xDir, zDir));
    const angleBis = angleStep * (i + 0.15);
    const xDirBis = new Vector3(Math.cos(angleBis), 0, Math.sin(angleBis));
    profilesA.push(mainProfileFromRhinoBottom(xDir, zDir));
    profilesB.push(mainProfileFromRhinoTop(xDirBis, zDir));
  }

  const meshA = loftProfiles(profilesA, true);
  const meshB = loftProfiles(profilesB, true);

  const mesh = joinMesh(meshA, meshB);
  invertFaces(mesh);

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
