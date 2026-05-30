/**
 * Sergio & Merilyn — Custom WordPress / Bricks Builder Scripts
 *
 * Upload this file to:
 *   wp-content/themes/bodacervantessoto/assets/js/sm-invitacion.js
 *
 * Then enqueue it in functions.php (see sm-enqueue-scripts below),
 * OR paste the contents directly into a Code Block element inside Bricks Builder
 * on the page, wrapped in <script> tags.
 *
 * What this script does:
 *   1. Reads ?nombre=, ?invitados=, ?mesa=, ?show= from the URL
 *   2. Populates every element with id="sm-guest-name" and id="sm-rsvp-guest-name"
 *   3. Populates the guest count element id="sm-guest-count"
 *   4. Populates the table number element id="sm-guest-mesa" (fallback: "por asignar")
 *   5. Shows #dedication-section & #rsvp-section ONLY when ?show=yes is present
 */

(function () {
  'use strict';

  // ─── 1. Parse URL params ────────────────────────────────────────────────────
  const params    = new URLSearchParams(window.location.search);
  const nombre    = params.get('nombre');
  const invitados = params.get('invitados');
  const mesa      = params.get('mesa');
  const showInfo  = params.get('show');

  // ─── 2. Inject guest name into all name placeholders ───────────────────────
  if (nombre) {
    // Main dedicatoria heading (Bricks sets CSS ID directly on the element)
    const nameEls = document.querySelectorAll(
      '#sm-guest-name, #sm-rsvp-guest-name'
    );
    nameEls.forEach(function (el) {
      el.textContent = nombre;
    });
  }

  // ─── 3. Inject guest count ──────────────────────────────────────────────────
  if (invitados) {
    const countEl = document.getElementById('sm-guest-count');
    if (countEl) {
      countEl.textContent = String(invitados).padStart(2, '0');
    }
  }

  // ─── 4. Inject table / mesa number ─────────────────────────────────────────
  const mesaEl = document.getElementById('sm-guest-mesa');
  if (mesaEl) {
    mesaEl.textContent = mesa ? mesa : 'por asignar';
  }

  // ─── 5. Show / hide dedicatoria & RSVP sections ────────────────────────────
  // These sections are hidden by default via CSS.
  // In Bricks, give the Dedicatoria section the CSS ID:  dedication-section
  //           and the RSVP section the CSS ID:           rsvp-section
  // They will ONLY be shown when the URL contains ?show=yes
  if (showInfo === 'yes') {
    const toggleSections = document.querySelectorAll(
      '#dedication-section, #rsvp-section'
    );
    toggleSections.forEach(function (section) {
      section.classList.remove('sm-hidden');
      section.classList.add('sm-visible');
    });
  }

  // ─── 6. Floating gold petals ──────────────────────────────────────────────
  // Creates the same falling petal overlay from the original static site.
  // Relies on .sm-petals / .sm-petals .p / @keyframes sm-fall in sm-invitacion.css
  (function renderPetals() {
    // Skip on reduced-motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var container = document.createElement('div');
    container.className = 'sm-petals';
    var PETAL_COUNT = 14;

    for (var i = 0; i < PETAL_COUNT; i++) {
      var p = document.createElement('div');
      p.className = 'p';
      var size = (6 + Math.random() * 8) + 'px';
      p.style.left            = (Math.random() * 100) + 'vw';
      p.style.width           = size;
      p.style.height          = size;
      p.style.animationDuration = (14 + Math.random() * 14) + 's';
      p.style.animationDelay  = (-Math.random() * 20) + 's';
      p.style.opacity         = (0.18 + Math.random() * 0.35);
      p.style.background      = 'var(--gold)';
      container.appendChild(p);
    }

    document.body.appendChild(container);
  })();

})();
