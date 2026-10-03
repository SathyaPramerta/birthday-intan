/* =========================================================
   SOUND EFFECTS
   Put your audio files in the "sounds" folder and (optionally)
   change the file names below. Missing files are simply skipped.
   ========================================================= */
const SOUNDS = {
  click: 'sounds/click.mp3'   // one sound for every button
};
let muted = localStorage.getItem('muted') === '1';
function play(name) {
  if (muted || !SOUNDS[name]) return;
  // new Audio each time so rapid clicks can overlap
  const a = new Audio(SOUNDS[name]);
  a.play().catch(() => { });
}
// play the sound for every button and meme card
document.addEventListener('click', e => {
  if (e.target.closest('button, .meme')) play('click');
});
const soundBtn = document.getElementById('soundToggle');
const refreshSoundBtn = () => soundBtn.textContent = muted ? '🔇' : '🔊';
refreshSoundBtn();
soundBtn.onclick = () => { muted = !muted; localStorage.setItem('muted', muted ? '1' : '0'); refreshSoundBtn(); };

/* =========================================================
   CAT MEMES
   Put your pictures in "images" as meme1 ... meme6
   (.jpg .jpeg .png .webp .gif all work). Emojis show until then.
   ========================================================= */
const memes = [
  { e: '😹', c: "Me when it's your birthday" },
  { e: '😻', c: 'My 🍑 Cake first, thesis later' },
  { e: '🙀', c: "Wait, we're 5 years diff now(masih love you sekebon kack" },
  { e: '😼', c: 'Kamu aku makan' },
  { e: '😽', c: 'Kamu aku kecup' },
  { e: '🐈', c: 'Kamu aku pat pat' }
];
const grid = document.getElementById('grid');
function loadMemeImage(pic, n, alt) {
  const exts = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
  let k = 0;
  const img = new Image();
  img.alt = alt;
  img.onload = () => { pic.textContent = ''; pic.appendChild(img); };
  img.onerror = () => { if (++k < exts.length) img.src = `images/meme${n}.${exts[k]}`; };
  img.src = `images/meme${n}.${exts[0]}`;
}
memes.forEach((m, i) => {
  const d = document.createElement('div'); d.className = 'meme';
  const pic = document.createElement('div'); pic.className = 'pic'; pic.textContent = m.e;
  loadMemeImage(pic, i + 1, m.c);
  d.append(pic);
  d.insertAdjacentHTML('beforeend', '<p>' + m.c + '</p>');
  d.onclick = () => { play('meme'); d.classList.remove('boing'); void d.offsetWidth; d.classList.add('boing'); };
  grid.append(d);
});

/* =========================================================
   CONFETTI, PAWS, FLOATING BACKGROUND, SPARKLES
   ========================================================= */
const cv = document.getElementById('confetti'), cx = cv.getContext('2d');
let parts = [], anim = false;
function size() { cv.width = innerWidth; cv.height = innerHeight; }
size(); onresize = size;
function burst(n = 140) {
  const cols = ['#ff6fa5', '#9b7bff', '#ffd54a', '#6fd3ff', '#7dffb2'];
  for (let i = 0; i < n; i++) parts.push({
    x: innerWidth / 2, y: innerHeight / 2, vx: (Math.random() - .5) * 16, vy: Math.random() * -14 - 3,
    s: Math.random() * 8 + 4, c: cols[i % 5], r: Math.random() * 6, l: 160
  });
  if (!anim) loop();
}
function loop() {
  anim = true; cx.clearRect(0, 0, cv.width, cv.height);
  parts = parts.filter(p => p.l > 0);
  parts.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.vy += .3; p.r += .2; p.l--;
    cx.fillStyle = p.c; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r);
    cx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .6); cx.restore();
  });
  parts.length ? requestAnimationFrame(loop) : (anim = false, cx.clearRect(0, 0, cv.width, cv.height));
}
function paws() {
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div'); p.className = 'paw';
    p.textContent = ['🐾', '🐱', '💖'][i % 3];
    p.style.left = Math.random() * 100 + 'vw'; p.style.top = '-40px';
    p.style.animationDuration = 3 + Math.random() * 3 + 's';
    document.body.append(p); setTimeout(() => p.remove(), 6500);
  }
}
/* soft floating emojis in the background */
const fl = document.getElementById('floaters');
['🎈', '⭐', '🐾', '💖', '🎀', '✨', '🐱', '🎈', '💫', '🐾'].forEach((e, i) => {
  const s = document.createElement('span'); s.textContent = e;
  s.style.left = (i * 10 + Math.random() * 6) + '%';
  s.style.fontSize = (1.2 + Math.random() * 1.2) + 'rem';
  s.style.animationDuration = (14 + Math.random() * 12) + 's';
  s.style.animationDelay = (-Math.random() * 20) + 's';
  fl.append(s);
});
/* sparkle trail (mouse only) */
let lastSpark = 0;
addEventListener('pointermove', e => {
  if (e.pointerType !== 'mouse' || Date.now() - lastSpark < 70) return;
  lastSpark = Date.now();
  const s = document.createElement('span'); s.className = 'spark';
  s.textContent = ['✨', '💗', '⭐'][Math.floor(Math.random() * 3)];
  s.style.left = e.clientX + 'px'; s.style.top = e.clientY + 'px';
  document.body.append(s); setTimeout(() => s.remove(), 800);
});

/* =========================================================
   BUTTONS
   ========================================================= */
document.getElementById('startBtn').onclick = () => {
  play('confetti'); burst(); paws();
  document.getElementById('wish').scrollIntoView({ behavior: 'smooth' });
};
document.getElementById('blowBtn').onclick = () => {
  play('blow');
  document.getElementById('cake').classList.add('out');
  document.getElementById('hint').textContent = 'Wish received! May it come true 🌟';
  setTimeout(burst, 500);
};
document.getElementById('surpriseBtn').onclick = () => {
  play('surprise');
  document.getElementById('surprise').classList.add('show');
  burst(220); paws();
};

/* =========================================================
   TYPEWRITER MESSAGE + SCROLL REVEAL
   ========================================================= */
const msg = "Happy your 25th birthday, Intan! 🎂 I hope today is filled with laughter, and your favorite cake (it's ma cake la lol). You work so hard for your master's at UGM, so today, just rest and enjoy being celebrated. Wishing you a year of happiness, good health, and all your dreams coming true.";
let ti = 0, started = false;
const wt = document.getElementById('wishText');
new IntersectionObserver(e => {
  if (e[0].isIntersecting && !started) {
    started = true; wt.classList.add('typing');
    (function t() {
      wt.textContent = msg.slice(0, ++ti);
      if (ti < msg.length) setTimeout(t, 35); else wt.classList.remove('typing');
    })();
  }
}, { threshold: .4 }).observe(wt);

const revealObs = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('show'); revealObs.unobserve(en.target); } });
}, { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
