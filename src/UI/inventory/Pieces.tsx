import { AnchorHTMLAttributes, MouseEventHandler, useRef } from "react";
import { drawPieceThumbnail } from "../../2D/rendering/drawPieceThumbnail";
import { Piece } from "../../types";
import { PieceComponent } from "./Piece";
import { useAppState } from "../AppState";
import { useViewState } from "../ViewState";

interface PiecesProps {

}

export const Pieces = () => {
  const pieces = useAppState((state) => state.pieces);
  const setView = useViewState((state) => state.setView);
  function handleNav(e:unknown): void {
    e.preventDefault();
    setView('piece library');
  }

  return (
    <div className="rounded-lg bg-stone-200 min-h-24 bg-white p-2">
      <h4>Pieces ({pieces.length})</h4>
      <h4><a href="/piecelibrary" onClick={handleNav}>Piece Library</a></h4>
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
