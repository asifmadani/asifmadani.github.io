// ============================================================
// MOBILE NAV TOGGLE
// ============================================================
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

if (navToggle) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
}
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks && navLinks.classList.remove('open'));
});

// ============================================================
// LANGUAGE SWITCHER (controls Google Translate)
// ============================================================
const LANGUAGES = [
  { code: 'en',    label: 'English',       native: 'English',       dir: 'ltr' },
  { code: 'ur',    label: 'Urdu',          native: 'اردو',          dir: 'rtl' },
  { code: 'ar',    label: 'Arabic',        native: 'العربية',       dir: 'rtl' },
  { code: 'hi',    label: 'Hindi',         native: 'हिन्दी',         dir: 'ltr' },
  { code: 'kn',    label: 'Kannada',       native: 'ಕನ್ನಡ',          dir: 'ltr' },
  { code: 'bn',    label: 'Bengali',       native: 'বাংলা',          dir: 'ltr' },
  { code: 'ta',    label: 'Tamil',         native: 'தமிழ்',          dir: 'ltr' },
  { code: 'te',    label: 'Telugu',        native: 'తెలుగు',         dir: 'ltr' },
  { code: 'mr',    label: 'Marathi',       native: 'मराठी',          dir: 'ltr' },
  { code: 'gu',    label: 'Gujarati',      native: 'ગુજરાતી',        dir: 'ltr' },
  { code: 'pa',    label: 'Punjabi',       native: 'ਪੰਜਾਬੀ',         dir: 'ltr' },
  { code: 'ml',    label: 'Malayalam',     native: 'മലയാളം',         dir: 'ltr' },
  { code: 'or',    label: 'Odia',          native: 'ଓଡ଼ିଆ',           dir: 'ltr' },
  { code: 'as',    label: 'Assamese',      native: 'অসমীয়া',         dir: 'ltr' },
  { code: 'sd',    label: 'Sindhi',        native: 'سنڌي',           dir: 'rtl' },
  { code: 'ps',    label: 'Pashto',        native: 'پښتو',           dir: 'rtl' },
  { code: 'fa',    label: 'Persian',       native: 'فارسی',          dir: 'rtl' },
];

let currentLang = localStorage.getItem('siteLang') || 'en';

function buildLangDropdown() {
  const btn   = document.getElementById('langBtn');
  const panel = document.getElementById('langDropdown');
  if (!btn || !panel) return;

  panel.innerHTML = LANGUAGES.map(l => `
    <button class="lang-option ${l.code === currentLang ? 'active' : ''}"
            data-code="${l.code}" data-dir="${l.dir}">
      <span class="lang-native">${l.native}</span>
      <span class="lang-english">${l.label}</span>
    </button>
  `).join('');

  const cur = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];
  btn.innerHTML = `🌐 <span>${cur.native}</span>`;

  panel.querySelectorAll('.lang-option').forEach(opt => {
    opt.addEventListener('click', () => {
      currentLang = opt.dataset.code;
      localStorage.setItem('siteLang', currentLang);
      applyLanguage(currentLang, opt.dataset.dir);
      panel.classList.remove('open');
      buildLangDropdown();
    });
  });

  btn.addEventListener('click', e => {
    e.stopPropagation();
    panel.classList.toggle('open');
  });
  document.addEventListener('click', () => panel.classList.remove('open'));
}

function applyLanguage(code, dir) {
  if (code === 'en') {
    // Restore original English — reload without translate cookie
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
    document.documentElement.dir = 'ltr';
    window.location.reload();
    return;
  }

  document.documentElement.dir = dir || 'ltr';

  // Set Google Translate cookie
  const d = window.location.hostname;
  document.cookie = `googtrans=/en/${code}; path=/`;
  document.cookie = `googtrans=/en/${code}; path=/; domain=${d}`;

  // Try to use the hidden Google Translate select
  const sel = document.querySelector('.goog-te-combo');
  if (sel) {
    sel.value = code;
    sel.dispatchEvent(new Event('change'));
  } else {
    window.location.reload();
  }
}

function initLanguage() {
  buildLangDropdown();
  if (currentLang && currentLang !== 'en') {
    const lang = LANGUAGES.find(l => l.code === currentLang);
    document.documentElement.dir = lang ? lang.dir : 'ltr';
  }
}

window.addEventListener('DOMContentLoaded', initLanguage);

// ============================================================
// Q&A ACCORDION
// ============================================================
document.querySelectorAll('.qa-question').forEach(btn => {
  btn.addEventListener('click', () => btn.closest('.qa-item').classList.toggle('open'));
});

// ============================================================
// Q&A FORM → TELEGRAM BOT
// ============================================================
// SETUP INSTRUCTIONS:
// 1. Open Telegram, search @BotFather and type /newbot
// 2. Give it any name, get the bot TOKEN
// 3. Add that bot to your group/channel as admin
// 4. Get chat ID: message @userinfobot inside the group OR
//    visit https://api.telegram.org/bot<TOKEN>/getUpdates after sending a message
// 5. Replace YOUR_BOT_TOKEN and YOUR_CHAT_ID below

const TG_TOKEN   = '8994196600:AAFxPuqsWuvZuVcwqvd6rdbO6EfVw-XDwRE';
const TG_CHAT_ID = '-1003936101148';

async function sendToTelegram(name, category, email, question) {
  // Plain text only — no parse_mode to avoid Markdown errors from user input
  const text =
    `🕌 New Question — Sheikh Asif Madani Website\n` +
    `─────────────────────────\n` +
    `👤 Name: ${name}\n` +
    `📂 Category: ${category || 'General'}\n` +
    `📧 Email: ${email || 'Not provided'}\n` +
    `─────────────────────────\n` +
    `❓ Question:\n${question}`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TG_CHAT_ID, text }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('Telegram error:', err);
    }
    return res.ok;
  } catch (e) {
    console.error('Telegram fetch error:', e);
    return false;
  }
}

const qaForm = document.getElementById('qaForm');
if (qaForm) {
  qaForm.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = qaForm.querySelector('.form-submit');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    const name     = qaForm.querySelector('#name').value.trim();
    const email    = qaForm.querySelector('#email').value.trim();
    const category = qaForm.querySelector('#category').value;
    const question = qaForm.querySelector('#question').value.trim();

    const ok = await sendToTelegram(name, category, email, question);
    const msg = document.getElementById('submittedMsg');

    if (ok) {
      msg.style.display = 'block';
      msg.style.background = '#e8f5e9';
      msg.style.color = '#2e7d32';
      msg.textContent = '✅ JazakAllahu Khayran! Your question has been sent. Please allow some time for a response.';
    } else {
      msg.style.display = 'block';
      msg.style.background = '#fff3e0';
      msg.style.color = '#e65100';
      msg.textContent = '⚠️ Could not send right now. Please try again or contact via Telegram directly.';
    }
    qaForm.reset();
    btn.textContent = 'Submit Question ➜';
    btn.disabled = false;
  });
}

// ============================================================
// CONTACT FORM
// ============================================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('contactMsg').style.display = 'block';
    contactForm.reset();
  });
}
