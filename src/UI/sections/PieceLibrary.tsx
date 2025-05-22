import { Piece } from "../../types";
import LibraryPieceComponent from "../library/LibraryPieceComponent";
import { useAppState } from "../AppState";
import { Header } from "./Header";
import { usePiecesStore } from "../PiecesStore";
import { useState } from "react";
import { storage } from "../../utils/storage";
import { useMarkerStore } from "./MarkerStore";




export const PieceLibrary = () => {

  const storedPieces = storage.loadPiecesFromLibrary();
  const pieces = usePiecesStore((s) => s.pieces);
  const addPieceToMarker = useMarkerStore((s) => s.addPieceToMarker);

  const onSelected = (pieceId:string) => {
    addPieceToMarker(pieceId);
  }
  
  return (
    <main className="app-container font-mono w-full p-4 h-screen overflow-hidden flex flex-col bg-stone-100 pb-2">

        <h3>Current project pieces</h3>
      <div className="grid grid-cols-8 flex-1 overflow-hidden">
        {pieces.size > 0 && Array.from(pieces.values()).map((piece:Piece) => {
          return <LibraryPieceComponent
            piece={piece} 
            selected={false} 
            onSelect={() => onSelected(piece.id)}
          />
          })}

      </div>

      {/* <div className="grid grid-cols-8 flex-1 overflow-hidden"> 
        <h3>All pieces</h3>
        {storedPieces && storedPieces.size > 0 && Array.from(storedPieces.values()).map((piece:Piece) => {
          return <LibraryPieceComponent
            piece={piece} 
            selected={false} 
            onSelect={() => onSelected(piece.id)} 
          />
          })}
      </div> */}

    </main>
  );
}