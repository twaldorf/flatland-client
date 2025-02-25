import { useRef } from "react";
import { drawPieceThumbnail } from "../../2D/rendering/drawPieceThumbnail";
import { useAppState } from "../store";

export const Pieces = (props:PiecesProps) => {

  const pieces = useAppState((state) => state.pieces);
  const thumbnailRef = useRef<HTMLCanvasElement>(null);
  
  return (
    <div>
      { pieces.map((piece:Piece) => {
        if (thumbnailRef.current) {
          drawPieceThumbnail(piece, thumbnailRef.current);
        };

        return (
          <li>{piece.name}
            <canvas ref={thumbnailRef}></canvas>
          </li>)
      })}
    </div>
  )
}