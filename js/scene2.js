// Scene 2: 3D environment, height-map terrain, cloned + merged meshes, constrained camera
boot((engine, cv) => {
  const s = new B.Scene(engine); basics(s, '#bcd9ecff');
  const cam = new B.ArcRotateCamera('c', 0, 1.2, 45, new B.Vector3(0, 3, 0), s); cam.attachControl(cv, true);
  cam.lowerRadiusLimit = 15; cam.upperRadiusLimit = 70; cam.upperBetaLimit = 1.4; cam.lowerBetaLimit = .4;
  const sun = new B.DirectionalLight('d', new B.Vector3(-1, -2, -.5), s); sun.intensity = .7;
  // 360-degree background image (generated gradient)
  const c = document.createElement('canvas'); c.width = 512; c.height = 256; const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, '#2b5a8a'); g.addColorStop(1, '#f3d9b1'); x.fillStyle = g; x.fillRect(0, 0, 512, 256);
  new B.PhotoDome('sky', c.toDataURL(), { size: 900 }, s);
  B.MeshBuilder.CreateGroundFromHeightMap('t', noiseURL(), {
    width: 80, height: 80, subdivisions: 64, minHeight: 0, maxHeight: 6, onReady: m => {
      m.material = mat(s, '#4e7d3a', '#6fa355', 'dots');
      const trunk = B.MeshBuilder.CreateCylinder('tr', { height: 2, diameter: .5 }, s); trunk.material = mat(s, '#6e4b2a', '#8a6238', 'dots');
      const leaf = B.MeshBuilder.CreateSphere('lf', { diameter: 2.2 }, s); leaf.position.y = 2.2; leaf.material = mat(s, '#2e6b2e', '#3f8f3f', 'dots');
      const tree = B.Mesh.MergeMeshes([trunk, leaf], true, true, undefined, false, true); // mesh merging
      tree.isVisible = false;
      for (let i = 0; i < 30; i++) { // cloning
        const cl = tree.clone('tree' + i); cl.isVisible = true;
        const px = Math.random() * 70 - 35, pz = Math.random() * 70 - 35;
        cl.position.set(px, m.getHeightAtCoordinates(px, pz), pz); cl.scaling.scaleInPlace(.7 + Math.random() * .8);
      }
    }
  }, s);
  return s;
});
