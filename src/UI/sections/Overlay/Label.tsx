import { CiCircleChevDown, CiCircleChevUp, CiCircleRemove, CiCompass1, CiEdit, CiPen } from "react-icons/ci";
import { useAppState } from "../../AppState";
import { ChangeToolCommand } from "../../../2D/commands/ChangeToolCommand";
import { pushCommand } from "../../../Command";
import { useEffect, useRef } from "react";
import "./overlay.css";
import { CirclePicker, Color } from 'react-color';
import { DEFAULT_SEAM_ALLOWANCE } from "../../../constants";
import { NumericAdjuster } from "../../modulators/NumericAdjuster";
import { PieceTitle } from "./Label/PieceTitle";
import { usePiecesStore } from "../../PiecesStore";
import { BezierPoint, Piece } from "../../../types";
import { state } from "../../../State";
import { computeCentroid } from "../../../2D/geometry/centroid";
import { Vector2 } from "three";
import { drawCanvasFromState } from "../../../2D/rendering/canvas";

interface LabelProps {
  pieceId:string;
}

// Individual piece properties detail view
const Label = ( { pieceId }:LabelProps ) => {
  const clearLabel = useAppState((state) => state.clearLabel);
  const expanded = useAppState((state) => state.expandedLabel);
  const expandLabel = useAppState((state) => state.expandLabel);
  const minimizeLabel = useAppState((state) => state.minimizeLabel);
  
  const piece = usePiecesStore(s => s.pieces).get(pieceId);

  const setPieceSeamAllowance = (value:number) => {
    if (piece) {
      piece.seamAllowance = value;
      usePiecesStore.setState((prev) => ({
        pieces: new Map(prev.pieces).set(pieceId, piece)
      }))
    }
  }
  
  const grainlineRef = useRef(null);
  const labelRef = useRef(null);

  let point = new Vector2(0,0)// computeCentroid(state.c_geometryMap.get(piece.geometryId).pointIds).sub(new Vector2(500, 0)); // Todo make this change
  
  if (!piece) {
    return null;
  }

  const pickColor = (color) => {
    usePiecesStore.getState().updatePieceField(piece.id, "uiColor", color.hex);
    drawCanvasFromState(state);
  }
  
  const handleGrainlineClick = () => {
    pushCommand(new ChangeToolCommand('grainline'));
  }

  const handleSeamAllowanceClick = () => {
    pushCommand(new ChangeToolCommand('seam allowance'));
  }

  return (
    <div
      className="absolute top-47 w-128 gap-2 bg-gray-800 text-white px-3 py-2 rounded-md shadow-md"
      ref={labelRef}
      style={{
        // left: `${Math.max(12, point.x / 2)}px`,
        // top: `${Math.max(0, point.y / 2)}px`,
        // transform: "translate(0, -70%)", // Centers above the point
      }}
    >
      <div className="flex flex-row content-start items-center justify-between text-sm gap-2">

        <div className="flex gap-2 items-center">

          <PieceTitle piece={piece} />

        </div>
          <h4 className="h-min mx-2">Cut <span className="bubbled">x <NumericAdjuster dir={"ltr"} value={piece.quantity ? piece.quantity : 1} step={1} width={2}/></span></h4>
        

        <ul className="actionButtons">
          {// TODO: implement commands for all of these
          }
          <button>Stash</button>
          <button>Clone</button>
          <button>Copy</button>
          <button>Trash</button>
        </ul>

        <button
          className="text-2xl hover:text-red-300"
          onClick={clearLabel}
          >
          <CiCircleRemove />
        </button>

      </div>

      { expanded && 
      <div className="grid grid-cols-5 mt-4 expanded gap-2">

        <div className="properties col-span-2">
          <label htmlFor="properties">Properties</label>
          <ul id="properties" className="">

            <li>
              <span className="bubbled">
                <NumericAdjuster 
                  value={ piece.seamAllowance ? piece.seamAllowance : DEFAULT_SEAM_ALLOWANCE } 
                  step={ .05 }
                  onChange={ (value:number) => setPieceSeamAllowance(value) }/>
                "</span> seam allowance
            </li>

            <li>
              <span className="bubbled">
              <NumericAdjuster 
                value={piece.interfaced ? piece.interfaced : 0} 
                step={1}/>
              x</span> interfaced
            </li>

            <li>{ piece.angle ? piece.angle : 0}&#176; grainline angle</li>
          </ul>
        </div>


        <div className="col-span-2">
          <label htmlFor="tools">Tools</label>
          <ul id="tools">
            <button ref={grainlineRef}
              className="flex flex-row items-center text-sm"
              onClick={handleGrainlineClick}
              >
              <CiCompass1 strokeWidth=".5" className="m-2 ml-0 border border-white focus:border-blue-500 focus:border rounded-sm"/>
              Draw Grainline
            </button>

            <button
              className="flex flex-row items-center text-sm"
              onClick={handleSeamAllowanceClick}
              >
              <CiPen strokeWidth=".5" className="m-2 ml-0 border border-white focus:border-blue-500 focus:border rounded-sm"/>
              Override Seam Allowance
            </button>

          </ul>
        </div>

        <div className="col-span-1">
          <label htmlFor="uiprefs">Paper color</label>
          <ul id="uiprefs">
            <li>
              <CirclePicker 
                colors={[
                  "#fe6d73", "#fef9ef", "#ffcb77", "#17c3b2"
                ]} 
                width={"86px"}
                onChangeComplete={pickColor}
                />
            </li>
          </ul>
        </div>
      </div> 
      }

      { expanded ? 
        <CiCircleChevUp 
          className="m-auto blister-button" 
          onClick={minimizeLabel}/> : 
        <CiCircleChevDown 
          className="m-auto blister-button" 
          onClick={expandLabel} /> } 

    </div>
  );
};

export default Label;
