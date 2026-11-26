// Scene 1: shapes, lighting, textures, shadows, motion
boot((engine, cv) => {
  const s = new B.Scene(engine); basics(s);
  const cam = new B.ArcRotateCamera('c', -1.2, 1.1, 16, B.Vector3.Zero(), s); cam.attachControl(cv, true);
  const sun = new B.DirectionalLight('d', new B.Vector3(-1, -2, -1), s); sun.position = new B.Vector3(10, 20, 10); sun.intensity = .8;
  const sg = new B.ShadowGenerator(1024, sun); sg.useBlurExponentialShadowMap = true;
  const ground = B.MeshBuilder.CreateGround('g', { width: 20, height: 20 }, s);
  ground.material = mat(s, '#cfd8c4', '#a7b59a', 'check'); ground.receiveShadows = true;
  const box = B.MeshBuilder.CreateBox('b', { size: 2 }, s); box.position.set(-4, 1, 0); box.material = mat(s, '#c0392b', '#e57368', 'check');
  const sph = B.MeshBuilder.CreateSphere('s', { diameter: 2.4 }, s); sph.position.set(0, 1.2, 0); sph.material = mat(s, '#2471a3', '#7fb3d5', 'dots');
  const tor = B.MeshBuilder.CreateTorus('t', { diameter: 2.5, thickness: .7 }, s); tor.position.set(4, 1.5, 0); tor.material = mat(s, '#d4ac0d', '#f7dc6f', 'dots');
  [box, sph, tor].forEach(m => sg.addShadowCaster(m));
  let t = 0;
  s.onBeforeRenderObservable.add(() => {
    t += engine.getDeltaTime() / 1000;
    box.rotation.y += .02; tor.rotation.x += .03; sph.position.y = 1.5 + Math.abs(Math.sin(t * 2)) * 2;
  });
  return s;
});
