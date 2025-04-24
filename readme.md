# Flatland
Flatland is a web-based 2D/3D CAD drafting and batch production planning tool for soft goods, garments, and industrial sewing workflows. The goal is to empower home sewists, designers, and small-scale manufacturers with tools previously available only in expensive or proprietary systems before moving up market.

## Featureful pieces

The first pieces of the application emerge with some mapping to product prototype goals:

- A constraint-based 2D drafting environment, built on web technologies

- Parametric modeling of garments and gear with undoable commands

- Lightweight WebGL visualization for 3D preview and simulation

Planned and described features are detailed in the product documentation.

## Tools

- React + Zustand: 2D UI

- Canvas + WebGL (Three.js): Rasterized drawing and simulation workspace

- Parcel: Building and asset management

## State

Currently, the project uses two state stores:

- A Zustand store for browser-rendererd UI state

- Singleton state object for rasterized and canvas state (tools, geometry, selections, etc.)

All canvas state changes use a Command pattern to operate. All commands are placed in a queue and processed in the order in which they are received by the global event loop, allowing robust undo/redo functionality and general tractability. In the future, communication between these (and all separate parts of the application) will be replaced by a global message broadcast and brokers.

## Geometry

Flatland uses flat array representation of points and paths. Triangle geometries are created and triangulated ad-hoc from the point/path data for use in the 3D view.

In the future, OpenCascade.js may replace the internal representation as a complete geometry kernel to save work.

## Physics

Currently, a basic Position-Based Dynamics (PBD) solver is in place for a simple softbody effect with triangulated polygonal shells

Much of the work of simulation is generating feasible constraints from polygonal and implicit geometries and allowing users to plan and "sew" seams together to create constraints programmatically

## Rendering

Canvas-based rendering is sufficient for now but will be refactored for performance when needed. Buffers are responsible for repainting themselves on relevant state changes. Much overpainting is done due to insufficient and shifting drawing logic. Some of this will be solved by a message system and some will be solved by switching to a rendering dependency tree structure.

WebGL (via Three.js) is used until performance constraints necessitate a custom WebGPU renderer

## Progress

Aside from the looming introduction of the global message system, architecture is stabilizing:

- Core canvas tools are usable

- The command system is solid and extensible

- The Tool system is extensible

- Basic editing and rendering logic is functional

- Save/load with localStorage works

