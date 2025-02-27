import { useRef } from "react";
import { drawPieceThumbnail } from "../../2D/rendering/drawPieceThumbnail";
import { useAppState } from "../store";
import { Piece } from "../../types";
import { PieceComponent } from "./Piece";

interface PiecesProps {

}

export const Pieces = () => {
  const pieces = useAppState((state) => state.pieces);

  return (
    <div className="rounded-lg bg-stone-200 min-h-24 bg-white p-2">
      <h4>Pieces</h4>
      <ul className="flex flex-row text-xs relative gap-2 overflow-auto">
        {pieces.map((piece) => (
          <PieceComponent key={piece.id} piece={piece} />
        ))}
      </ul>
    </div>
  );
};


// export const Pieces = (props:PiecesProps) => {

//   const pieces = useAppState((state) => state.pieces);
//   const thumbnailRef = useRef<HTMLCanvasElement>(null);
  
//   return (
//     <ul style={ulStyle} className="rounded-lg bg-stone-200 min-h-24 flex flex-row">
//       { pieces.map((piece:Piece) => {
//         if (thumbnailRef.current) {
//           console.log('drawing', piece.name)
//           drawPieceThumbnail(piece, thumbnailRef.current);
//         };

//         return (
//           <li className="my-auto mx-2">
//             <canvas className="max-h-12" ref={thumbnailRef}></canvas>
//             {piece.name}
//           </li>)
//       })}
//     </ul>
//   )
// }

// const ulStyle = {
  
// }
