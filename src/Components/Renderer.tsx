import { ArcRotateCamera, Color4, DefaultRenderingPipeline, HemisphericLight, Scene, Vector3 } from '@babylonjs/core';
import * as React from 'react';
import GeometrySidebar from './GeometryGeneration/GeometrySidebar';
import SceneComponent from './Scene';
import { MeshType } from '../enums';
import { addMeshToScene } from '../babylon/geometry/makeMesh';
import { ethMeshRhino } from '../babylon/eth';

export const CUSTOM_SHADER_NAME = 'customShaderName';

const onSceneReady = (scene: Scene, canvas: HTMLCanvasElement) => {
  const light = new HemisphericLight('ambient', new Vector3(0, 1, 0), scene);
  scene.clearColor = new Color4(1, 0.9, 0.9, 1);
  light.intensity = 1.5;
  const camera: ArcRotateCamera = new ArcRotateCamera('Camera', Math.PI / 4, Math.PI / 4, 1000, new Vector3(0, 200, 0), scene);

  camera.wheelPrecision = 10;
  camera.inertia = 0.1;

  camera.attachControl(canvas, true);
  const pipeline = new DefaultRenderingPipeline('default', true, scene, [camera]);
  pipeline.samples = 1;

  addMeshToScene(ethMeshRhino(), scene);

  scene.registerBeforeRender(() => {});
};

const onRender = (scene: Scene) => {};

const Renderer: React.FC = () => {
  const [mesh, setMesh] = React.useState<MeshType>();

  return (
    <div>
      <SceneComponent
        antialias
        mesh={mesh}
        onSceneReady={onSceneReady}
        onRender={onRender}
        id='babylon-canvas'
        engineOptions={undefined}
        adaptToDeviceRatio={undefined}
        sceneOptions={undefined}
      />
      <GeometrySidebar setMesh={setMesh} />
    </div>
  );
};

export default Renderer;
