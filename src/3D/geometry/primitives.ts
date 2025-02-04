import * as THREE from "three";
import { material_default, material_selected } from "../../Materials";

export const createRectangularPrism = (origin:THREE.Vector3, width=1, height=1, depth=1) => {
  const geometry = new THREE.BufferGeometry();

  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const halfDepth = depth / 2;
  
  const vertices = new Float32Array([
        // Front face
        -halfWidth, -halfHeight,  halfDepth, // 0: Bottom Left Front
         halfWidth, -halfHeight,  halfDepth, // 1: Bottom Right Front
         halfWidth,  halfHeight,  halfDepth, // 2: Top Right Front
        -halfWidth,  halfHeight,  halfDepth, // 3: Top Left Front

        // Back face
        -halfWidth, -halfHeight, -halfDepth, // 4: Bottom Left Back
         halfWidth, -halfHeight, -halfDepth, // 5: Bottom Right Back
         halfWidth,  halfHeight, -halfDepth, // 6: Top Right Back
        -halfWidth,  halfHeight, -halfDepth  // 7: Top Left Back
    ]);

    // Define the indices for each face (two triangles per face)
    const indices: number[] = [
        // Front face
        0, 1, 2,
        0, 2, 3,

        // Back face
        5, 4, 7,
        5, 7, 6,

        // Top face
        3, 2, 6,
        3, 6, 7,

        // Bottom face
        4, 5, 1,
        4, 1, 0,

        // Right face
        1, 5, 6,
        1, 6, 2,

        // Left face
        4, 0, 3,
        4, 3, 7
    ];

    // Assign the vertices and indices to the geometry
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(indices);

    // Compute normals for lighting
    geometry.computeVertexNormals();

    // Define UV coordinates for texturing
    const uvs = new Float32Array([
        // Front face
        0, 0,
        1, 0,
        1, 1,
        0, 1,

        // Back face
        1, 0,
        0, 0,
        0, 1,
        1, 1,

        // Top face
        0, 1,
        1, 1,
        1, 0,
        0, 0,

        // Bottom face
        1, 1,
        0, 1,
        0, 0,
        1, 0,

        // Right face
        1, 0,
        0, 0,
        0, 1,
        1, 1,

        // Left face
        0, 0,
        1, 0,
        1, 1,
        0, 1
    ]);
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

    // Group the indices into quads (each group contains 6 indices: two triangles)
    geometry.clearGroups(); // Clear any existing groups

    const faceCount = 6; // Front, Back, Top, Bottom, Right, Left
    for (let i = 0; i < faceCount; i++) {
        geometry.addGroup(i * 6, 6, 0); // (start, count, materialIndex)
    }

    const materials = [
      material_default,
      material_selected
    ]

    const mesh = new THREE.Mesh(geometry, materials);
    const line = new THREE.Line(geometry, materials);

    return { mesh, line };
}