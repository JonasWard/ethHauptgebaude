import { Mesh, Scene, VertexData } from '@babylonjs/core';
import { MeshType } from '../../enums';

export const addMeshToScene = (mesh: MeshType, scene: Scene) => {
  const vertexData = new VertexData();
  vertexData.positions = mesh.positions.map((p) => [p.x, p.y, p.z]).flat();
  vertexData.indices = mesh.faces.map((f) => (f.length === 3 ? f : [f[0], f[1], f[2], f[0], f[2], f[3]])).flat();
  vertexData.applyToMesh(new Mesh('mesh', scene), true);
};
