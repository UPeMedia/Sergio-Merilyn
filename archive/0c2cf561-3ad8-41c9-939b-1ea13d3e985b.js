/* global React, ReactDOM */
const { useState, useEffect, useRef, useMemo } = React;

// ------- Placeholder images (stylized SVG "photos") -------
// These are aesthetic, editorial-looking placeholders in the brand palette
// so the invitation looks beautiful before real photos are dropped in.

const ph = (config) => {
  const {
    bg1 = '#1a2f4a', bg2 = '#2d4664', bg3 = '#c9a961',
    accent = '#d9bd82', subject = 'couple', id = 'p'
  } = config;
  const w = 800, h = 1000;
  let subjectSvg = '';
  if (subject === 'couple') {
    // silhouettes against sunset
    subjectSvg = `
      <defs>
        <radialGradient id='sun${id}' cx='50%' cy='68%' r='45%'>
          <stop offset='0%' stop-color='${accent}' stop-opacity='.85'/>
          <stop offset='55%' stop-color='${bg3}' stop-opacity='.35'/>
          <stop offset='100%' stop-color='${bg1}' stop-opacity='0'/>
        </radialGradient>
        <linearGradient id='sky${id}' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stop-color='${bg1}'/>
          <stop offset='55%' stop-color='${bg2}'/>
          <stop offset='85%' stop-color='${bg3}' stop-opacity='.55'/>
          <stop offset='100%' stop-color='${bg1}'/>
        </linearGradient>
      </defs>
      <rect width='${w}' height='${h}' fill='url(#sky${id})'/>
      <circle cx='${w/2}' cy='${h*0.68}' r='${w*0.9}' fill='url(#sun${id})'/>
      <circle cx='${w/2}' cy='${h*0.62}' r='${w*0.13}' fill='${accent}' opacity='.55'/>
      <!-- horizon -->
      <rect x='0' y='${h*0.72}' width='${w}' height='${h*0.28}' fill='${bg1}' opacity='.85'/>
      <!-- couple silhouette -->
      <g transform='translate(${w/2 - 150}, ${h*0.42})' fill='${bg1}' opacity='.92'>
        <!-- her -->
        <ellipse cx='110' cy='55' rx='22' ry='26'/>
        <path d='M88 78 Q110 70 132 78 L148 170 Q148 230 130 270 L200 330 L200 420 L30 420 L30 300 L90 270 Q72 230 72 170 Z'/>
        <!-- him -->
        <ellipse cx='210' cy='52' rx='21' ry='25'/>
        <path d='M188 74 Q210 68 232 74 L246 150 L260 420 L160 420 L174 150 Z'/>
      </g>
      <!-- subtle foreground haze -->
      <rect width='${w}' height='${h}' fill='${bg1}' opacity='.15'/>
      <!-- film grain -->
      <rect width='${w}' height='${h}' fill='url(#grain${id})' opacity='.05'/>
    `;
  } else if (subject === 'candles') {
    subjectSvg = `
      <defs>
        <radialGradient id='glow${id}' cx='50%' cy='60%' r='60%'>
          <stop offset='0%' stop-color='${accent}' stop-opacity='.8'/>
          <stop offset='50%' stop-color='${bg3}' stop-opacity='.25'/>
          <stop offset='100%' stop-color='${bg1}' stop-opacity='0'/>
        </radialGradient>
      </defs>
      <rect width='${w}' height='${h}' fill='${bg1}'/>
      <rect width='${w}' height='${h}' fill='url(#glow${id})'/>
      <!-- candles -->
      ${[180, 340, 500, 660].map((x,i)=>`
        <rect x='${x}' y='${520 + (i%2)*30}' width='40' height='${240 - (i%2)*40}' fill='${accent}' opacity='.6'/>
        <ellipse cx='${x+20}' cy='${500 + (i%2)*30}' rx='8' ry='22' fill='${accent}' opacity='.95'/>
        <ellipse cx='${x+20}' cy='${490 + (i%2)*30}' rx='3' ry='10' fill='#fff8e0'/>
      `).join('')}
      <!-- orchids -->
      <g opacity='.9'>
        ${[[120,300],[640,340],[380,220],[200,700],[620,720]].map(([cx,cy],i)=>`
          <g transform='translate(${cx},${cy})'>
            <ellipse cx='0' cy='-14' rx='22' ry='30' fill='#faf7f2' opacity='.9'/>
            <ellipse cx='-22' cy='4' rx='22' ry='30' fill='#faf7f2' opacity='.85' transform='rotate(-60)'/>
            <ellipse cx='22' cy='4' rx='22' ry='30' fill='#faf7f2' opacity='.85' transform='rotate(60)'/>
            <circle cx='0' cy='0' r='6' fill='${accent}'/>
          </g>
        `).join('')}
      </g>
    `;
  } else if (subject === 'antigua') {
    subjectSvg = `
      <defs>
        <linearGradient id='sky${id}' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stop-color='${bg2}'/>
          <stop offset='60%' stop-color='${bg3}' stop-opacity='.55'/>
          <stop offset='100%' stop-color='${accent}' stop-opacity='.4'/>
        </linearGradient>
      </defs>
      <rect width='${w}' height='${h}' fill='url(#sky${id})'/>
      <!-- volcano -->
      <path d='M0 ${h*0.72} L${w*0.4} ${h*0.35} L${w*0.55} ${h*0.45} L${w} ${h*0.6} L${w} ${h} L0 ${h}' fill='${bg1}' opacity='.85'/>
      <!-- arch -->
      <g transform='translate(${w*0.25}, ${h*0.5})' fill='${bg1}' opacity='.92'>
        <rect x='0' y='0' width='400' height='400'/>
        <path d='M80 400 L80 200 Q80 100 200 100 Q320 100 320 200 L320 400 Z' fill='${bg3}' opacity='.7'/>
        <rect x='180' y='50' width='40' height='70' fill='${bg3}' opacity='.7'/>
      </g>
      <rect width='${w}' height='${h}' fill='${bg1}' opacity='.2'/>
    `;
  } else if (subject === 'flowers') {
    subjectSvg = `
      <rect width='${w}' height='${h}' fill='${bg1}'/>
      <g opacity='.9'>
        ${Array.from({length: 14}).map((_,i)=>{
          const cx = (i*137 % w);
          const cy = (i*229 % h);
          return `
            <g transform='translate(${cx},${cy})'>
              <ellipse cx='0' cy='-18' rx='28' ry='38' fill='#faf7f2' opacity='.9'/>
              <ellipse cx='-26' cy='6' rx='28' ry='38' fill='#faf7f2' opacity='.85' transform='rotate(-60)'/>
              <ellipse cx='26' cy='6' rx='28' ry='38' fill='#faf7f2' opacity='.85' transform='rotate(60)'/>
              <circle cx='0' cy='0' r='8' fill='${accent}'/>
            </g>
          `;
        }).join('')}
      </g>
    `;
  } else if (subject === 'hands') {
    subjectSvg = `
      <defs>
        <radialGradient id='g${id}' cx='50%' cy='50%' r='70%'>
          <stop offset='0%' stop-color='${accent}' stop-opacity='.6'/>
          <stop offset='100%' stop-color='${bg1}' stop-opacity='0'/>
        </radialGradient>
      </defs>
      <rect width='${w}' height='${h}' fill='${bg2}'/>
      <rect width='${w}' height='${h}' fill='url(#g${id})'/>
      <g transform='translate(${w/2 - 100}, ${h/2 - 100})' fill='${bg1}' opacity='.7'>
        <path d='M40 180 Q20 100 80 80 L140 60 L200 70 L240 120 Q250 160 220 200 L180 210 L150 200 L100 210 Q70 205 40 180 Z'/>
      </g>
    `;
  } else if (subject === 'details') {
    subjectSvg = `
      <rect width='${w}' height='${h}' fill='${bg2}'/>
      <g opacity='.8'>
        <circle cx='${w*0.3}' cy='${h*0.35}' r='${w*0.15}' fill='${accent}' opacity='.3'/>
        <circle cx='${w*0.7}' cy='${h*0.65}' r='${w*0.18}' fill='${bg3}' opacity='.4'/>
        <!-- rings -->
        <g transform='translate(${w/2 - 80}, ${h/2 - 40})' stroke='${accent}' stroke-width='6' fill='none'>
          <circle cx='60' cy='60' r='42'/>
          <circle cx='100' cy='60' r='42'/>
        </g>
      </g>
      <rect width='${w}' height='${h}' fill='${bg1}' opacity='.2'/>
    `;
  } else if (subject === 'kiss') {
    subjectSvg = `
      <defs>
        <radialGradient id='k${id}' cx='50%' cy='40%' r='60%'>
          <stop offset='0%' stop-color='${accent}' stop-opacity='.6'/>
          <stop offset='100%' stop-color='${bg1}' stop-opacity='0'/>
        </radialGradient>
      </defs>
      <rect width='${w}' height='${h}' fill='${bg1}'/>
      <rect width='${w}' height='${h}' fill='url(#k${id})'/>
      <g transform='translate(${w/2-160}, 200)' fill='${bg2}' opacity='.95'>
        <ellipse cx='130' cy='80' rx='60' ry='72'/>
        <ellipse cx='230' cy='80' rx='55' ry='70'/>
        <path d='M70 140 L190 140 L190 600 L70 600 Z'/>
        <path d='M180 130 L320 130 L320 600 L180 600 Z'/>
      </g>
    `;
  } else if (subject === 'ceremony') {
    subjectSvg = `
      <defs>
        <linearGradient id='c${id}' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stop-color='${bg2}'/>
          <stop offset='100%' stop-color='${bg1}'/>
        </linearGradient>
      </defs>
      <rect width='${w}' height='${h}' fill='url(#c${id})'/>
      <!-- aisle -->
      <path d='M${w/2 - 200} ${h} L${w/2 + 200} ${h} L${w/2 + 40} ${h*0.4} L${w/2 - 40} ${h*0.4} Z' fill='${accent}' opacity='.25'/>
      <!-- arch -->
      <path d='M${w*0.3} ${h*0.7} Q${w/2} ${h*0.2} ${w*0.7} ${h*0.7}' stroke='${accent}' stroke-width='14' fill='none' opacity='.55'/>
      <!-- couple silhouette -->
      <g transform='translate(${w/2-80}, ${h*0.5})' fill='${bg1}' opacity='.9'>
        <ellipse cx='60' cy='40' rx='18' ry='22'/>
        <path d='M42 60 Q60 54 78 60 L92 300 L28 300 Z'/>
        <ellipse cx='130' cy='38' rx='17' ry='21'/>
        <path d='M113 58 Q130 52 147 58 L160 300 L100 300 Z'/>
      </g>
    `;
  }

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}' preserveAspectRatio='xMidYMid slice'>${subjectSvg}</svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
};

const heroImages = {
  couple: ph({subject:'couple', bg1:'#0a1d38', bg2:'#1a3a6c', bg3:'#4a6fa5', accent:'#a8c5d6', id:'h1'}),
  candles: ph({subject:'candles', bg1:'#0a1d38', bg2:'#1a3a6c', accent:'#a8c5d6', id:'h2'}),
  antigua: ph({subject:'antigua', bg1:'#0a1d38', bg2:'#1a3a6c', bg3:'#4a6fa5', accent:'#a8c5d6', id:'h3'}),
};

// Reveal-on-scroll hook
function useReveal(){
  useEffect(()=>{
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(entries=>{
      entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return ()=> io.disconnect();
  });
}

// ---------- Countdown ----------
function Countdown({target}){
  const [now, setNow] = useState(Date.now());
  useEffect(()=>{
    const t = setInterval(()=> setNow(Date.now()), 1000);
    return ()=> clearInterval(t);
  }, []);
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / (1000*60*60*24));
  const h = Math.floor((diff / (1000*60*60)) % 24);
  const m = Math.floor((diff / (1000*60)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  const box = (n, u) => (
    <div>
      <div className="n">{String(n).padStart(2,'0')}</div>
      <div className="u">{u}</div>
    </div>
  );
  return (
    <div className="countdown">
      {box(d, 'Días')}
      {box(h, 'Horas')}
      {box(m, 'Min')}
      {box(s, 'Seg')}
    </div>
  );
}

// ---------- Diamond divider ----------
const Divider = () => (
  <div className="divider"><span className="dot"></span></div>
);

// ---------- Orquídea blanca (ornamento) ----------
const Orchid = ({size=44, color='currentColor', opacity=.9}) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{opacity}}>
    <g stroke={color} strokeWidth=".8" fill={color} fillOpacity=".15">
      {/* pétalos laterales */}
      <path d="M30 30 C 14 20, 10 32, 14 40 C 20 46, 28 40, 30 30 Z" />
      <path d="M30 30 C 46 20, 50 32, 46 40 C 40 46, 32 40, 30 30 Z" />
      {/* pétalos superiores */}
      <path d="M30 30 C 20 14, 30 8, 34 12 C 38 18, 34 26, 30 30 Z" />
      <path d="M30 30 C 40 14, 30 8, 26 12 C 22 18, 26 26, 30 30 Z" />
      {/* labelo central */}
      <path d="M30 30 C 24 38, 26 50, 30 52 C 34 50, 36 38, 30 30 Z" fill={color} fillOpacity=".35"/>
    </g>
    <circle cx="30" cy="30" r="2" fill={color} opacity=".9"/>
  </svg>
);

// ---------- Velas agrupadas (3 cilindros de diferentes tamaños) ----------
const CandleTrio = ({size=200, color='currentColor'}) => (
  <svg width={size} height={size*0.95} viewBox="0 0 200 190" fill="none">
    <defs>
      <linearGradient id="waxGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity=".35"/>
        <stop offset="100%" stopColor={color} stopOpacity=".08"/>
      </linearGradient>
      <radialGradient id="flameGrad" cx="50%" cy="60%" r="50%">
        <stop offset="0%" stopColor={color} stopOpacity=".95"/>
        <stop offset="100%" stopColor={color} stopOpacity="0"/>
      </radialGradient>
    </defs>
    <g stroke={color} strokeWidth=".9" strokeLinecap="round">
      {/* --- Vela de atrás (la más alta, angosta) --- */}
      <g transform="translate(58, 0)">
        {/* halo */}
        <ellipse cx="14" cy="32" rx="22" ry="22" fill="url(#flameGrad)" opacity=".5"/>
        {/* llama */}
        <path d="M14 16 C 9 22, 9 30, 14 34 C 19 30, 19 22, 14 16 Z" fill={color} fillOpacity=".75" stroke="none"/>
        <path d="M14 22 C 11 26, 11 31, 14 33 C 17 31, 17 26, 14 22 Z" fill="#fff8e0" stroke="none"/>
        {/* pabilo */}
        <line x1="14" y1="34" x2="14" y2="40"/>
        {/* cuerpo */}
        <ellipse cx="14" cy="42" rx="12" ry="3.5" fill="url(#waxGrad)"/>
        <path d="M2 42 L2 175 Q2 180 14 180 Q26 180 26 175 L26 42" fill="url(#waxGrad)"/>
        <ellipse cx="14" cy="175" rx="12" ry="3.5" fill={color} fillOpacity=".15"/>
        {/* cera derretida sutil */}
        <path d="M5 50 Q 6 58 4 64" strokeWidth=".6" opacity=".6"/>
        <path d="M23 52 Q 24 62 22 68" strokeWidth=".6" opacity=".6"/>
      </g>

      {/* --- Vela central (altura media, más ancha) --- */}
      <g transform="translate(95, 30)">
        <ellipse cx="20" cy="32" rx="30" ry="26" fill="url(#flameGrad)" opacity=".55"/>
        <path d="M20 14 C 13 22, 13 32, 20 38 C 27 32, 27 22, 20 14 Z" fill={color} fillOpacity=".8" stroke="none"/>
        <path d="M20 22 C 16 27, 16 33, 20 36 C 24 33, 24 27, 20 22 Z" fill="#fff8e0" stroke="none"/>
        <line x1="20" y1="38" x2="20" y2="44"/>
        <ellipse cx="20" cy="46" rx="18" ry="4.5" fill="url(#waxGrad)"/>
        <path d="M2 46 L2 145 Q2 151 20 151 Q38 151 38 145 L38 46" fill="url(#waxGrad)"/>
        <ellipse cx="20" cy="145" rx="18" ry="4.5" fill={color} fillOpacity=".15"/>
        <path d="M7 58 Q 9 70 6 80" strokeWidth=".6" opacity=".6"/>
        <path d="M33 56 Q 35 68 32 78" strokeWidth=".6" opacity=".6"/>
      </g>

      {/* --- Vela de adelante (la más baja, la más ancha) --- */}
      <g transform="translate(10, 68)">
        <ellipse cx="24" cy="30" rx="36" ry="28" fill="url(#flameGrad)" opacity=".55"/>
        <path d="M24 10 C 16 20, 16 32, 24 38 C 32 32, 32 20, 24 10 Z" fill={color} fillOpacity=".8" stroke="none"/>
        <path d="M24 20 C 19 26, 19 34, 24 37 C 29 34, 29 26, 24 20 Z" fill="#fff8e0" stroke="none"/>
        <line x1="24" y1="38" x2="24" y2="45"/>
        <ellipse cx="24" cy="47" rx="22" ry="5.5" fill="url(#waxGrad)"/>
        <path d="M2 47 L2 115 Q2 122 24 122 Q46 122 46 115 L46 47" fill="url(#waxGrad)"/>
        <ellipse cx="24" cy="115" rx="22" ry="5.5" fill={color} fillOpacity=".18"/>
        <path d="M8 60 Q 10 74 7 86" strokeWidth=".6" opacity=".65"/>
        <path d="M40 58 Q 42 72 39 84" strokeWidth=".6" opacity=".65"/>
        <path d="M24 58 Q 25 68 23 78" strokeWidth=".5" opacity=".45"/>
      </g>
    </g>
  </svg>
);

// Ornamento horizontal de orquídeas + ramitas
const OrchidOrnament = ({flip=false}) => (
  <div className="orchid-ornament" style={{transform: flip ? 'scaleX(-1)' : 'none'}}>
    <svg width="220" height="60" viewBox="0 0 220 60" fill="none">
      <g stroke="currentColor" strokeWidth=".7" strokeLinecap="round">
        {/* tallo principal */}
        <path d="M10 30 Q 60 28, 110 30 Q 160 32, 210 30" fill="none" opacity=".6"/>
        {/* hojitas eucalipto */}
        <ellipse cx="35" cy="24" rx="6" ry="2.5" transform="rotate(-20 35 24)" fill="currentColor" fillOpacity=".2"/>
        <ellipse cx="55" cy="36" rx="7" ry="2.8" transform="rotate(15 55 36)" fill="currentColor" fillOpacity=".2"/>
        <ellipse cx="170" cy="24" rx="6" ry="2.5" transform="rotate(-15 170 24)" fill="currentColor" fillOpacity=".2"/>
        <ellipse cx="190" cy="36" rx="7" ry="2.8" transform="rotate(20 190 36)" fill="currentColor" fillOpacity=".2"/>
        <ellipse cx="85" cy="22" rx="5" ry="2" transform="rotate(-30 85 22)" fill="currentColor" fillOpacity=".2"/>
        <ellipse cx="135" cy="38" rx="5" ry="2" transform="rotate(25 135 38)" fill="currentColor" fillOpacity=".2"/>
      </g>
      {/* orquídea central */}
      <g transform="translate(95, 12)">
        <g stroke="currentColor" strokeWidth=".7" fill="currentColor" fillOpacity=".18">
          <path d="M15 15 C 5 10, 3 18, 6 24 C 10 28, 14 22, 15 15 Z"/>
          <path d="M15 15 C 25 10, 27 18, 24 24 C 20 28, 16 22, 15 15 Z"/>
          <path d="M15 15 C 10 5, 16 2, 18 4 C 20 8, 18 13, 15 15 Z"/>
          <path d="M15 15 C 20 5, 14 2, 12 4 C 10 8, 12 13, 15 15 Z"/>
          <path d="M15 15 C 12 22, 13 30, 15 32 C 17 30, 18 22, 15 15 Z" fillOpacity=".4"/>
        </g>
        <circle cx="15" cy="15" r="1.3" fill="currentColor"/>
      </g>
    </svg>
  </div>
);

// ---------- Icons (inline SVG, minimal) ----------
const IcoChurch = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
    <path d="M20 4 L20 12 M16 8 L24 8" />
    <path d="M8 36 L8 18 L20 12 L32 18 L32 36 Z" />
    <path d="M16 36 L16 26 Q16 22 20 22 Q24 22 24 26 L24 36" />
    <path d="M20 4 L20 8" />
  </svg>
);
const IcoFlower = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
    <ellipse cx="20" cy="12" rx="5" ry="8"/>
    <ellipse cx="20" cy="28" rx="5" ry="8"/>
    <ellipse cx="12" cy="20" rx="8" ry="5"/>
    <ellipse cx="28" cy="20" rx="8" ry="5"/>
    <circle cx="20" cy="20" r="2.5" fill="currentColor"/>
  </svg>
);

// ---------- Sections ----------

function Hero({heroKey}){
  return (
    <section className="hero">
      <div className="hero-photo" style={{ backgroundImage: `url(${heroImages[heroKey] || heroImages.couple})` }} />
      <div className="hero-inner">
        <div className="hero-top">
          <div className="monogram"><span>S &middot; M</span></div>
          <div className="hero-invite-label">Invitación &middot; Sábado 7 de Noviembre</div>
        </div>

        <div className="hero-center">
          <div className="hero-invite-label">Nos casamos</div>
          <h1 className="hero-names">
            Sergio
            <span className="amp">&amp;</span>
            Merilyn
          </h1>
          <div className="hero-sub">
            “Y en el escenario más romántico de Guatemala,<br/>nuestro <em>para siempre</em> comenzará.”
          </div>
          <div className="hero-date">
            <span className="line"></span>
            <span>07 &middot; 11 &middot; 2026</span>
            <span className="line"></span>
          </div>
        </div>

        <div className="hero-bottom">
          <div className="place">Antigua Guatemala</div>
          <div className="scroll-hint">
            <span>Desliza</span>
            <span className="ln"></span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Verse(){
  return (
    <section className="verse reveal">
      <div className="wrap">
        <Divider />
        <p className="q">
          “Y esto pido en oración: que vuestro <em>amor</em><br/>
          abunde aún más y más en conocimiento<br/>
          y en toda comprensión.”
        </p>
        <div className="attr">Filipenses 1:9</div>
        <div style={{marginTop:'40px'}}><Divider /></div>
      </div>
    </section>
  );
}

// ---------- Dedicatoria ----------
function Dedication({guestName, guestCount}){
  return (
    <section className="dedication reveal">
      <div className="wrap">
        <div className="section-title-kicker">Con especial cariño para</div>
        <div className="dedi-name">{guestName}</div>
        <div className="dedi-pass">
          <div className="pass-side">
            <div className="pass-k">Número de invitados</div>
            <div className="pass-v">{String(guestCount).padStart(2,'0')}</div>
          </div>
          <div className="pass-divider" aria-hidden></div>
          <div className="pass-side">
            <div className="pass-k">Mesa</div>
            <div className="pass-v it">por asignar</div>
          </div>
        </div>
        <p className="dedi-note">
          <strong className="dedi-note-strong">
            Hemos decidido que nuestra celebración sea solo para adultos,<br/>
            por lo que no podremos recibir niños. Gracias por entender y acompañarnos.
          </strong>
          <br/><br/>
          <strong className="dedi-note-strong">
            Esta invitación es personal e intransferible.<br/>
            Agradecemos de corazón tu presencia en este día tan especial.
          </strong>
        </p>
      </div>
    </section>
  );
}

function CountdownSection({target}){
  return (
    <section className="countdown-section reveal">
      <div className="wrap">
        <div className="section-title-kicker">Cuenta regresiva</div>
        <div className="section-title">Hacia el <span className="it">sí, acepto</span></div>
        <Countdown target={target} />
      </div>
    </section>
  );
}

function Intro(){
  return (
    <section className="wrap">
      <div className="intro">
        <div className="reveal">
          <div className="section-title-kicker">Nuestra historia</div>
          <h2 className="section-title">Y así, <span className="it">comenzó todo</span></h2>
          <p className="lead" style={{marginTop: '28px'}}>
            Hay historias que no se escriben con tinta, sino con miradas. La nuestra empezó
            entre risas compartidas y tardes que se hicieron <em>infinitas</em>.
          </p>
          <p className="lead" style={{marginTop: '18px'}}>
            Después de recorrer sueños, caminos y un sinfín de pequeños siempres,
            hemos decidido dar el paso más importante: prometernos una vida entera
            bajo el cielo empedrado de Antigua. Queremos que seas testigo del inicio
            de nuestro <em>“para siempre”</em>.
          </p>
        </div>
        <div className="reveal">
          <div className="photo-frame">
            <div className="ph" style={{backgroundImage: `url(photos/sergio-merilyn-retrato.jpg)`}}></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Gallery(){
  const imgs = [
    ph({subject:'couple', bg1:'#1a2f4a', bg2:'#2d4664', bg3:'#c9a961', accent:'#d9bd82', id:'g1'}),
    ph({subject:'candles', id:'g2'}),
    ph({subject:'hands', id:'g3'}),
    ph({subject:'details', id:'g4'}),
    ph({subject:'kiss', id:'g5'}),
    ph({subject:'antigua', id:'g6'}),
  ];
  return (
    <section className="gallery">
      <div className="wrap">
        <div className="gallery-head reveal">
          <div className="section-title-kicker">Galería</div>
          <h2 className="section-title">Pequeños <span className="it">siempres</span></h2>
        </div>
        <div className="gallery-grid reveal">
          <div className="g g1"><div className="ph" style={{backgroundImage:`url(photos/foto-01-retrato.jpg)`}}></div></div>
          <div className="g g2"><div className="ph" style={{backgroundImage:`url(photos/foto-02-detalle.jpg)`, backgroundPosition:'center 75%'}}></div></div>
          <div className="g g3"><div className="ph" style={{backgroundImage:`url(photos/foto-03.jpg)`}}></div></div>
          <div className="g g4"><div className="ph" style={{backgroundImage:`url(photos/foto-04.jpg)`}}></div></div>
          <div className="g g5"><div className="ph" style={{backgroundImage:`url(photos/foto-05.jpg)`}}></div></div>
          <div className="g g6"><div className="ph" style={{backgroundImage:`url(photos/foto-06.jpg)`}}></div></div>
        </div>
      </div>
    </section>
  );
}

function Events(){
  return (
    <section className="events">
      <div className="wrap">
        <div className="events-head reveal">
          <div className="section-title-kicker">Los momentos del día</div>
          <h2 className="section-title">Ceremonia <span className="it">&amp;</span> Recepción</h2>
        </div>
        <div className="event-grid">
          <div className="event-card reveal">
            <div className="ico"><IcoChurch/></div>
            <h3>Ceremonia</h3>
            <div className="time">2:30 PM</div>
            <div className="where">Iglesia Ermita Santa Lucía</div>
            <div className="addr">Antigua Guatemala, Sacatepéquez</div>
            <div className="maps">
              <a className="btn gold" href="https://maps.app.goo.gl/9UjXj3wim4uzZJoB7" target="_blank" rel="noopener">Google Maps</a>
              <a className="btn" href="https://www.waze.com/en/live-map/directions/gt/sacatepequez/antigua-guatemala/ermita-de-santa-lucia?place=ChIJiYUJ6g0OiYURin5dnOiyHbw" target="_blank" rel="noopener">Waze</a>
            </div>
          </div>
          <div className="divider-v"></div>
          <div className="event-card reveal">
            <div className="ico"><IcoFlower/></div>
            <h3>Recepción</h3>
            <div className="time">5:00 PM</div>
            <div className="where">Jardín Santa Sofía</div>
            <div className="addr">7a Calle Poniente 7A, Antigua Guatemala</div>
            <div className="maps">
              <a className="btn gold" href="https://maps.app.goo.gl/RpFhvtnQLj1Peb2g9" target="_blank" rel="noopener">Google Maps</a>
              <a className="btn" href="https://www.waze.com/en/live-map/directions/gt/sacatepequez/antigua-guatemala/santa-sofia-jardin-de-eventos?place=ChIJL4_G6CAPiYURyhOJbP1_vQE" target="_blank" rel="noopener">Waze</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Timeline(){
  const items = [
    { time: '2:30 PM', what: 'Ceremonia religiosa', side: 'left' },
    { time: '4:00 PM', what: 'Disfruta un poco de Antigua', side: 'right' },
    { time: '5:00 PM', what: 'Recepción & cóctel', side: 'left' },
    { time: '5:30 PM', what: 'Entrada de los novios', side: 'right' },
    { time: '6:00 PM', what: 'Primer baile', side: 'left' },
    { time: '7:30 PM', what: 'Cena a la luz de las velas', side: 'right' },
    { time: '8:30 PM', what: 'Fiesta bajo las estrellas', side: 'left' },
    { time: '10:00 PM', what: 'Despedida de los novios', side: 'right' },
  ];
  return (
    <section className="timeline-section reveal">
      <div className="wrap" style={{textAlign:'center'}}>
        <div className="section-title-kicker">Itinerario</div>
        <h2 className="section-title">El <span className="it">día</span> paso a paso</h2>
        <div className="timeline">
          {items.map((it, i)=>(
            <div className={`t-item ${it.side}`} key={i}>
              <div className="time">{it.time}</div>
              <div className="dot"></div>
              <div className="what">{it.what}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Parents(){
  return (
    <section className="parents reveal">
      <div className="wrap">
        <div className="small label" style={{color:'var(--gold-soft)'}}>Con la bendición de nuestros padres</div>
        <h2>Gratitud <span style={{fontStyle:'italic', fontFamily:'var(--serif)', fontWeight:300}}>infinita</span></h2>
        <p className="lead" style={{margin:'0 auto'}}>
          Nada de lo que somos hoy sería posible sin el amor incondicional y el ejemplo
          de quienes nos enseñaron el verdadero significado del compromiso. Este día
          también es suyo.
        </p>
        <div className="names">
          <div className="p-block">
            <div className="role">Padres del novio</div>
            <div className="pn">Sergio Cervantes<br/><span style={{color:'var(--gold-soft)', fontStyle:'italic'}}>&amp;</span><br/>Mayela Rentería de Cervantes</div>
          </div>
          <div className="p-block">
            <div className="role">Padres de la novia</div>
            <div className="pn">Edwin Soto<br/><span style={{color:'var(--gold-soft)', fontStyle:'italic'}}>&amp;</span><br/>Leidy Aguilar de Soto</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DressCode(){
  return (
    <section className="dress reveal">
      <div className="wrap">
        <div className="head">
          <div className="section-title-kicker">Código de vestimenta</div>
          <h2 className="section-title">Vístete <span className="it">con nosotros</span></h2>
        </div>
        <p className="lead" style={{margin:'0 auto', textAlign:'center'}}>
          Para armonizar con el entorno histórico de La Antigua y el ambiente del
          Jardín Santa Sofía, les pedimos asistir con
        </p>
        <div className="words">Traje Formal</div>
        <div className="sub">— Black tie opcional —</div>
      </div>
    </section>
  );
}

function Registry(){
  return (
    <section className="registry reveal">
      <div className="wrap">
        <div className="section-title-kicker">Mesa de regalos</div>
        <h2 className="section-title">Un detalle <span className="it">de amor</span></h2>
        <p className="lead" style={{margin:'24px auto 0', textAlign:'center'}}>
          Tu presencia es nuestro mejor regalo. Si además deseas obsequiarnos algo
          para comenzar esta nueva etapa, lo recibiremos con profunda gratitud.
        </p>
        <div className="cards">
          <div className="gcard">
            <div className="lb">Sobre de regalo</div>
            <h4>En el evento</h4>
            <div className="dt">Durante la recepción habrá un cofre para recibir su detalle.</div>
          </div>
          <div className="gcard">
            <div className="lb">Transferencia · GTQ</div>
            <h4>Banco Industrial</h4>
            <div className="dt">Cuenta monetaria</div>
            <div className="acct">0000 0000 0000</div>
            <div className="dt" style={{margin:0}}>Merilyn Soto</div>
          </div>
          <div className="gcard">
            <div className="lb">Transferencia · USD</div>
            <h4>Banco Industrial</h4>
            <div className="dt">Cuenta en dólares</div>
            <div className="acct">0000 0000 0000</div>
            <div className="dt" style={{margin:0}}>Merilyn Soto</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RSVP({guestName, guestCount, rsvpDeadline}){
  const [sent, setSent] = useState(false);
  const [attending, setAttending] = useState(null); // 'yes' | 'no'
  const [count, setCount] = useState(guestCount);
  useEffect(()=>{ setCount(guestCount); }, [guestCount]);

  const canSubmit = attending === 'no' || (attending === 'yes' && count >= 1 && count <= guestCount);

  return (
    <section className="rsvp reveal">
      <div className="wrap">
        <div className="section-title-kicker" style={{color:'var(--gold-soft)'}}>Confirma tu asistencia</div>
        <h2>¿Contamos <em>contigo</em>?</h2>
        <p className="lead">
          {guestName}, tu presencia será para nosotros el mejor regalo.<br/>
          Por favor confírmanos antes del <em>{rsvpDeadline || '15 de octubre'}</em>.
        </p>
        <p className="lead rsvp-note">
          Si no recibimos tu confirmación antes de esa fecha, entenderemos con mucho cariño que no podrás acompañarnos en esta ocasión.
        </p>

        {!sent ? (
          <form className="rsvp-form rsvp-quick" onSubmit={(e)=>{ e.preventDefault(); if(canSubmit) setSent(true); }}>
            <div className="rsvp-q">¿Asistirán?</div>
            <div className="rsvp-choices">
              <button type="button"
                className={`choice ${attending==='yes'?'on':''}`}
                onClick={()=>setAttending('yes')}>Sí, ahí estaremos</button>
              <button type="button"
                className={`choice ${attending==='no'?'on':''}`}
                onClick={()=>setAttending('no')}>No podremos asistir</button>
            </div>

            {attending === 'yes' && (
              <div className="rsvp-count">
                <div className="rsvp-q">¿Cuántos asistirán?</div>
                <div className="count-note">Esta invitación incluye <em>{guestCount} {guestCount === 1 ? 'pase' : 'pases'}</em></div>
                <div className="count-picker">
                  {Array.from({length: guestCount}, (_,i)=>i+1).map(n => (
                    <button key={n} type="button"
                      className={`num ${count===n?'on':''}`}
                      onClick={()=>setCount(n)}>{n}</button>
                  ))}
                </div>
              </div>
            )}

            <button className="submit" type="submit" disabled={!canSubmit}>
              Enviar confirmación
            </button>
          </form>
        ) : (
          <div style={{padding:'40px 0'}}>
            <p className="lead" style={{margin:'0 auto'}}>
              {attending === 'yes'
                ? <><em>Gracias por confirmar.</em> Nos vemos bajo el cielo de Antigua.</>
                : <><em>Gracias por avisarnos.</em> Te tendremos presentes en el corazón.</>}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function Footer(){
  return (
    <footer>
      <div className="wrap">
        <div className="mono monogram" style={{margin:'0 auto 20px', borderColor:'var(--hairline)', color:'var(--ink)'}}>
          <span>S &middot; M</span>
        </div>
        <div className="sig">Sergio &amp; Merilyn</div>
        <div className="sm">07 &middot; 11 &middot; 2026 · Antigua</div>
      </div>
    </footer>
  );
}

// ---------- App ----------
function App(){
  // target date for countdown: Nov 7, 2026, 2:30 PM Guatemala (UTC-6) → 20:30 UTC
  const target = useMemo(()=> new Date('2026-11-07T14:30:00-06:00').getTime(), []);
  const [heroKey, setHeroKey] = useState('couple');
  const [guestName, setGuestName] = useState('Familia García López');
  const [guestCount, setGuestCount] = useState(2);
  const [rsvpDeadline, setRsvpDeadline] = useState('15 de octubre');

  useReveal();

  // expose setters for tweaks to reach
  useEffect(()=>{
    window.__inv = window.__inv || {};
    window.__inv.setHero = setHeroKey;
    window.__inv.setGuestName = setGuestName;
    window.__inv.setGuestCount = setGuestCount;
    window.__inv.setRsvpDeadline = setRsvpDeadline;
  }, []);

  return (
    <>
      <Hero heroKey={heroKey} />
      <Verse />
      <CountdownSection target={target} />
      <Parents />
      <Intro />
      <Gallery />
      <Events />
      <Timeline />
      <DressCode />
      <Registry />
      <Dedication guestName={guestName} guestCount={guestCount} />
      <RSVP guestName={guestName} guestCount={guestCount} rsvpDeadline={rsvpDeadline} />
      <Footer />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App/>);

// ---------- Pétalos ----------
function renderPetals(mode){
  const box = document.getElementById('petals');
  box.innerHTML = '';
  if (mode === 'off') return;
  const color = mode === 'sky' ? 'var(--sky)' : 'var(--gold)';
  const N = 14;
  for (let i=0; i<N; i++){
    const el = document.createElement('div');
    el.className = 'p';
    el.style.left = (Math.random()*100) + 'vw';
    el.style.width = (6 + Math.random()*8) + 'px';
    el.style.height = el.style.width;
    el.style.animationDuration = (14 + Math.random()*14) + 's';
    el.style.animationDelay = (-Math.random()*20) + 's';
    el.style.opacity = (0.18 + Math.random()*0.35);
    el.style.background = color;
    box.appendChild(el);
  }
}
renderPetals('gold');
window.__renderPetals = renderPetals;
