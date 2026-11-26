// Scene 5: two scenes (garden + night arena), switched by a GUI button or by a scene event
boot(engine => {
  let score = 0, active;
  function make(night) {
    const s = new B.Scene(engine); basics(s, night ? '#0b1420ff' : '#b7dff0ff'); s.lights[0].intensity = night ? .25 : .7;
    const cam = new B.UniversalCamera('c', new B.Vector3(0, 12, -14), s); cam.setTarget(B.Vector3.Zero());
    const gr = B.MeshBuilder.CreateGround('g', { width: 24, height: 24 }, s);
    gr.material = mat(s, night ? '#2a3550' : '#5d8f4a', night ? '#3c4a6e' : '#79ab63', 'dots');
    const pl = B.MeshBuilder.CreateSphere('p', { diameter: 1.4 }, s); pl.position.y = .7; pl.material = mat(s, '#f5b041', '#fad7a0', 'check');
    if (night) { const pt = new B.PointLight('pt', new B.Vector3(0, 4, 0), s); pt.intensity = .9; s.onBeforeRenderObservable.add(() => pt.position.copyFrom(pl.position).addInPlace(new B.Vector3(0, 3, 0))); }
    const orbs = [];
    for (let i = 0; i < 5; i++) {
      const o = B.MeshBuilder.CreateSphere('o' + i, { diameter: .9 }, s); o.position.set(Math.random() * 20 - 10, 1, Math.random() * 20 - 10);
      const m = new B.StandardMaterial('om', s); m.emissiveColor = night ? new B.Color3(.4, 1, .9) : new B.Color3(1, .5, .8); o.material = m; orbs.push(o);
    }
    const ui = G.AdvancedDynamicTexture.CreateFullscreenUI('ui', true, s);
    const lab = new G.TextBlock('l', (night ? 'Night arena · ' : 'Garden · ') + 'Orbs: ' + score + ' / 5'); lab.color = 'white'; lab.fontSize = 24; lab.verticalAlignment = 0; lab.top = '12px'; ui.addControl(lab);
    function btn(t, top, bg, fn) { const b = G.Button.CreateSimpleButton('b' + t, t); b.width = '160px'; b.height = '40px'; b.color = 'white'; b.background = bg; b.horizontalAlignment = 1; b.verticalAlignment = 0; b.top = top; b.left = '-12px'; b.onPointerUpObservable.add(fn); ui.addControl(b); return b; }
    btn('Switch scene', '50px', '#2a7f76', swap);
    const au = btn('Sound: off', '96px', '#555', () => { au.children[0].text = 'Sound: ' + (toggleSound() ? 'on' : 'off'); });
    s.onBeforeRenderObservable.add(() => {
      const sp = .15 * engine.getDeltaTime() / 16;
      if (keys.w || keys.arrowup) pl.position.z += sp; if (keys.s || keys.arrowdown) pl.position.z -= sp;
      if (keys.a || keys.arrowleft) pl.position.x -= sp; if (keys.d || keys.arrowright) pl.position.x += sp;
      pl.position.x = B.Scalar.Clamp(pl.position.x, -11, 11); pl.position.z = B.Scalar.Clamp(pl.position.z, -11, 11);
      orbs.forEach(o => {
        if (o.isDisposed()) return;
        o.position.y = 1 + Math.sin(performance.now() / 300 + o.position.x) * .2;
        if (B.Vector3.Distance(o.position, pl.position) < 1.2) { o.dispose(); score++; lab.text = 'Orbs: ' + score + ' / 5'; beep(660); if (score >= 5) { score = 0; swap(); } }
      });
    });
    return s;
  }
  const A = make(false), N = make(true); active = A;
  function swap() { active = (active === A ? N : A); }
  return { render: () => active.render() };
});
