import React, { useState, useEffect } from 'react';
import { Piece } from '../../types';
import { usePiecesStore } from '../PiecesStore';

export const LibraryPieceComponent = (props) => {
  const pieces = usePiecesStore(s => s.pieces);
  console.log(pieces)

  return (
    <div>
      { Array.from(pieces.values()).map((piece:Piece) => {
        return <PieceDetail piece={piece}/>
      }) }
    </div>
  );
};

const PieceDetail = ({piece}) => {
  return (
    <div>
      {piece.name}
    </div>
  )
}

export default LibraryPieceComponent;