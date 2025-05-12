import React, { useState, useEffect } from 'react';
import { Piece } from '../../types';

interface LibraryPieceProps {
  piece: Piece;
  selected: boolean;
  onSelect: (id: string) => void;
}

export const LibraryPieceComponent: React.FC<LibraryPieceProps> = ({ piece, selected, onSelect }) => {
  const [thumbSrc, setThumbSrc] = useState<string>('');

  // Convert the canvas thumbnail to an image src
  useEffect(() => {
    if (piece.thumb) {
      try {
        setThumbSrc(piece.thumb.toDataURL());
      } catch {
        setThumbSrc('');
      }
    }
  }, [piece.thumb]);

  const handleClick = () => onSelect(piece.id);

  return (
    <div
      onClick={handleClick}
      className={`relative cursor-pointer border rounded-lg overflow-hidden p-2 transition-colors ${
        selected ? 'bg-blue-500' : 'bg-white'
      }`}
    >
      {thumbSrc && (
        <img
          src={thumbSrc}
          alt={piece.name}
          className="w-full h-auto object-cover rounded"
        />
      )}

      <div className="mt-2">
        <div className="font-semibold text-sm text-gray-900 truncate">
          {piece.name}
        </div>

        {piece.description && (
          <div className="text-xs text-gray-600 truncate mt-1">
            {piece.description}
          </div>
        )}

        <div className="text-xs text-gray-700 mt-1">
          Angle: {piece.angle !== undefined ? 'Set' : 'Unset'}
        </div>

        {piece.quantity !== undefined && (
          <div className="text-xs text-gray-700">
            Qty: {piece.quantity}
          </div>
        )}

        {piece.area !== undefined && (
          <div className="text-xs text-gray-700">
            Area: {piece.area.toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryPieceComponent;