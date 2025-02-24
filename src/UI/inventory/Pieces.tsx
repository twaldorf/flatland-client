import { Piece, useAppState } from "../store";

interface PiecesProps {

}


export const Pieces = (props:PiecesProps) => {

  const pieces = useAppState((state) => state.pieces);

  return (
    <div>
      { pieces.map((piece:Piece) => {
          return <li>{piece.name}</li>
      })}
    </div>
  )
}