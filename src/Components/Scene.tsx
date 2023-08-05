import { useEffect, useRef } from 'react';
import { Engine, Scene } from '@babylonjs/core';
import * as React from 'react';
import shaders from '../babylon/shaders/shaders';
import { addMeshToScene } from '../babylon/geometry/makeMesh';

const materialStates = Object.keys(shaders);

export default ({ antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady, mesh, ...rest }) => {
  const reactCanvas: React.MutableRefObject<null | HTMLCanvasElement> = useRef(null);

  const [scene, setScene] = React.useState(new Scene(new Engine(null)));

  useEffect(() => {
    if (scene.isReady && mesh?.positions?.length > 0) {
      if (scene?.geometries) for (const geo of scene?.geometries) geo.dispose();

      addMeshToScene(mesh, scene);
    }
  }, [mesh, scene.isReady]);

  // set up basic engine and scene
  useEffect(() => {
    const { current: canvas } = reactCanvas;

    canvas.style.width = '100vw';
    canvas.style.height = '100vh';

    // registering webgl parameters
    const gl = canvas.getContext('webgl', { preserveDrawingBuffer: false }); // WebGL 2

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    if (!canvas) return;

    const engine = new Engine(canvas, antialias, engineOptions, adaptToDeviceRatio);
    const scene = new Scene(engine, sceneOptions);

    if (scene.isReady()) {
      onSceneReady(scene, canvas);
    } else {
      scene.onReadyObservable.addOnce((scene) => onSceneReady(scene, canvas));
    }

    engine.runRenderLoop(() => {
      if (typeof onRender === 'function') onRender(scene);
      scene.render();
    });

    const resize = () => {
      scene.getEngine().resize();
    };

    if (window) {
      window.addEventListener('resize', resize);
    }

    setScene(scene);

    return () => {
      scene.getEngine().dispose();

      if (window) {
        window.removeEventListener('resize', resize);
      }
    };
  }, [antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady]);

  return (
    <>
      <canvas ref={reactCanvas} {...rest} />
    </>
  );
};
