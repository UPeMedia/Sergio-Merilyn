/* Tweaks panel — not React, just DOM handlers */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "night",
  "displayFont": "Italiana",
  "layout": "editorial",
  "petals": "gold",
  "heroPhoto": "couple",
  "guestName": "Familia García López",
  "guestCount": 2,
  "rsvpDeadline": "15 de octubre"
}/*EDITMODE-END*/;

const PALETTES = {
  night:    { ink:'#1a2f4a', inkSoft:'#2d4664', sky:'#a8c5d6', gold:'#c9a961', goldSoft:'#d9bd82', paper:'#faf7f2', paperWarm:'#f3ece0', swatch:'#1a2f4a' },
  royal:    { ink:'#0f2847', inkSoft:'#1f3d64', sky:'#7fa8c9', gold:'#b8914a', goldSoft:'#d0a968', paper:'#f5f0e6', paperWarm:'#ece4d4', swatch:'#0f2847' },
  soft:     { ink:'#2c4f7c', inkSoft:'#3d6690', sky:'#c4dce8', gold:'#d4b876', goldSoft:'#e8d9a8', paper:'#ffffff', paperWarm:'#f6f1e6', swatch:'#2c4f7c' },
  coastal:  { ink:'#4a6fa5', inkSoft:'#5d82b6', sky:'#e0ecf4', gold:'#d4b876', goldSoft:'#e6d19a', paper:'#fdfcf8', paperWarm:'#f2ead9', swatch:'#4a6fa5' },
};

function applyPalette(key){
  const p = PALETTES[key] || PALETTES.night;
  const r = document.documentElement;
  r.style.setProperty('--ink', p.ink);
  r.style.setProperty('--ink-soft', p.inkSoft);
  r.style.setProperty('--sky', p.sky);
  r.style.setProperty('--gold', p.gold);
  r.style.setProperty('--gold-soft', p.goldSoft);
  r.style.setProperty('--paper', p.paper);
  r.style.setProperty('--paper-warm', p.paperWarm);
  r.style.setProperty('--muted', p.ink + '8c');
  r.style.setProperty('--hairline', p.ink + '2e');
}

function applyFont(key){
  document.documentElement.style.setProperty('--display', `'${key}', 'Cormorant Garamond', serif`);
}

function applyLayout(key){
  document.body.classList.toggle('layout-centered', key === 'centered');
}

function applyPetals(key){
  if (window.__renderPetals) window.__renderPetals(key);
}

function applyHero(key){
  if (window.__inv && window.__inv.setHero) window.__inv.setHero(key);
}
function applyGuestName(v){
  if (window.__inv && window.__inv.setGuestName) window.__inv.setGuestName(v);
}
function applyGuestCount(v){
  if (window.__inv && window.__inv.setGuestCount) window.__inv.setGuestCount(Number(v));
}
function applyRsvpDeadline(v){
  if (window.__inv && window.__inv.setRsvpDeadline) window.__inv.setRsvpDeadline(v);
}

function applyAll(state){
  applyPalette(state.palette);
  applyFont(state.displayFont);
  applyLayout(state.layout);
  applyPetals(state.petals);
  applyHero(state.heroPhoto);
  applyGuestName(state.guestName);
  applyGuestCount(state.guestCount);
  applyRsvpDeadline(state.rsvpDeadline);
}

// --- State ---
let state = { ...TWEAK_DEFAULTS };

function setKey(k, v){
  state = { ...state, [k]: v };
  applyAll(state);
  try {
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
  } catch(e){}
}

// --- Init once DOM ready ---
function initTweaks(){
  applyAll(state);

  const panel = document.getElementById('tweaks');
  const closeBtn = document.getElementById('tweaksClose');

  // Palette chips
  const chips = document.getElementById('paletteChips');
  Object.entries(PALETTES).forEach(([k, p]) => {
    const b = document.createElement('button');
    b.className = 'chip' + (state.palette === k ? ' on' : '');
    b.style.background = `linear-gradient(135deg, ${p.ink} 0 50%, ${p.gold} 50% 100%)`;
    b.title = k;
    b.onclick = () => {
      setKey('palette', k);
      [...chips.children].forEach(c=>c.classList.remove('on'));
      b.classList.add('on');
    };
    chips.appendChild(b);
  });

  const fs = document.getElementById('fontSelect');
  fs.value = state.displayFont;
  fs.addEventListener('change', e => setKey('displayFont', e.target.value));

  const ls = document.getElementById('layoutSelect');
  ls.value = state.layout;
  ls.addEventListener('change', e => setKey('layout', e.target.value));

  const ps = document.getElementById('petalsSelect');
  ps.value = state.petals;
  ps.addEventListener('change', e => setKey('petals', e.target.value));

  const hs = document.getElementById('heroSelect');
  hs.value = state.heroPhoto;
  hs.addEventListener('change', e => setKey('heroPhoto', e.target.value));

  const gn = document.getElementById('guestNameInput');
  if (gn){
    gn.value = state.guestName;
    gn.addEventListener('input', e => setKey('guestName', e.target.value));
  }
  const gc = document.getElementById('guestCountInput');
  if (gc){
    gc.value = state.guestCount;
    gc.addEventListener('change', e => setKey('guestCount', Number(e.target.value)));
  }
  const rd = document.getElementById('rsvpDeadlineInput');
  if (rd){
    rd.value = state.rsvpDeadline;
    rd.addEventListener('input', e => setKey('rsvpDeadline', e.target.value));
  }

  closeBtn.addEventListener('click', ()=>{
    panel.classList.remove('open');
    try { window.parent.postMessage({type:'__deactivate_edit_mode'}, '*'); } catch(e){}
  });

  // Host protocol: listener first, then announce
  window.addEventListener('message', (ev)=>{
    const d = ev.data;
    if (!d || !d.type) return;
    if (d.type === '__activate_edit_mode')   panel.classList.add('open');
    if (d.type === '__deactivate_edit_mode') panel.classList.remove('open');
  });
  try {
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
  } catch(e){}
}

// also load extra font families for tweaks (Playfair, Cinzel, Great Vibes)
(function loadExtraFonts(){
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Cinzel:wght@400;500;600&family=Great+Vibes&display=swap';
  document.head.appendChild(link);
})();

if (document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', initTweaks);
} else {
  // React + Babel may still be mounting; defer a tick
  setTimeout(initTweaks, 50);
}
