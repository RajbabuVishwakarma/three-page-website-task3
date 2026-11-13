// Apply the saved theme immediately (runs in <head>, so there is no flash)
const root = document.documentElement;
try { root.dataset.theme = localStorage.getItem('theme') || 'light'; } catch (e) { root.dataset.theme = 'light'; }

document.addEventListener('DOMContentLoaded', () => {
  // ----- Light / Dark toggle -----
  const themeBtn = document.getElementById('theme');
  const syncIcon = () => { themeBtn.textContent = root.dataset.theme === 'dark' ? '☀️' : '🌙'; };
  syncIcon();
  themeBtn.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
    syncIcon();
  });

  // ----- Hamburger menu -----
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');
  const setMenu = open => {
    menu.classList.toggle('open', open);
    burger.classList.toggle('x', open);
    burger.setAttribute('aria-expanded', open);
  };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  // ----- Contact form validation (only on the Contact page) -----
  const form = document.getElementById('form');
  if (!form) return;
  const success = document.getElementById('ok');
  const rules = {
    name: v => v.trim().length < 3 ? 'Enter your name (at least 3 characters).' : '',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter a valid email, like name@example.com.',
    message: v => v.trim().length < 10 ? 'Write a message of at least 10 characters.' : ''
  };
  const fields = [...form.querySelectorAll('input, textarea')];
  const check = el => {
    const msg = rules[el.name](el.value);
    el.setAttribute('aria-invalid', !!msg);
    el.nextElementSibling.textContent = msg;
    return !msg;
  };
  fields.forEach(el => {
    el.addEventListener('blur', () => { el.dataset.touched = 1; check(el); });
    el.addEventListener('input', () => { success.hidden = true; if (el.dataset.touched) check(el); });
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const valid = fields.map(el => { el.dataset.touched = 1; return check(el); }).every(Boolean);
    success.hidden = !valid;
    if (valid) {
      form.reset();
      fields.forEach(el => { delete el.dataset.touched; el.removeAttribute('aria-invalid'); });
    }
  });
});
