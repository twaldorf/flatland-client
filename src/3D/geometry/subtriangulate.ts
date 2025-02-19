// TODO: unfinished implementation of custom triangle subdivision

export function subdivide( indices:Uint16Array, arr:Float32Array ) {
  // 2 * triangleCount + 1 = number of new vertices needed for one subdivision
  // 3 = length of vertices
  const newArray = new Float32Array( 3 * 2 * ( indices.length / 3 ) + 1 + arr.length * 3 );
  
  // copy the old array into the new one
  for (let i = 0; i < arr.length; ++i) {
    newArray[i] = arr[i];
  }

  // update triangle array, the new array has three times as many triangles as the old
  // each triangle is three indices
  // The index references a Point element, not an Array element.
  const newTris = new Uint16Array(3 * indices.length);
  
  // Indices is triangle indices
  // aar is floats for xyz, hence stride 3
  let ti = 0; // triangle index, synthetic from tri elements, stride 3
  let pi = 0; // even point coord index, real
  let ni = 0; // new point coord index, real
  let newPointCount = 0;
  let newTriCount = 0;
  let newEdgeCount = 0;
  const evenPointCount = arr.length / 3;
  const evenTriCount = indices.length / 3;
  

  // Element-wise indices, stride 3
  let evenPointIndex = 0;
  let evenTriIndex = 0;

  let newPointIndex = 0;
  let newTriIndex = 0;

  // Coordinatewise point copy for Even points
  function copyEvenPointFromTo(oldIndex:number, newIndex:number) {
    newArray[3 * newIndex] = arr[3 * oldIndex];
    newArray[3 * newIndex + 1] = arr[3 * oldIndex + 1];
    newArray[3 * newIndex + 2] = arr[3 * oldIndex + 2];
  }

  // From coordinate index, interp an odd point, add it to the list of points
  function makeOddPointFromEdge(edgeStartCoordinateIndex: number, edgeEndCoordinateIndex: number, toIndex: number) {
    let p1 = edgeStartCoordinateIndex;
    let p2 = edgeEndCoordinateIndex;

    const newPointX = ( arr[p1 * 3] + arr[p2 * 3] ) / 2; // halfway between x1 and x2
    const newPointY = ( arr[p1 * 3 + 1] + arr[p2 * 3 + 1] ) / 2; // etc
    const newPointZ = ( arr[p1 * 3 + 2] + arr[p2 * 3 + 2] ) / 2;

    // Add vertex to array
    newArray[toIndex * 3] = newPointX;
    newArray[toIndex * 3 + 1] = newPointY;
    newArray[toIndex * 3 + 2] = newPointZ;
  }

    // Let triangle assembly dictate vertex placement
    // Move through even triangles, assembling the four new subtriangles and populating arrays progressively

    for (let i = 0; i < 3; ++i) {
      // next suppose i = 1, evenPointIndex = newTriIndex = 3; newPointIndex = 3;
      // Add the first point to the triangle
      copyEvenPointFromTo(0 + evenPointIndex, 0 + newPointIndex);
      newTris[0 + newTriIndex] = 0 + evenPointIndex;

      // Add the second point (odd) to the triangle, between the last even point and the next even point
      makeOddPointFromEdge(
        indices[0 + evenTriIndex],
        indices[1 + evenTriIndex],
        1 + newPointIndex);

      newTris[1 + newTriIndex] = 1 + newPointIndex;

      // Add the third (odd) point to the triangle, between 0 and 2 in the even tri
      makeOddPointFromEdge(
        0 + evenPointIndex, 
        2 + newPointIndex, 
        2);

      newTris[2 + newTriIndex] = 2 + newPointIndex;

      newPointIndex += 3;
      newTriIndex += 3;
      evenPointIndex = 0;
      evenTriIndex += 1;
    }

    // special interior triangle
    //

    
    // Even tri index only updated once every four triangles
    // evenTriIndex++;
}

// export function subtriangulatePlanar(indices:Uint16Array, arr:Float32Array) {

//   const tri = findLargestTri();
//   const new_point = center(tri);
//   const new_triangles = getNewTriangles();
//   deleteTriFromArray(tri);
//   appendTrisToArray(new_triangles, arr);
//   return;
// }

// This is not a bad idea but in practice it is very likely unnecessary, it is sufficient to simply refine/subdivide the triangle.
// function findLargestTri(indices:Uint16Array, arr:Float32Array):number {
//   const max = 0;
//   let largestTriIndex = -1;
//   for (let i = 0; i < indices.length; i += 3) {
//     const area = getAreaOfTriangle( arr[i], arr[i + 1], arr[i + 2] );
//     if (area > max) {
//       largestTriIndex = i;
//     }
//   }
//   return largestTriIndex;
// }

// function getareaOfTriangle(i1, i2, i3) {
  
// }