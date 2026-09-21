// 3D Spider Logo Hologram Geometry Generator for Three.js
export function createSpiderLogoGeometry(THREE) {
  const shape = new THREE.Shape();

  // Head & Body
  shape.moveTo(0, 24);
  shape.bezierCurveTo(4, 24, 7, 21, 7, 17);
  shape.bezierCurveTo(5, 14, 5, 12, 6, 8);
  // Upper thorax
  shape.bezierCurveTo(9, 6, 12, 2, 11, -6);
  // Abdomen
  shape.bezierCurveTo(9, -15, 6, -26, 0, -32);
  shape.bezierCurveTo(-6, -26, -9, -15, -11, -6);
  shape.bezierCurveTo(-12, 2, -9, 6, -6, 8);
  shape.bezierCurveTo(-5, 12, -5, 14, -7, 17);
  shape.bezierCurveTo(-7, 21, -4, 24, 0, 24);

  // Extrude settings
  const extrudeSettings = {
    steps: 1,
    depth: 4,
    bevelEnabled: true,
    bevelThickness: 1.5,
    bevelSize: 1,
    bevelSegments: 2
  };

  const bodyGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  // Group for full composite emblem
  const spiderGroup = new THREE.Group();
  const bodyMesh = new THREE.Mesh(bodyGeo);
  spiderGroup.add(bodyMesh);

  // Function to create bent leg tube
  function createLeg(points, radius) {
    const curve = new THREE.CatmullRomCurve3(points);
    const legGeo = new THREE.TubeGeometry(curve, 18, radius || 1.1, 6, false);
    return new THREE.Mesh(legGeo);
  }

  // Right legs (and mirror for left)
  const legDefs = [
    // Top front leg
    [
      new THREE.Vector3(5, 12, 0),
      new THREE.Vector3(16, 26, 1),
      new THREE.Vector3(26, 36, 1.5),
      new THREE.Vector3(29, 24, 0.5)
    ],
    // Upper middle leg
    [
      new THREE.Vector3(6, 7, 0),
      new THREE.Vector3(22, 16, 1),
      new THREE.Vector3(34, 18, 1.5),
      new THREE.Vector3(36, 4, 0.5)
    ],
    // Lower middle leg
    [
      new THREE.Vector3(7, -1, 0),
      new THREE.Vector3(22, -8, 1),
      new THREE.Vector3(32, -18, 1.5),
      new THREE.Vector3(30, -30, 0.5)
    ],
    // Bottom back leg
    [
      new THREE.Vector3(6, -9, 0),
      new THREE.Vector3(17, -20, 1),
      new THREE.Vector3(22, -34, 1.5),
      new THREE.Vector3(16, -42, 0.5)
    ]
  ];

  legDefs.forEach(pts => {
    // Right leg
    const rLeg = createLeg(pts, 1.2);
    spiderGroup.add(rLeg);

    // Left leg (mirrored x)
    const leftPts = pts.map(p => new THREE.Vector3(-p.x, p.y, p.z));
    const lLeg = createLeg(leftPts, 1.2);
    spiderGroup.add(lLeg);
  });

  // Merge group into single BufferGeometry using BufferGeometryUtils pattern or simple merge
  const geometries = [];
  spiderGroup.updateMatrixWorld(true);
  spiderGroup.traverse(child => {
    if (child.isMesh && child.geometry) {
      const g = child.geometry.clone();
      g.applyMatrix4(child.matrixWorld);
      geometries.push(g);
    }
  });

  // Combine geometries into one
  let totalVerts = 0;
  let totalNorms = 0;
  let totalIndices = 0;
  geometries.forEach(g => {
    const pos = g.attributes.position;
    if (pos) totalVerts += pos.count * 3;
    const norm = g.attributes.normal;
    if (norm) totalNorms += norm.count * 3;
    if (g.index) totalIndices += g.index.count;
    else if (pos) totalIndices += pos.count;
  });

  const mergedPos = new Float32Array(totalVerts);
  const mergedNorm = new Float32Array(totalNorms);
  const mergedIndices = new Uint32Array(totalIndices);

  let posOffset = 0;
  let normOffset = 0;
  let indexOffset = 0;
  let vertexOffset = 0;

  geometries.forEach(g => {
    const pos = g.attributes.position;
    if (pos) {
      mergedPos.set(pos.array, posOffset);
      posOffset += pos.array.length;
    }
    const norm = g.attributes.normal;
    if (norm) {
      mergedNorm.set(norm.array, normOffset);
      normOffset += norm.array.length;
    }
    if (g.index) {
      for (let i = 0; i < g.index.count; i++) {
        mergedIndices[indexOffset + i] = g.index.array[i] + vertexOffset;
      }
      indexOffset += g.index.count;
    } else if (pos) {
      for (let i = 0; i < pos.count; i++) {
        mergedIndices[indexOffset + i] = i + vertexOffset;
      }
      indexOffset += pos.count;
    }
    if (pos) vertexOffset += pos.count;
  });

  const combined = new THREE.BufferGeometry();
  combined.setAttribute('position', new THREE.BufferAttribute(mergedPos, 3));
  if (normOffset > 0) {
    combined.setAttribute('normal', new THREE.BufferAttribute(mergedNorm, 3));
  } else {
    combined.computeVertexNormals();
  }
  combined.setIndex(new THREE.BufferAttribute(mergedIndices, 1));
  combined.computeBoundingBox();
  combined.computeVertexNormals();

  return combined;
}
