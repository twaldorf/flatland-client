export function subtriangulate(arr:Float64Array) {
  const tri = findLargestTri();
  const new_point = center(tri);
  const new_triangles = getNewTriangles();
  deleteTriFromArray(tri);
  appendTrisToArray(new_triangles, arr);
  return;
}