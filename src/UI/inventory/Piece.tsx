import { useRef, useEffect, FormEventHandler, useState } from "react";
import { drawPieceThumbnail } from "../../2D/rendering/drawPieceThumbnail";
import { Piece } from "../../types";
import { CiEdit } from "react-icons/ci";
import { useAppState } from "../AppState";
import { usePiecesStore } from "../PiecesStore";


export const PieceComponent = ({ piece }: { piece: Piece }) => {
  const thumbnailRef = useRef<HTMLCanvasElement>(null);
  const [ editing, setEditing ] = useState(false);
  const setPieceName = usePiecesStore((state) => state.setPieceName);

  const onSave = (newName: string) => {
    setPieceName(piece.id, newName);
    setEditing(false);
  }

  useEffect(() => {
    if (thumbnailRef.current) {
      // drawPieceThumbnail(piece, thumbnailRef.current);
    }
  }, [ piece ]);

  function handleClick(): void {
    editing == true ? setEditing(false) : setEditing(true);

  }

  return (
    <li className="my-auto max-w-24">
      <canvas className="max-h-12 border border-stone-400" ref={thumbnailRef}></canvas>
      <div className="flex-row flex justify-center items-center">
        <span className="mr-1">{ piece.quantity ? `${piece.quantity}x` : ''} </span>
        <span>
        { editing && <EditPieceNameAttr piece={ piece } onSave={onSave} />}
        { !editing && piece.name}
        { !editing && <CiEdit onClick={handleClick} /> }
        </span>
      </div>
    </li>
  );
};

const EditPieceNameAttr = ({ piece, onSave }) => {
  const [newName, setNewName] = useState(piece.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSave(newName);
    }

    // this looks stupid in retrospect
    if (e.key === "Backspace" || e.key === "Delete") {
      setNewName(e.target.value.slice(0, -1));
    }
  };
  
  return (
    <input
      type="text"
      ref={inputRef}
      value={newName}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={() => onSave(newName)}
      className="w-full"
    />
  )
}