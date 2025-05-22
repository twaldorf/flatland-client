import { AnchorHTMLAttributes, MouseEventHandler, useRef } from "react";
import { drawPieceThumbnail } from "../../2D/rendering/drawPieceThumbnail";
import { Piece } from "../../types";
import { PieceComponent } from "./Piece";
import { useAppState } from "../AppState";
import { useViewState } from "../ViewState";
import { usePiecesStore } from "../PiecesStore";

// Pieces Tray fo ruse in editor
export const Pieces = () => {
  const pieces = usePiecesStore((state) => state.pieces);
  const setView = useViewState((state) => state.setView);
  
  function handleNav(e:unknown): void {
    e.preventDefault();
    setView('piece library');
  }

  return (
    <div className="rounded-lg bg-stone-200 min-h-24 bg-white p-2">
      <h4>Pieces Tray ({pieces.size})</h4>
      <ul className="grid grid-cols-2 text-xs relative gap-2 flex-wrap">
        {Array.from(pieces.values()).map((piece) => (
          <PieceComponent key={piece.id} piece={piece} />
        ))}
      </ul>
      <h4><a href="/piecelibrary" onClick={handleNav}>Go to pieces library</a></h4>
    </div>
  );
};
