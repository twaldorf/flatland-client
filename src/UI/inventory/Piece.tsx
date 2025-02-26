import { useRef, useEffect } from "react";
import { drawPieceThumbnail } from "../../2D/rendering/drawPieceThumbnail";
import { Piece } from "../../types";

export const PieceComponent = ({ piece }: { piece: Piece }) => {
  const thumbnailRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (thumbnailRef.current) {
      drawPieceThumbnail(piece, thumbnailRef.current);
    }
  }, [piece]);

  return (
    <li className="my-auto mx-2">
      <canvas className="max-h-12" ref={thumbnailRef}></canvas>
      {piece.name}
    </li>
  );
};
