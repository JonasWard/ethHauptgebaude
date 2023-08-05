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
