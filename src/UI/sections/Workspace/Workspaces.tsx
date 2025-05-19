import React, { Ref, RefObject } from 'react';
import { useViewState, ViewName } from '../../ViewState';
import Mark from '../../mark/Mark';
import { Editor } from '../Editor';
import { PieceLibrary } from '../PieceLibrary';
import Browser from '../../browse/Browse';
import { useViewRouting } from '../../../routes';

interface WorkspaceProps {
  canvasRef: RefObject<HTMLCanvasElement | null>,
  threeRef: RefObject<HTMLCanvasElement | null>,
}

export const Workspaces = (props:WorkspaceProps) => {
  const { canvasRef, threeRef } = props;
  const view = useViewRouting();

  switch (view) {
    case 'piece library':
      return <PieceLibrary />;
    case 'mark':
      return <Mark />;
    case 'browser':
      return <Browser />;
    default:
      return <Editor canvasRef={canvasRef} threeRef={threeRef}/>;
  }
};