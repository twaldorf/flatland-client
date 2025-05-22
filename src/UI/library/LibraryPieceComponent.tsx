import React, { useState, useEffect, useRef } from 'react';
import { Piece } from '../../types';
import { usePiecesStore } from '../PiecesStore';
import { drawPieceThumbnail } from '../../2D/rendering/drawPieceThumbnail';
import { NumericAdjuster } from '../modulators/NumericAdjuster';
import { useMarkerStore } from '../sections/MarkerStore';

interface LibraryPieceProps {
  piece:Piece;
  selected:boolean;
  onSelect:() => void;
}

export const LibraryPieceComponent = ({piece}:LibraryPieceProps) => {
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

  const [checked, setChecked] = useState(false);

  const handleCheckbox = () => {
    if (checked) useMarkerStore.getState().addPieceToMarker();
  }
  
  return (
    <li>
      <span>Collect for marker: </span><input type="checkbox" value={checked} onChange={handleCheckbox}/>
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