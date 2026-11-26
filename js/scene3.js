// Scene 3: movable player, animation, physics (cannon.js)
boot((engine, cv) => {
  const s = new B.Scene(engine); basics(s, '#cfe3f0ff');
  s.enablePhysics(new B.Vector3(0, -9.8, 0), new B.CannonJSPlugin());
  const cam = new B.ArcRotateCamera('c', -1.57, 1.0, 18, B.Vector3.Zero(), s); cam.attachControl(cv, true);
  new B.DirectionalLight('d', new B.Vector3(-1, -2, -1), s).intensity = .6;
  const gr = B.MeshBuilder.CreateGround('g', { width: 24, height: 24 }, s); gr.material = mat(s, '#cfd8c4', '#a7b59a', 'check');
  gr.physicsImpostor = new B.PhysicsImpostor(gr, B.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: .2 }, s);
  const pl = B.MeshBuilder.CreateBox('p', { size: 1.4 }, s); pl.position.y = 1; pl.material = mat(s, '#2471a3', '#85c1e9', 'check');
  pl.physicsImpostor = new B.PhysicsImpostor(pl, B.PhysicsImpostor.BoxImpostor, { mass: 2, restitution: .1, friction: .6 }, s);
  for (let i = 0; i < 8; i++) {
    const b = B.MeshBuilder.CreateSphere('b' + i, { diameter: 1.2 }, s); b.position.set(Math.random() * 14 - 7, 2 + i, Math.random() * 14 - 7); b.material = mat(s, '#c0392b', '#ec7063', 'dots');
    b.physicsImpostor = new B.PhysicsImpostor(b, B.PhysicsImpostor.SphereImpostor, { mass: .5, restitution: .7 }, s);
  }
  const anim = new B.Animation('sq', 'scaling', 30, B.Animation.ANIMATIONTYPE_VECTOR3, B.Animation.ANIMATIONLOOPMODE_CONSTANT);
  anim.setKeys([{ frame: 0, value: new B.Vector3(1, 1, 1) }, { frame: 6, value: new B.Vector3(.8, 1.3, .8) }, { frame: 14, value: new B.Vector3(1, 1, 1) }]);
  pl.animations = [anim];
  s.onBeforeRenderObservable.add(() => {
    const v = pl.physicsImpostor.getLinearVelocity(), f = 7; let x = 0, z = 0;
    if (keys.w || keys.arrowup) z = f; if (keys.s || keys.arrowdown) z = -f; if (keys.a || keys.arrowleft) x = -f; if (keys.d || keys.arrowright) x = f;
    pl.physicsImpostor.setLinearVelocity(new B.Vector3(x || v.x * .9, v.y, z || v.z * .9));
    pl.physicsImpostor.setAngularVelocity(B.Vector3.Zero());
    if (keys[' '] && pl.position.y < 1.2) { pl.physicsImpostor.setLinearVelocity(new B.Vector3(v.x, 7, v.z)); s.beginAnimation(pl, 0, 14, false); }
  });
  return s;
});
