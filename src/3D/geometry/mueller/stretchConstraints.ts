import { findTriNeighbors } from "./findTriNeighbors";

// from https://github.com/matthias-research/pages/blob/master/tenMinutePhysics/14-cloth.html#L148
export function generateTriPairIds(faceTriIds:Int8Array) {
  const neighbors = findTriNeighbors(faceTriIds);
  var numTris = faceTriIds.length / 3;
  var edgeIds = [];
  var triPairIds = [];

  for (var i = 0; i < numTris; i++) {
  	for (var j = 0; j < 3; j++) {
  		var id0 = faceTriIds[3 * i + j];
  		var id1 = faceTriIds[3 * i + (j + 1) % 3];

  		// each edge only once
  		var n = neighbors[3 * i + j];
  		if (n < 0 || id0 < id1) {
  			edgeIds.push(id0);
  			edgeIds.push(id1);
  		}
  		// tri pair
  		if (n >= 0) {
  			// opposite ids
  			var ni = Math.floor(n / 3);
  			var nj = n % 3;
  			var id2 = faceTriIds[3 * i + (j + 2) % 3];
  			var id3 = faceTriIds[3 * ni + (nj + 2) % 3];
  			triPairIds.push(id0);
  			triPairIds.push(id1);
  			triPairIds.push(id2);
  			triPairIds.push(id3);
  		}
  	}
  }

  return {triPairIds, edgeIds};
}