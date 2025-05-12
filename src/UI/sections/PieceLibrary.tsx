import { Piece } from "../../types";
import LibraryPieceComponent from "../library/Piece";
import { useAppState } from "../store";
import { Header } from "./Header";




export const PieceLibrary = () => {

  const pieces = useAppState((s) => s.pieces);
  
  return (
    <main className="app-container font-mono w-full h-screen overflow-hidden flex flex-col bg-stone-100 pb-2">
      <div>
          <h1>Piece Library</h1>
      </div>

      <div className="grid grid-cols-4 flex-1 overflow-hidden">

      {pieces.map((piece:Piece) => {
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