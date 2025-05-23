import React, { useState, useEffect, useRef } from 'react';
import { Piece } from '../../types';
import { usePiecesStore } from '../PiecesStore';
import { drawPieceThumbnail } from '../../2D/rendering/drawPieceThumbnail';
import { NumericAdjuster } from '../modulators/NumericAdjuster';
import { useMarkerStore } from '../sections/MarkerStore';

interface LibraryPieceProps {
  piece:Piece;
  onSelect:(v:boolean) => void;
}

export const LibraryPieceComponent = ({piece, onSelect }:LibraryPieceProps) => {
  const thumbnailRef = useRef(null);

  useEffect(() => {
    if (thumbnailRef.current) {
      drawPieceThumbnail(piece, thumbnailRef.current);
    }
  }, [ piece ]);

  const quantity = usePiecesStore(s => s.pieces).get(piece.id)!.quantity!;

  const onQuantityUpdate = (value:number) => {
    usePiecesStore.getState().updatePieceField(piece.id, "quantity", value);
  }

  let selected = useMarkerStore.getState().trueIfPieceInMarker(piece.id);

  const handleCheckbox = () => {
    selected = selected === true ? false : true;
    onSelect(selected);
  }
  
  return (
    <li>
      <span>Collect for marker: </span><input type="checkbox" defaultChecked={selected} onChange={handleCheckbox}/>
      <canvas ref={thumbnailRef} >

      </canvas>
      <ul>
        <li>{piece.name}</li>
        <li>Cut quantity:<NumericAdjuster 
          value={quantity}
          dir={"ltr"}
          step={1}
          onChange={(v:number) => onQuantityUpdate(v)}
        />x</li>
      </ul>
    </li>
  );
};

export default LibraryPieceComponent;