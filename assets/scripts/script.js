document.addEventListener('DOMContentLoaded', () => {
  // Parse URL parameters for personalization
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('nombre');
  const guestCount = urlParams.get('invitados');
  const showInfo = urlParams.get('show');

  const dedicationSection = document.getElementById('dedication-section');
  const rsvpSection = document.getElementById('rsvp-section');
  const sectionsToToggle = [dedicationSection, rsvpSection];

  sectionsToToggle.forEach(section => {
    if (section) {
      if (showInfo === 'yes') {
        section.classList.add('siMostrarInfo');
      } else {
        section.classList.add('noMostrarInfo');
      }
    }
  });

  if (guestName) {
    const nameEls = document.querySelectorAll('#guest-name, #rsvp-guest-name');
    nameEls.forEach(el => el.innerText = guestName);
  }

  if (guestCount) {
    const countEl = document.getElementById('guest-count');
    if (countEl) {
      // Pad with zero if single digit, e.g. "2" -> "02"
      countEl.innerText = guestCount.padStart(2, '0');
    }
  }

  // Reveal animations
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(r => observer.observe(r));

  // Countdown
  const targetDate = new Date('2026-11-07T14:30:00').getTime();
  const elements = {
    days: document.querySelector('.countdown > div:nth-child(1) .n'),
    hours: document.querySelector('.countdown > div:nth-child(2) .n'),
    mins: document.querySelector('.countdown > div:nth-child(3) .n'),
    secs: document.querySelector('.countdown > div:nth-child(4) .n')
  };

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      if(elements.days) elements.days.innerText = "0";
      if(elements.hours) elements.hours.innerText = "0";
      if(elements.mins) elements.mins.innerText = "0";
      if(elements.secs) elements.secs.innerText = "0";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if(elements.days) elements.days.innerText = days;
    if(elements.hours) elements.hours.innerText = hours;
    if(elements.mins) elements.mins.innerText = minutes;
    if(elements.secs) elements.secs.innerText = seconds;
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // RSVP Form interactions
  const rsvpForm = document.querySelector('.rsvp-form');
  const choices = document.querySelectorAll('.rsvp-choices .choice');
  const submitBtn = document.querySelector('.rsvp-form .submit');

  if (rsvpForm && choices.length > 0) {
    choices.forEach(choice => {
      choice.addEventListener('click', () => {
        choices.forEach(c => c.classList.remove('selected'));
        choice.classList.add('selected');
        if (submitBtn) submitBtn.disabled = false;
      });
    });

    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const selected = document.querySelector('.rsvp-choices .choice.selected');
      if (selected) {
        submitBtn.innerText = 'Enviado';
        submitBtn.disabled = true;
        submitBtn.style.background = 'var(--gold)';
        submitBtn.style.color = '#fff';
      }
    });
  }
});
