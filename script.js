const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

// Rotating role text
const role=document.getElementById('role');
if(role&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  const roles=role.dataset.roles.split('|');let r=0,i=0,del=false;
  (function tick(){
    const w=roles[r];i+=del?-1:1;role.textContent=w.slice(0,i);
    let t=del?35:70;
    if(!del&&i===w.length){del=true;t=1400}else if(del&&i===0){del=false;r=(r+1)%roles.length;t=300}
    setTimeout(tick,t);
  })();
}
// Fade sections in, and highlight the current nav link
if('IntersectionObserver' in window){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll('main .section:not(.hero)').forEach(el=>{el.classList.add('reveal');io.observe(el)});
  const links=[...document.querySelectorAll('.nav a[href^="#"]')];
  const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
  document.querySelectorAll('main section[id]').forEach(el=>so.observe(el));
}

// ---------- Interactive terminal ----------
(() => {
  const out = document.getElementById('termOut'), form = document.getElementById('termForm'), input = document.getElementById('termIn');
  if (!out || !form || !input) return;
  const GH = 'https://github.com/jamdadeshubham437-glitch';
  const cmds = {
    help: () => ['Available commands:', '  about  skills  projects  experience', '  education  contact  resume  clear'],
    about: () => ['Shubham Jamdade, Python developer in Hyderabad.', 'I build backend apps and test automation with Python,', 'Django, REST APIs, SQL and PyTest.'],
    skills: () => ['Languages   Python, SQL, JavaScript, HTML, CSS', 'Backend     Django, REST API fundamentals', 'Testing     PyTest, Python automation', 'Tools       Git, GitHub, VS Code'],
    projects: () => [['1. Python RTL Automation Suite', GH], ['2. Mood Expense Tracker', GH + '/mood-expense-tracker'], ['3. Developer Portfolio', GH + '/Shubham-Python-developer-portfolio']],
    experience: () => ['Customer Support Executive, GJ Solutions', 'Aug 2024 - May 2025', 'Hardware diagnostics and telemetry analysis.'],
    education: () => ['BSc Computer Science', 'Modern College of Computer Science and IT', 'Expected 2027'],
    contact: () => ['Phone     +91 97303 99586', 'Location  Hyderabad, India', ['LinkedIn  linkedin.com/in/shubham-jamdade', 'https://www.linkedin.com/in/shubham-jamdade'], ['GitHub    github.com/jamdadeshubham437-glitch', GH]],
    resume: () => {
      const a = document.createElement('a'); a.href = 'Shubham-Jamdade-Resume.pdf'; a.download = 'Shubham-Jamdade-Resume.pdf';
      document.body.append(a); a.click(); a.remove();
      return ['Downloading Shubham-Jamdade-Resume.pdf ...'];
    },
    clear: () => { out.textContent = ''; return []; }
  };
  const history = []; let h = 0;
  function print(item, cls) {
    const d = document.createElement('div');
    if (Array.isArray(item)) {
      const a = document.createElement('a'); a.href = item[1]; a.target = '_blank'; a.rel = 'noreferrer'; a.textContent = item[0]; d.append(a);
    } else d.textContent = item;
    if (cls) d.className = cls;
    out.append(d); out.scrollTop = out.scrollHeight;
  }
  function run(raw) {
    const cmd = raw.trim().toLowerCase(); if (!cmd) return;
    print('$ ' + cmd, 'cmd');
    if (cmds[cmd]) cmds[cmd]().forEach(l => print(l));
    else print('command not found: ' + cmd + '. Type help.', 'dim');
  }
  print('Welcome. Type help or tap a command below.', 'dim');
  form.addEventListener('submit', e => { e.preventDefault(); if (input.value.trim()) { history.push(input.value); h = history.length; } run(input.value); input.value = ''; });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' && history.length) { e.preventDefault(); h = Math.max(0, h - 1); input.value = history[h]; }
    if (e.key === 'ArrowDown' && history.length) { e.preventDefault(); h = Math.min(history.length, h + 1); input.value = history[h] || ''; }
  });
  document.querySelectorAll('.term-hints button').forEach(b => b.addEventListener('click', () => run(b.dataset.cmd)));
  out.addEventListener('click', () => input.focus({ preventScroll: true }));
})();

// ---------- Scroll progress ----------
(() => {
  const bar = document.getElementById('progress'); if (!bar) return;
  const update = () => { const m = document.documentElement.scrollHeight - innerHeight; bar.style.width = (m > 0 ? scrollY / m * 100 : 0) + '%'; };
  addEventListener('scroll', update, { passive: true }); update();
})();

// ---------- Presentation mode (arrow keys step through sections) ----------
(() => {
  const root = document.documentElement, btn = document.getElementById('presentBtn'), bar = document.getElementById('presentBar'), count = document.getElementById('presentCount');
  const secs = [...document.querySelectorAll('main > section')];
  if (!btn || !bar || !secs.length) return;
  const current = () => { let best = 0, d = Infinity; secs.forEach((s, i) => { const t = Math.abs(s.getBoundingClientRect().top); if (t < d) { d = t; best = i; } }); return best; };
  const label = () => { count.textContent = (current() + 1) + ' / ' + secs.length; };
  const go = i => { secs[Math.max(0, Math.min(secs.length - 1, i))].scrollIntoView({ behavior: 'smooth' }); };
  const on = () => { root.classList.add('present'); bar.hidden = false; go(0); setTimeout(label, 50); };
  const off = () => { root.classList.remove('present'); bar.hidden = true; };
  btn.addEventListener('click', on);
  bar.addEventListener('click', e => { const a = e.target.dataset.p; if (a === 'next') go(current() + 1); else if (a === 'prev') go(current() - 1); else if (a === 'exit') off(); });
  addEventListener('scroll', () => { if (!bar.hidden) label(); }, { passive: true });
  addEventListener('keydown', e => {
    if (bar.hidden || /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); go(current() + 1); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); go(current() - 1); }
    else if (e.key === 'Escape') off();
  });
})();
