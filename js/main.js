// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

// Close nav on link click (mobile)
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Q&A accordion
document.querySelectorAll('.qa-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.qa-item');
    item.classList.toggle('open');
  });
});

// Q&A form submission (static — shows thank you message)
const qaForm = document.getElementById('qaForm');
if (qaForm) {
  qaForm.addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('submittedMsg').style.display = 'block';
    qaForm.reset();
  });
}

// Contact form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('contactMsg').style.display = 'block';
    contactForm.reset();
  });
}
