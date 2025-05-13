import { Vector, Vector2 } from "three";
import { pushCommand } from "../../Command";
import { state } from "../../State";
import { BezierPoint, Geometry2D, Piece, ToolBase, ToolName } from "../../types";
import { cLocalizePoint } from "../pointer/cLocalizePoint";
import { SelectToolShapeCommand } from "../commands/SelectToolShapeCommand";
import { isPointInPolygon } from "../geometry/isPointInPolygon";
import { SelectToolMoveShapeCommand } from "../commands/SelectToolMoveShapeCommand"
import { checkPointOverlap } from "./common";
import { SelectToolPointCommand } from "../commands/SelectToolPointCommand";
import { SelectToolDeselectAllCommand } from "../commands/SelectToolDeselectAllCommand";
import { drawCanvasFromState, point, redrawCanvas } from "../rendering/canvas";
import { drawShapeSelectionMovePreview } from "../rendering/drawSelectionMovePreview";

import { KeyboardEvent } from "react";
import { DeleteGeometriesCommand, DeleteShapeCommand } from "../commands/DeleteGeometriesCommand";
import { checkLineIntersection, LineHit } from "../geometry/lineIntersection";
import { SelectToolSelectLineCommand } from "../commands/SelectToolSelectLineCommand";
import { SelectToolAddShapeCommand } from "../commands/SelectToolAddShapeCommand";
import { SelectToolDeselectLinesCommand } from "../commands/SelectToolDeselectLinesCommand";
import { DrawPreviewsCommand } from "../commands/Rendering/DrawPreviewsCommand";
import { findNearestAnyPoint, findNearestGeometryPoint } from "../geometry/findNearestPoint";
import { isPointNearBezierGeometry } from "../geometry/bezierIntersection";
import { rad } from "../settings/interface";
import { SelectToolDeselectPointCommand } from "../commands/SelectToolDeselectPointCommand";
import { SelectToolMovePointsCommand } from "../commands/SelectToolMovePointsCommand";
import { ChangeToolCommand } from "../commands/ChangeToolCommand";

export type SelectToolState = 
  | { type: "idle" }
  | { type: "hovering"; hoveredIndex: number }
  | { type: "moving shapes"; startPos: Vector2 }
  | { type: "moving points"; startPos: Vector2 }
  | { type: "mousedown"; mousePosition: Vector2 }
  | { type: "focus on point", pointId: string }
  | { type: "selecting shapes"; }
  | { type: "selecting points"; }
  | { type: "selecting lines"; }
  | { type: "editing piece"; editingGeometryId: string; piece: Piece }

export class SelectTool implements ToolBase {
  // Tool state object stores tool mechanical state
  private __state:SelectToolState = { type: "idle" };

  // Tool name
  readonly name:ToolName = 'select';

  constructor() {
  }

  private __listeners = {
    down: this.onMouseDown.bind(this),
    move: this.onMouseMove.bind(this),
    up: this.onMouseUp.bind(this),
    dblclick: this.onDoubleClick.bind(this),
  }

  public initializeEvents() {
    const canvas = state.canvas;
    canvas.addEventListener("mousedown", this.__listeners.down);
    canvas.addEventListener("mousemove", this.__listeners.move);
    canvas.addEventListener("mouseup", this.__listeners.up);
    canvas.addEventListener("dblclick", this.__listeners.dblclick);
  }

  public applyState = (state: ToolBase["state"]) => {
    // Not implemented
  };

  public dismountEvents() {
    state.canvas.removeEventListener('mousedown', this.__listeners.down);
    state.canvas.removeEventListener("mousemove", this.__listeners.move);
    state.canvas.removeEventListener("mouseup", this.__listeners.up);
    state.canvas.removeEventListener("dblclick", this.__listeners.dblclick);
  }

  // Tool state updater
  private transition(newState: SelectToolState) {
    console.log(`SelectTool state: ${this.__state.type} → ${newState.type}`);
    this.__state = newState;
  }

  // Select tool event management
  private onMouseDown(e: MouseEvent) {
    const clickPos = cLocalizePoint(e.clientX, e.clientY);
    const selectedGeomId = this.checkForShapeOverlap(clickPos);
    let pointId = findNearestGeometryPoint(clickPos, Array.from(state.c_geometryMap.values()));
    let lineHit = null;
    if (selectedGeomId) {
      lineHit = isPointNearBezierGeometry(clickPos, state.c_geometryMap.get(selectedGeomId) as Geometry2D, rad * 2)
    }
    state.pointerDown = true;

    if (selectedGeomId || (pointId) || lineHit != null) {
      // Case: you hit something, anything at all of interest within the canvas
      switch (this.__state.type) {
        case "idle":
          if ( pointId ) {
            pushCommand( new SelectToolPointCommand( pointId ) );
            this.transition({
              type: "selecting points",
            });
            // TODO: describe line selection features, possibly you could select to measure a larger and larger segment?
          // } else if ( lineHit ) {
          //   pushCommand( new SelectToolSelectLineCommand( lineHit ) );
          //   this.transition({
          //     type: "selecting lines",
          //   }); 
          } else if ( selectedGeomId ) {
            pushCommand( new SelectToolShapeCommand( selectedGeomId ) );
            this.transition({
              type: "selecting shapes",
            });
          }
          break;
        
        case "selecting shapes":
          if (state.shiftDown) {
            if ( selectedGeomId ) {
              // Previously this called SelectToolAddShape command
              // I do not know why as they seem functionally the same???
              pushCommand( new SelectToolShapeCommand( selectedGeomId ) );
            }
          } 
          else {
            if ( selectedGeomId ) {
              pushCommand( new SelectToolShapeCommand( selectedGeomId ) );
            }
          }
          break;
        
        case "selecting points":
          if ( pointId ) {
            if (state.shiftDown ) {
              // if the point is not already selected
              if (!this.pointIsSelected(pointId)) {
                pushCommand( new SelectToolPointCommand( pointId ) );
              } else {
                // Deslect the point
                pushCommand( new SelectToolDeselectPointCommand( pointId ) );
              }
            } else if ( !state.shiftDown ) {
              if (this.pointIsSelected(pointId)) {
                // do nothing
              } else {
                pushCommand( new SelectToolDeselectAllCommand() );
                pushCommand( new SelectToolPointCommand( pointId ) );
              }
            }
          } else {
            this.transition({
              type: "idle"
            });
          }
          break;


        case "selecting lines":
          // Hit Point
          if ( pointId ) {
            pushCommand( new SelectToolPointCommand( pointId ) );
            this.transition({
              type: "selecting points",
            });

          // Hit Shape
          } else if ( selectedGeomId ) {
            pushCommand( new SelectToolShapeCommand( selectedGeomId ) );
            this.transition({
              type: "selecting shapes",
            });
          }
          break;
      }
    // No hits, deselect all
    } else {
      pushCommand( new SelectToolDeselectAllCommand() );
      this.transition({
        type: "idle"
      });
    }
    drawCanvasFromState(state);
  }

  public checkForShapeOverlap(pos:Vector2):string | null {
    let foundId = null;

    state.c_geometryMap.forEach((geom: Geometry2D, id:string) => {

      const shapePoints = geom.pointIds.map((pointId:string) => {
        const point = state.c_pointsMap.get(pointId) as BezierPoint;
        return point.to;
      });

      if (isPointInPolygon(pos, shapePoints)) {
        foundId = id;
      };

    });

    return foundId;
  }

  private onMouseMove(e: MouseEvent) {
    const pos = cLocalizePoint(e.clientX, e.clientY);
    switch (this.__state.type) {

      case 'moving shapes':
        pushCommand(new DrawPreviewsCommand(pos));
        break;
        
      case 'selecting shapes':
        if (state.pointerDown == true) {
          state.c_move_from = pos;
          pushCommand(new DrawPreviewsCommand(pos));

          this.transition({
            type: 'moving shapes',
            startPos: cLocalizePoint(e.clientX, e.clientY)
          });
        };
        break;

      case 'selecting points':
        if (state.pointerDown == true) {
          state.c_move_from = pos;
          pushCommand(new DrawPreviewsCommand(pos));

          this.transition({
            type: 'moving points',
            startPos: cLocalizePoint(e.clientX, e.clientY)
          });
        };
        break;

      default:
        break;
    }
  }

  private onMouseUp(e: MouseEvent) {
    state.pointerDown = false;

    const endPos = cLocalizePoint(e.clientX, e.clientY);
    let startPos = undefined;

    switch (this.__state.type) {
      case "moving shapes":
        startPos = this.__state.startPos;
        pushCommand( new SelectToolMoveShapeCommand( state.c_selectedGeometries, startPos, endPos ));
        this.transition({
          type: 'selecting shapes'
        });
        break;

      case "moving points":
        startPos = this.__state.startPos;
        pushCommand( new SelectToolMovePointsCommand( state.c_selectedPoints, startPos, endPos ));
        this.transition({
          type: 'selecting points'
        });
        break;

    }
  }

  private onDoubleClick(e: MouseEvent) {
    const pos = cLocalizePoint(e.clientX, e.clientY);
    const pointId = findNearestGeometryPoint(pos, Array.from(state.c_geometryMap.values()));
    if (pointId) {
      pushCommand(new ChangeToolCommand('bezier point editor'));
    }
  }

  public pointIsSelected(pointId:string) {
    return state.c_selectedPoints.find((pid:string) => pid == pointId);
  }

  public onKeyDown(e: KeyboardEvent<Element>) {
    console.log(state.c_selectedGeometries)
    switch (this.state.type) {
      case "selecting shapes":
        if (e.code === 'Backspace' || e.code === 'Delete') {
          if (state.c_selectedGeometries.length > 0) {
            pushCommand(new DeleteGeometriesCommand(state.c_selectedGeometries));
          }
        }
        this.transition({type: "idle"});
        break;

    }

  }

  public deselect() {
    console.error('Not implemented for the Select tool');
  }

  public get state():SelectToolState {
    return this.__state;
  }
}
