import { useState } from "react";
import { PieceComponent } from "../inventory/Piece";
import { useAppState } from "../store";

const Mark: React.FC = () => {
  const pieces = useAppState((s) => s.pieces);
  const [fabricWidth, setFabricWidth] = useState<number>(0);
  const [fabricHeight, setFabricHeight] = useState<number>(0);

  return (
    <div className="p-4 flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4">Layout Fabric & Pieces</h2>

      {/* Fabric dimensions form */}
      <div className="mb-6 flex space-x-4">
        <label className="flex flex-col">
          <span className="text-sm font-medium">Fabric Width (in)</span>
          <input
            type="number"
            value={fabricWidth}
            onChange={(e) => setFabricWidth(Number(e.target.value))}
            className="mt-1 p-2 border rounded w-32"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-sm font-medium">Fabric Height (in)</span>
          <input
            type="number"
            value={fabricHeight}
            onChange={(e) => setFabricHeight(Number(e.target.value))}
            className="mt-1 p-2 border rounded w-32"
          />
        </label>
      </div>

      {/* Pieces grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-4 gap-4">
          {pieces.map((piece) => (
            <PieceComponent
              key={piece.id}
              piece={piece}
              selected={false} // selection can be added later
              onSelect={() => { /* no-op for layout */ }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mark;