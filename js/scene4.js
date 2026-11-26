// Scene 4: GUI menu, menu-to-scene transition, GUI reacting to scene events, audio toggle
boot((engine, cv) => {
  const s = new B.Scene(engine); basics(s, '#1d2b3aff');
  const cam = new B.ArcRotateCamera('c', -1, 1.1, 9, B.Vector3.Zero(), s);
  const box = B.MeshBuilder.CreateBox('b', { size: 2 }, s); box.material = mat(s, '#5ec2b7', '#2a7f76', 'check');
  const ui = G.AdvancedDynamicTexture.CreateFullscreenUI('ui', true, s);
  function btn(t, top, fn) { const b = G.Button.CreateSimpleButton('b' + t, t); b.width = '200px'; b.height = '44px'; b.top = top; b.color = 'white'; b.background = '#2a7f76'; b.cornerRadius = 6; b.onPointerUpObservable.add(fn); return b; }
  const menu = new G.Rectangle(); menu.background = '#12222fee'; menu.thickness = 0;
  const title = new G.TextBlock('t', 'Cube Clicker'); title.color = 'white'; title.fontSize = 40; title.top = '-90px'; menu.addControl(title);
  const hud = new G.Rectangle(); hud.isVisible = false; hud.thickness = 0; hud.height = '60px'; hud.verticalAlignment = 0;
  const score = new G.TextBlock('s', 'Clicks: 0'); score.color = 'white'; score.fontSize = 26; hud.addControl(score);
  menu.addControl(btn('Start', '0px', () => { menu.isVisible = false; hud.isVisible = true; cam.attachControl(cv, true); }));
  const audioBtn = btn('Audio: off', '60px', () => { audioBtn.children[0].text = 'Audio: ' + (toggleSound() ? 'on' : 'off'); });
  menu.addControl(audioBtn); ui.addControl(menu); ui.addControl(hud);
  let n = 0;
  box.actionManager = new B.ActionManager(s);
  box.actionManager.registerAction(new B.ExecuteCodeAction(B.ActionManager.OnPickTrigger, () => {
    n++; score.text = 'Clicks: ' + n; box.material.diffuseColor = B.Color3.Random(); beep(300 + n * 40); box.scaling.setAll(1 + (n % 5) * .1);
  }));
  s.onBeforeRenderObservable.add(() => box.rotation.y += .01);
  return s;
});
