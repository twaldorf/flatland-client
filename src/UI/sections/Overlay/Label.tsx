import { CiCircleChevDown, CiCircleChevUp, CiCircleRemove, CiCompass1, CiEdit, CiPen } from "react-icons/ci";
import { useAppState } from "../../AppState";
import { ChangeToolCommand } from "../../../2D/commands/ChangeToolCommand";
import { pushCommand } from "../../../Command";
import { useRef } from "react";
import "./overlay.css";
import { CirclePicker } from 'react-color';
import { DEFAULT_SEAM_ALLOWANCE } from "../../../constants";
import { NumericAdjuster } from "../../modulators/NumericAdjuster";
import { PieceTitle } from "./Label/PieceTitle";


// Individual piece properties detail view
const Label = () => {
  const label = useAppState((state) => state.label);
  const clearLabel = useAppState((state) => state.clearLabel);
  const expanded = useAppState((state) => state.expandedLabel);
  const expandLabel = useAppState((state) => state.expandLabel);
  const minimizeLabel = useAppState((state) => state.minimizeLabel);

  const grainlineRef = useRef(null);
  const labelRef = useRef(null);

  const handleGrainlineClick = () => {
    pushCommand(new ChangeToolCommand('grainline'));
  }

  const handleSeamAllowanceClick = () => {
    pushCommand(new ChangeToolCommand('seam allowance'));
  }

  if (!label) return null; // Don't render if there's no label

  const { point, piece } = label;

  return (
    <div
      className="absolute gap-2 bg-gray-800 text-white px-3 py-2 rounded-xl shadow-md"
      ref={labelRef}
      style={{
        left: `${Math.max(12, point.x / 2)}px`,
        top: `${Math.max(0, point.y / 2)}px`,
        transform: "translate(0, -70%)", // Centers above the point
      }}
    >
      <div className="flex flex-row content-start items-center justify-between text-sm gap-2">

        <div className="flex gap-2 items-center">

          <PieceTitle piece={piece} />

        </div>
          <h4 className="h-min mx-2">Cut <span className="bubbled">x <NumericAdjuster dir={"ltr"} default={piece.quantity ? piece.quantity : 1} step={1} width={2}/></span></h4>
        

        <ul className="actionButtons">
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
                  default={ piece.seamAllowance ? piece.seamAllowance : DEFAULT_SEAM_ALLOWANCE } 
                  step={.05}/>
                "</span> seam allowance
            </li>

            <li>
              <span className="bubbled">
              <NumericAdjuster 
                default={piece.interfaced ? piece.interfaced : 0} 
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
              <CirclePicker colors={[
                "#fe6d73", "#fef9ef", "#ffcb77", "#17c3b2"
              ]} width={"86px"}/>
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
