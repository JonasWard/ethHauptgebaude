import { Vector3 } from '@babylonjs/core';
import { Button } from 'antd';
import * as React from 'react';
import { EXAMPLE_CUBE, EXAMPLE_QUAD, EXAMPLE_TRIANGLE, MeshType } from '../../enums';
import { ethMesh, ethMeshRhino } from '../../babylon/eth';
import './sidebar.css';

const width = 150;
const buttonMargin = 2;
const buttonH = 25;

const rightSidebarStyle = { transition: 'all 0.5s', width: `${width}px` };
const commonStyle: React.CSSProperties = {
  ...rightSidebarStyle,
  position: 'absolute',
  left: 0,
  top: 0,
};
const rightSidedarButtonLocal = {
  width: `${width - buttonMargin * 4}px`,
  margin: `${buttonMargin * 3}px ${buttonMargin}px ${buttonMargin * 1.5}px ${buttonMargin * 1.5}px`,
  height: `${buttonH}px`,
};

export interface IGeometrySidebarProps {
  setMesh?: (vs: MeshType) => void;
}

const GeometrySidebar: React.FC<IGeometrySidebarProps> = ({ setMesh }) => {
  const [isVisible, setIsVisible] = React.useState(true);

  const visibleStyle: React.CSSProperties = {
    ...commonStyle,
    zIndex: 1,
    height: '100vh',
    background: 'ivory',
    boxShadow: '0 0 25px 2px black',
    marginTop: '20px',
  };
  const invisibleStyle: React.CSSProperties = {
    ...commonStyle,
    left: '-150px',
    zIndex: 1,
    height: '100vh',
    background: 'ivory',
    boxShadow: '0 0 0 0 black',
    marginTop: '20px',
  };

  const visibleToggleButtonStyle: React.CSSProperties = {
    ...commonStyle,
    zIndex: 2,
    height: '20px',
    background: 'ivory',
  };
  const invisibleToggleButtonStyle: React.CSSProperties = {
    ...commonStyle,
    zIndex: 2,
    height: '20px',
    background: '',
  };

  return (
    <>
      <button style={isVisible ? visibleToggleButtonStyle : invisibleToggleButtonStyle} onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? 'Hide' : 'Show'}
      </button>

      <div style={isVisible ? visibleStyle : invisibleStyle}>
        <button style={rightSidedarButtonLocal} className='rightSidedarButton' onClick={() => setMesh(EXAMPLE_TRIANGLE)}>
          add tri
        </button>
        <button style={rightSidedarButtonLocal} className='rightSidedarButton' onClick={() => setMesh(EXAMPLE_QUAD)}>
          add quad
        </button>
        <button style={rightSidedarButtonLocal} className='rightSidedarButton' onClick={() => setMesh(EXAMPLE_CUBE)}>
          add cube
        </button>
        <button style={rightSidedarButtonLocal} className='rightSidedarButton' onClick={() => setMesh(ethMeshRhino())}>
          add eth rhino
        </button>
        <button style={rightSidedarButtonLocal} className='rightSidedarButton' onClick={() => setMesh(ethMesh())}>
          add eth parametric
        </button>
      </div>
    </>
  );
};

export default GeometrySidebar;
