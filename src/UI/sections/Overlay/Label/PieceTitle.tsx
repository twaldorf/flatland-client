import { CiEdit } from "react-icons/ci"
import { Piece } from "../../../../types"
import { Fragment, useState } from "react";
import { useAppState } from "../../../AppState";

export const PieceTitle = ({piece}) => {
  const [ editing, setEditing ] = useState(false);
  const setPieceTitle = (text:string) => {
    useAppState.getState().setActiveProjectTitle(text);
  }
  
  return (
    <Fragment>
        { editing ? 
          <input type="text" value={piece.name} className="text-lg w-24" onChange={ (e) => setPieceTitle(e.target.value) }></input> : 
          <p className="text-lg font-medium flex flex-row h-min" 
            onClick={ () => setEditing(true) } >
            {piece.name}<CiEdit className="text-2xl"></CiEdit>
          </p>
        }
    </Fragment>
  )
}