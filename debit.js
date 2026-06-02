/* ─────────────────────────────────────────────────────────────
   debit.js  —  fully responsive version
   Fixes:
   1. IntersectionObserver rebuilds on resize / orientation change
   2. injectMobileText removes injected elements when returning to desktop
   3. Smooth scroll for anchor links
   4. All other original behaviour preserved
───────────────────────────────────────────────────────────── */

// ── Smooth scroll for all anchor links ──────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ── Active sub-nav link on scroll ───────────────────────────────
const subNavLinks = document.querySelectorAll('.sub-nav li a');
const sections    = document.querySelectorAll('main section');

function updateActiveLink() {
  let currentSection = '';
  sections.forEach(section => {
    if (window.pageYOffset >= section.offsetTop - 100) {
      currentSection = section.getAttribute('id');
    }
  });

  subNavLinks.forEach(link => {
    link.classList.remove('active');
    if (currentSection && link.getAttribute('href') === '#' + currentSection) {
      link.classList.add('active');
    }
  });

  const currentPath = window.location.pathname.split('/').pop().split('?')[0];
  if (currentPath === 'debit.html') {
    const parentLi = document.querySelector('.side-nav a[href="debit.html"]')?.closest('li');
    if (parentLi) {
      parentLi.querySelector(':scope > a')?.classList.add('active-parent');
    }
    if (!currentSection && subNavLinks.length > 0) {
      subNavLinks[0].classList.add('active');
    }
  }
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
window.addEventListener('DOMContentLoaded', updateActiveLink);


// ── IntersectionObserver for scroll-item activation ─────────────
// Rebuilt on resize so threshold stays correct for new dimensions

const items      = document.querySelectorAll('.scroll-item');
const headingEl  = document.getElementById('case-heading');
const textEl     = document.getElementById('case-text');
const nextProject = document.querySelector('.next-project');

let scrollObserver = null;

function buildScrollObserver() {
  if (scrollObserver) scrollObserver.disconnect();

  const isMobile = window.innerWidth < 768;

  // On mobile, items are always fully visible — no need for observer-driven dimming
  // On desktop/tablet, use threshold to drive sticky panel updates
  const threshold = isMobile ? 0.3 : 0.6;

  scrollObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const { heading, text } = entry.target.dataset;
      items.forEach(item => item.classList.remove('active'));
      entry.target.classList.add('active');

      // Update sticky text panel (desktop/tablet only — hidden on mobile)
      if (headingEl) headingEl.textContent = heading || '';
      if (textEl)    textEl.innerHTML      = text    || '';
    });
  }, { threshold });

  items.forEach(item => scrollObserver.observe(item));
}

buildScrollObserver();

// Rebuild observer on resize / orientation change
let resizeObserverTimer = null;
function onResizeRebuild() {
  clearTimeout(resizeObserverTimer);
  resizeObserverTimer = setTimeout(buildScrollObserver, 200);
}
window.addEventListener('resize', onResizeRebuild);
window.addEventListener('orientationchange', () => setTimeout(buildScrollObserver, 300));


// ── Next-project button visibility ──────────────────────────────
const pdfItem    = Array.from(items).find(i => i.querySelector('img')?.alt === 'Debit Note');
const impactItem = document.querySelector('.scroll-item.impact');

if (pdfItem && impactItem && nextProject) {
  function updateNextProjectVisibility() {
    const pdfRect    = pdfItem.getBoundingClientRect();
    const impactRect = impactItem.getBoundingClientRect();
    const passedPDF  = pdfRect.top <= window.innerHeight * 0.6;
    const beforeEnd  = impactRect.bottom > window.innerHeight * 0.2;
    nextProject.classList.toggle('show', passedPDF && beforeEnd);
  }

  updateNextProjectVisibility();
  window.addEventListener('scroll',            updateNextProjectVisibility, { passive: true });
  window.addEventListener('resize',            updateNextProjectVisibility);
  window.addEventListener('orientationchange', () => setTimeout(updateNextProjectVisibility, 200));
}


// ── Hamburger menu ───────────────────────────────────────────────
const menuBtn = document.querySelector('.menu-toggle');
const sideNav = document.querySelector('.side-nav');

if (menuBtn && sideNav) {
  menuBtn.addEventListener('click', () => sideNav.classList.toggle('open'));

  document.querySelectorAll('.side-nav a').forEach(link => {
    link.addEventListener('click', () => sideNav.classList.remove('open'));
  });
}


// ── Mobile text injection / cleanup ─────────────────────────────
// Injects headings + text into each scroll-item on mobile.
// Removes them when the screen grows back to desktop width.

function injectMobileText() {
  const isMobile = window.innerWidth < 768;

  if (!isMobile) {
    // ── CLEANUP: remove all injected elements when on desktop ──
    document.querySelectorAll('.scroll-item .mobile-heading').forEach(el => el.remove());
    document.querySelectorAll('.scroll-item .mobile-text').forEach(el => el.remove());
    document.querySelectorAll('.scroll-item .case-title').forEach(el => el.remove());
    document.querySelectorAll('.scroll-item').forEach(item => {
      delete item.dataset.mobileInjected;
    });
    return;
  }

  // ── Inject "Project Case Study:" title above first item ──
  const firstItem = document.querySelector('.scroll-item');
  if (firstItem && !firstItem.querySelector('.case-title')) {
    const mobileTitle = document.createElement('h1');
    mobileTitle.className = 'case-title';
    mobileTitle.textContent = 'Project Case Study:';
    Object.assign(mobileTitle.style, {
      fontSize: 'clamp(1.4rem, 6vw, 2rem)',
      color: '#ffffff',
      textAlign: 'center',
      marginBottom: '0.5rem',
    });
    firstItem.prepend(mobileTitle);
  }

  // ── Inject heading + text into each scroll item ──
  document.querySelectorAll('.scroll-item').forEach(item => {
    if (item.dataset.mobileInjected === '1') return;

    const headingEl = document.createElement('h2');
    headingEl.className   = 'mobile-heading';
    headingEl.textContent = item.dataset.heading || '';

    const textEl   = document.createElement('p');
    textEl.className = 'mobile-text';
    textEl.innerHTML = item.dataset.text || '';

    item.prepend(textEl);
    item.prepend(headingEl);
    item.dataset.mobileInjected = '1';
  });
}

window.addEventListener('load', injectMobileText);

window.addEventListener('orientationchange', () => setTimeout(injectMobileText, 300));

window.addEventListener('resize', () => {
  clearTimeout(window.__mobileInjectTimer);
  window.__mobileInjectTimer = setTimeout(injectMobileText, 150);
});


// ── Page fade-in ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('fade-in');
});


// ── Page fade-out on internal navigation ─────────────────────────
document.querySelectorAll('a[href]').forEach(link => {
  link.addEventListener('click', e => {
    if (link.target === '_blank' || link.getAttribute('href').startsWith('#')) return;
    e.preventDefault();
    document.body.classList.remove('fade-in');
    document.body.style.opacity = '0';
    setTimeout(() => { window.location.href = link.href; }, 200);
  });
});


// ── Excel download ───────────────────────────────────────────────
const downloadBtn = document.getElementById('download-excel');
if (downloadBtn) {
  downloadBtn.addEventListener('click', e => {
    e.preventDefault();
    const link = document.createElement('a');
    link.href     = 'medequip.xlsx';
    link.download = 'medequip.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}
