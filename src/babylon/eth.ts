const interpolateArc = (o: Vector3, xDir: Vector3, yDir: Vector3): Vector3[] => {
  const aStep = (Math.PI * 0.5) / arcPrecisionHigh;
  const positions: Vector3[] = [];
  for (let i = 0; i < arcPrecisionHigh + 1; i++) {
    const a = aStep * i;
    positions.push(o.add(xDir.scale(Math.cos(a))).add(yDir.scale(Math.sin(a))));
  }

  return positions;
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
