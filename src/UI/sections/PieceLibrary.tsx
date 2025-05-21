import { Piece } from "../../types";
import LibraryPieceComponent from "../library/LibraryPieceComponent";
import { useAppState } from "../AppState";
import { Header } from "./Header";
import { usePiecesStore } from "../PiecesStore";




export const PieceLibrary = () => {

  const pieces = usePiecesStore((s) => s.pieces);
  
  return (
    <main className="app-container font-mono w-full h-screen overflow-hidden flex flex-col bg-stone-100 pb-2">
      <div>
          <h1>Piece Library</h1>
      </div>

      <div className="grid grid-cols-4 flex-1 overflow-hidden">

      {pieces.size > 0 && Array.from(pieces.values()).map((piece:Piece) => {
        return <LibraryPieceComponent
          piece={piece} 
          selected={false} 
          onSelect={undefined} 
        />
        })}

      </div>
    </main>
  );
}