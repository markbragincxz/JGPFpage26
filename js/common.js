// Shared helpers used by every scene
const B = BABYLON, G = BABYLON.GUI;
const keys = {};
addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

// ---- Audio: off until the user turns it on ----
let actx = null, soundOn = false, hum = null;
function toggleSound() {
  if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
  soundOn = !soundOn;
  if (soundOn) {
    hum = actx.createOscillator(); const g = actx.createGain();
    g.gain.value = .03; hum.frequency.value = 110; hum.connect(g); g.connect(actx.destination); hum.start();
  } else if (hum) { hum.stop(); hum = null; }
  return soundOn;
}
function beep(f) {
  if (!soundOn || !actx) return;
  const o = actx.createOscillator(), g = actx.createGain();
  o.frequency.value = f; g.gain.setValueAtTime(.15, actx.currentTime);
  g.gain.exponentialRampToValueAtTime(.001, actx.currentTime + .25);
  o.connect(g); g.connect(actx.destination); o.start(); o.stop(actx.currentTime + .25);
}

// ---- Procedural textures and materials ----
function pattern(scene, c1, c2, type) {
  const t = new B.DynamicTexture('t', 256, scene, true), x = t.getContext();
  x.fillStyle = c1; x.fillRect(0, 0, 256, 256); x.fillStyle = c2;
  if (type === 'check') { for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) if ((i + j) % 2) x.fillRect(i * 32, j * 32, 32, 32); }
  else { for (let i = 0; i < 500; i++) x.fillRect(Math.random() * 256, Math.random() * 256, 3, 3); }
  t.update(); return t;
}
function mat(scene, c1, c2, type) {
  const m = new B.StandardMaterial('m', scene); m.diffuseTexture = pattern(scene, c1, c2, type); return m;
}
function basics(scene, col) {
  scene.clearColor = B.Color4.FromHexString(col || '#9fd3e6ff');
  const l = new B.HemisphericLight('h', new B.Vector3(0, 1, 0), scene); l.intensity = .6; return l;
}
function noiseURL() {
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
  for (let i = 0; i < 128; i++) for (let j = 0; j < 128; j++) {
    const v = 128 + 60 * Math.sin(i / 9) + 60 * Math.cos(j / 7) + 30 * Math.sin((i + j) / 4);
    x.fillStyle = `rgb(${v},${v},${v})`; x.fillRect(i, j, 1, 1);
  }
  return c.toDataURL();
}

// ---- Start a scene: build(engine, canvas) must return an object with render() ----
function boot(build) {
  const cv = document.getElementById('c');
  try {
    const engine = new B.Engine(cv, true);
    const s = build(engine, cv);
    engine.runRenderLoop(() => s.render());
    addEventListener('resize', () => engine.resize());
  } catch (e) { console.error(e); document.getElementById('err').textContent = 'Could not start scene: ' + e.message; }
}
