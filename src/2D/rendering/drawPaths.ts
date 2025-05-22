import { Vector2 } from "three";
import { state } from "../../State";
import { BezierPoint, Geometry2D, State } from "../../types";
import { getGeometryBoundingRect, getShapeBoundingRect } from "../geometry/boundingBox";
import { drawArrayOfPointIndices } from "./drawArrayOfPointIndices";
import { drawGrainOnShape } from "./drawGrainlines";
import { drawPolygonFromOffsetPointIndices, drawPolygonFromPointIndices } from "./drawPolygonFromPointIndices";
import { getBuffer } from "./getBuffer";
import { getPointArray } from "../geometry/getPointArrayFromGeometry2D";
import { setGrayFill } from "./utils/styleUtils";
import { usePiecesStore } from "../../UI/PiecesStore";


//— helpers —//

function isBezierPoint(pt: Vector2 | BezierPoint): pt is BezierPoint {
  return (pt as BezierPoint).to !== undefined;
}

function getCoord(id: string) {
  const pt = state.c_pointsMap.get(id);
  if (!pt) throw new Error(`Unknown point id "${id}"`);
  return isBezierPoint(pt) ? pt.to : pt;
}

/** stroke a polyline through the given point-IDs */
function drawArrayOfPointIds(
  ids: string[],
  ctx: CanvasRenderingContext2D
) {
  if (!ids.length) return;
  const first = getCoord(ids[0]);
  ctx.beginPath();
  ctx.moveTo(first.x, first.y);
  for (let i = 1; i < ids.length; i++) {
    const p = getCoord(ids[i]);
    ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();
}

/** stroke + fill the closed polygon through these IDs */
// function drawPolygonFromPointIds(
//   ids: string[],
//   ctx: CanvasRenderingContext2D
// ) {
//   if (ids.length < 2) return;
//   drawArrayOfPointIds(ids, ctx);
//   ctx.closePath();
//   ctx.fill();
//   ctx.stroke();
// }

export function drawPolygonFromPointIds(
  ids: string[],
  ctx: CanvasRenderingContext2D,
  dx:number=0,
  dy:number=0
) {
  if (ids.length < 2) return;

  // fetch the first point to see which flavor we need
  const first = state.c_pointsMap.get(ids[0]);
  if (!first) throw new Error(`Unknown point ID ${ids[0]}`);

  ctx.beginPath();

  if (isBezierPoint(first)) {
    // ─────── Bézier loop ───────
    ids.forEach((pid, i) => {
      const bp = state.c_pointsMap.get(pid) as BezierPoint;
      if (i === 0) {
        ctx.moveTo(bp.from.x + dx, bp.from.y + dy);
      } else {
        const prev = state.c_pointsMap.get(ids[i - 1]) as BezierPoint;
        ctx.bezierCurveTo(
          prev.c1.x + dx, prev.c1.y + dy,
          bp.c2.x + dx,   bp.c2.y + dy,
          bp.to.x + dx,   bp.to.y + dy
        );
      }
    });
  } else {
    // ─────── Straight‐line loop ───────
    const p0 = first as Vector2;
    ctx.moveTo(p0.x + dx, p0.y + dy);
    for (let i = 1; i < ids.length; i++) {
      const p = state.c_pointsMap.get(ids[i]) as Vector2;
      if (!p) throw new Error(`Unknown point ID ${ids[i]}`);
      ctx.lineTo(p.x + dx, p.y + dy);
    }
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

/** same as above but offset all points by (dx,dy) */
function drawPolygonFromOffsetPointIds(
  pointIds: string[],
  dx: number,
  dy: number,
  ctx: CanvasRenderingContext2D
) {
  if (pointIds.length < 2) return;
  drawPolygonFromPointIds(pointIds, ctx, dx, dy);
}

//— refactored drawing —//

/** draw both “paths” and “shapes” layers via the new maps */
export const drawPaths = (st: State) => {
  const { canvas, context: bufferCtx } = getBuffer("paths");
  // match main canvas size
  bufferCtx.canvas.width  = st.canvas.width;
  bufferCtx.canvas.height = st.canvas.height;

  // 1) draw all open paths
  for (const geom of st.c_geometryMap.values()) {
    if (geom.type === "path") {
      drawArrayOfPointIds(geom.pointIds, bufferCtx);
    }
  }

  // 2) draw all closed shapes (and their grainlines)
  // Get pieces for colored paper fills
  const pieces = Array.from(usePiecesStore.getState().pieces.values());

  for (const geom of st.c_geometryMap.values()) {
    if (geom.type === "shape" && !geom.hidden) {

      // outline + fill
      const color = pieces.filter((piece) => piece.geometryId == geom.id)[0]?.uiColor;
      console.log(pieces.filter((piece) => console.log(piece.geometryId, geom.id)))
      if (color) {
        bufferCtx.fillStyle = color;
      } else {
        setGrayFill(bufferCtx);
      }
      drawPolygonFromPointIds(geom.pointIds, bufferCtx);

      // grain overlay
      drawGrainOnShape(geom.id, bufferCtx);
    }
  }

  // 3) composite into main ctx
  st.context.drawImage(bufferCtx.canvas, 0, 0);
};

/** legacy helper—now just re-composites the paths buffer */
// export function applyPaths() {
//   const buf = state.c_buffers.get("paths");
//   if (buf) state.context.drawImage(buf.canvas, 0, 0);
// }

/** draw a single shape geometry (outline + fill) */
export function drawShape(
  geom: Geometry2D,
  ctx: CanvasRenderingContext2D
) {
  drawArrayOfPointIds(geom.pointIds, ctx);
  drawPolygonFromPointIds(geom.pointIds, ctx);
}

/** draw a shape—but normalized so its top‐left is at (0,0) */
export function drawShapeNormalized(
  geomId:string,
  ctx: OffscreenCanvasRenderingContext2D
) {
  const pointArray = getPointArray(geomId);
  if (pointArray) {
    const { x0, y0 } = getGeometryBoundingRect(  pointArray );
    ctx.fillStyle = '#000000'
    drawPolygonFromOffsetPointIds( state.c_geometryMap.get(geomId)!.pointIds, -x0, -y0 + 50, ctx);
  }
}

// // Draw paths AND shapes
// export const drawPaths = (state: State) => {
//   const { canvas, context } = getBuffer('paths');

//   canvas.width = state.canvas.width;
//   canvas.height = state.canvas.height;

//   const _ = context;

//   // Make sure this is not a copy op
//   const paths = state.c_paths;

//   paths.forEach((points, i) => {
//     // points is the array of point indices within state.c_points, i is the path index, not important
//     drawArrayOfPointIndices(points, context);
//   });

//   if (state.c_shapes.length > 0) {
//     // draw shapes
//     state.c_shapes.forEach((shapeArr, shapeIndex) => {
//       drawShape(shapeArr,context);
//       drawGrainOnShape(shapeIndex, context);
//     });
//   }

//   state.context.drawImage(canvas, 0, 0);
// };

// export function drawShape(shapeArr:number[], context:OffscreenCanvasRenderingContext2D) {
//   drawArrayOfPointIndices(shapeArr, context);
//   drawPolygonFromPointIndices(shapeArr, context);
// }
// export function drawShapeNormalized(shapeArr:number[], context:OffscreenCanvasRenderingContext2D|CanvasRenderingContext2D) {
//   const box = getShapeBoundingRect(shapeArr);
//   drawPolygonFromOffsetPointIndices(shapeArr, -box.x0, -box.y0, context);
// }

export function applyPaths() {
  const obj = state.c_buffers.get('paths');
  if (obj) state.context.drawImage(obj.canvas, 0, 0);
}

function drawGrainlines(shapeIndex: number, context: OffscreenCanvasRenderingContext2D) {
  throw new Error("Function not implemented.");
}

