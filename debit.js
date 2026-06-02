
const subNavLinks = document.querySelectorAll('.sub-nav li a'); 
const sections = document.querySelectorAll('main section');

function updateActiveLink() {
    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 100) {
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
            const parentAnchor = parentLi.querySelector(':scope > a');
            parentAnchor?.classList.add('active-parent');
        }

      
        if (!currentSection && subNavLinks.length > 0) {
            subNavLinks[0].classList.add('active');
        }
    }
}


window.addEventListener('scroll', updateActiveLink);
window.addEventListener('DOMContentLoaded', updateActiveLink);











const items = document.querySelectorAll(".scroll-item");
const headingEl = document.getElementById("case-heading");
const textEl = document.getElementById("case-text");
const nextProject = document.querySelector(".next-project");


const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const { heading, text } = entry.target.dataset;
      items.forEach((item) => item.classList.remove("active"));
      entry.target.classList.add("active");

      if (headingEl) headingEl.textContent = heading;
      if (textEl) textEl.innerHTML = text;   
    });
  },
  {
    threshold: window.innerWidth < 768 ? 0.3 : 0.7
  }
);
items.forEach((item) => observer.observe(item));


const pdfItem = Array.from(items).find(i => i.querySelector('img')?.alt === 'Debit Note');
const impactItem = document.querySelector('.scroll-item.impact');

if (pdfItem && impactItem && nextProject) {
  function updateNextProjectVisibility() {
    const pdfRect = pdfItem.getBoundingClientRect();
    const impactRect = impactItem.getBoundingClientRect();

    const passedPDF = pdfRect.top <= window.innerHeight * 0.6;
    const beforeImpactEnd = impactRect.bottom > window.innerHeight * 0.2;

    if (passedPDF && beforeImpactEnd) {
      nextProject.classList.add('show');
    } else {
      nextProject.classList.remove('show');
    }
  }

  updateNextProjectVisibility();
  window.addEventListener('scroll', updateNextProjectVisibility, { passive: true });
  window.addEventListener('resize', updateNextProjectVisibility);
  window.addEventListener('orientationchange', () =>
    setTimeout(updateNextProjectVisibility, 200)
  );
}






 const menuBtn = document.querySelector('.menu-toggle');
  const sideNav = document.querySelector('.side-nav');

  menuBtn.addEventListener('click', () => {
    sideNav.classList.toggle('open');
  });

  document.querySelectorAll('.side-nav a').forEach(link => {
  link.addEventListener('click', () => {
    if (sideNav.classList.contains('open')) {
      sideNav.classList.remove('open');
    }
  });
});



function injectMobileText() {
  if (window.innerWidth >= 768) return; 


  if (!document.querySelector(".scroll-item .case-title")) {
    const firstItem = document.querySelector(".scroll-item");
    const mobileTitle = document.createElement("h1");
    mobileTitle.className = "case-title";
    mobileTitle.textContent = "Project Case Study:";
    mobileTitle.style.fontSize = "clamp(1.6rem, 6vw, 2rem)";
    mobileTitle.style.color = "#ffffffff";
    mobileTitle.style.textAlign = "center";
    firstItem.prepend(mobileTitle);
  }


  document.querySelectorAll(".scroll-item").forEach(item => {
  
    if (item.dataset.mobileInjected === "1") return;

    const headingEl = document.createElement("h2");
    const textEl = document.createElement("p");

    headingEl.className = "mobile-heading";
    textEl.className = "mobile-text";

    headingEl.textContent = item.dataset.heading || "";
    textEl.innerHTML = item.dataset.text || "";


    item.prepend(textEl);
    item.prepend(headingEl);

    item.dataset.mobileInjected = "1";

  });

}


window.addEventListener("load", injectMobileText);
window.addEventListener("orientationchange", () => setTimeout(injectMobileText, 300));
window.addEventListener("resize", () => {

  clearTimeout(window.__mobileInjectTimer);
  window.__mobileInjectTimer = setTimeout(injectMobileText, 150);
});



document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("fade-in");
});


document.querySelectorAll("a[href]").forEach(link => {
  link.addEventListener("click", e => {
    
    if (link.target === "_blank" || link.href.includes("#")) return;

    e.preventDefault();
    document.body.classList.remove("fade-in");
    document.body.style.opacity = "0";
    setTimeout(() => {
      window.location.href = link.href;
    }, 200); 
  });
});


document.getElementById('download-excel').addEventListener('click', function(e) {
  e.preventDefault();
  const link = document.createElement('a');
  link.href = 'medequip.xlsx';      
  link.download = 'medequip.xlsx';  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
