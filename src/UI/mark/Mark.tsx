import { useState } from "react";
import { PieceComponent } from "../inventory/Piece";
import { useAppState } from "../AppState";
import { usePiecesStore } from "../PiecesStore";

const Mark: React.FC = () => {
  const pieces = usePiecesStore((s) => s.pieces);

  const [fabricWidth, setFabricWidth] = useState<number>(0);
  const [fabricHeight, setFabricHeight] = useState<number>(0);
  const [layoutLength, setLayoutLength] = useState<number>(0);
  const [safetyMargin, setSafetyMargin] = useState<number>(0);

  return (
    <div className="p-4 flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4">Layout Fabric & Pieces</h2>

      {/* Pieces grid */}
        <div className="flex-1 h-1/2">
          <div className="grid grid-cols-8 gap-4">
            {Array.from(pieces.values()).map((piece) => (
              <PieceComponent
                key={piece.id}
                piece={piece}
                selected={false} // selection can be added later
                onSelect={() => { /* no-op for layout */ }}
              />
            ))}
          </div>
        </div>

      {/* Fabric dimensions form */}
      <div className="mb-6 flex space-x-4 flex-col gap-8 h-1/2">
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
        <label className="flex flex-col">
          <span className="text-sm font-medium">Layout Length (in)</span>
          <h6>the length </h6>
          <input
            type="number"
            value={layoutLength}
            onChange={(e) => setLayoutLength(Number(e.target.value))}
            className="mt-1 p-2 border rounded w-32"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-sm font-medium">Safety margin (in)</span>
          <h6 className="text-xs">in addition to piece seam allowances</h6>
          <input
            type="number"
            value={safetyMargin}
            onChange={(e) => setSafetyMargin(Number(e.target.value))}
            className="mt-1 p-2 border rounded w-32"
          />
        </label>
      </div>

    </div>
  );
};

export default Mark;