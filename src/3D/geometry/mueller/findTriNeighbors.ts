// from https://github.com/matthias-research/pages/blob/master/tenMinutePhysics/14-cloth.html#L148
export function findTriNeighbors(triIds:Int8Array) 
{
	// create common edges

	var edges = [];
	var numTris = triIds.length / 3;

	for (var i = 0; i < numTris; i++) {
		for (var j = 0; j < 3; j++) {
			var id0 = triIds[3 * i + j];
			var id1 = triIds[3 * i + (j + 1) % 3];
			edges.push({
				id0 : Math.min(id0, id1), 
				id1 : Math.max(id0, id1), 
				edgeNr : 3 * i + j
			});
		}
	}

	// sort so common edges are next to each other

	edges.sort((a, b) => ((a.id0 < b.id0) || (a.id0 == b.id0 && a.id1 < b.id1)) ? -1 : 1);

	// find matchign edges

	const neighbors = new Float32Array(3 * numTris);
	neighbors.fill(-1);		// open edge

	var nr = 0;
	while (nr < edges.length) {
		var e0 = edges[nr];
		nr++;
		if (nr < edges.length) {
			var e1 = edges[nr];
			if (e0.id0 == e1.id0 && e0.id1 == e1.id1) {
				neighbors[e0.edgeNr] = e1.edgeNr;
				neighbors[e1.edgeNr] = e0.edgeNr;
			}
			nr++;
		}
	}

	return neighbors;
}