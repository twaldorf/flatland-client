import { CiEdit } from "react-icons/ci"
import { Piece } from "../../../../types"
import { Fragment, useState } from "react";
import { useAppState } from "../../../AppState";
import { usePiecesStore } from "../../../PiecesStore";

export const PieceTitle = ({piece}) => {
  const [ editing, setEditing ] = useState(false);
  const [ name, setName ] = useState(piece.name);
  const setPieceName = usePiecesStore(s => s.setPieceName);

  const setPieceTitle = (text:string) => {
    setPieceName(piece.id, text);
  }

  const handleInput = (text:string) => {
    setName(text);
  }
  
  const save = () => {
    setEditing(false);
    setPieceTitle(name);
  }
  
  return (
    <Fragment>
        { editing ? 
          <input 
            type="text" 
            value={ name } 
            className="text-lg w-24" 
            onChange={ (e) => handleInput(e.target.value) }
            onBlur={ save }
            ></input> : 
          <p className="text-lg font-medium flex flex-row h-min" 
            onClick={ () => setEditing(true) } >
            {piece.name}<CiEdit className="text-2xl"></CiEdit>
          </p>
        }
    </Fragment>
  )
}