/* =====================================================================
   js/terminal.js  —  the mini terminal on code.html only.
   Load it AFTER main.js on code.html:
     <script src="js/main.js"></script>
     <script src="js/terminal.js"></script>
   ===================================================================== */
(function () {
  'use strict';

  const body  = document.getElementById('termBody');
  const input = document.getElementById('termInput');
  if (!body || !input) return;

  const PAGES = ['about', 'code', 'music', 'books', 'travel', 'photos', 'films', 'contact'];

  /* Each command returns text, OR { text, href } to print a clickable link.
     Edit the words freely. REPLACE-USERNAME must become your real GitHub name. */
  const commands = {
    help:        () => 'commands: about, skills, projects, cv, github, contact, music, books, travel, photography, coffee, ls, open <page>, clear',
    about:       () => 'third-year software engineering student, Sichuan University · from Morocco, based in China.',
    skills:      () => 'Python · JavaScript · HTML/CSS · Git & GitHub · REST APIs · Cloudflare Workers',
    projects:    () => ({ text: 'see the projects section below ↓', href: '#projects' }),
    cv:          () => ({ text: 'download my CV (PDF)', href: 'files/Salma-Choukrallah-CV.pdf' }),
    github:      () => ({ text: 'github.com/REPLACE-USERNAME', href: 'https://github.com/REPLACE-USERNAME' }),
    contact:     () => ({ text: 'go to the contact page', href: 'contact.html' }),
    music:       () => ({ text: 'open the music page', href: 'music.html' }),
    books:       () => 'favorite book ever: Tuesdays with Morrie by Mitch Albom.',
    travel:      () => 'i wanna travel the whole world.',
    photography: () => ({ text: 'open the photos page', href: 'photos.html' }),
    coffee:      () => 'dark, less less less sugar, probably a third cup today.',
    ls:          () => PAGES.join('   ')
  };

  function print(content) {
    const line = document.createElement('div');
    if (content && typeof content === 'object') {
      const a = document.createElement('a');
      a.href = content.href;
      a.textContent = content.text;
      if (/^https?:/.test(content.href)) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
      line.appendChild(a);
    } else {
      line.textContent = content;          // textContent: never runs typed text as HTML
    }
    body.appendChild(line);
    body.scrollTop = body.scrollHeight;
  }

  function run(raw) {
    const text = raw.trim();
    if (!text) return;
    print('salma@world:~$ ' + text);

    const parts = text.toLowerCase().split(/\s+/);
    const cmd = parts[0];

    if (cmd === 'clear') { body.textContent = ''; return; }

    if (cmd === 'open') {
      if (PAGES.includes(parts[1])) {
        print('opening ' + parts[1] + '…');
        window.location.href = parts[1] + '.html';
      } else {
        print("usage: open <page> — type 'ls' to see the pages");
      }
      return;
    }

    // hasOwnProperty: so typing "constructor" or "toString" is "not found", not a crash
    if (Object.prototype.hasOwnProperty.call(commands, cmd)) {
      print(commands[cmd]());
    } else {
      print('command not found: ' + cmd + " — try 'help'");
    }
  }

  /* Arrow up / down walks through earlier commands */
  const history = [];
  let pos = 0;
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const value = input.value;
      if (value.trim()) { history.push(value); pos = history.length; }
      run(value);
      input.value = '';
    } else if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault();
      pos = Math.max(0, pos - 1);
      input.value = history[pos];
    } else if (e.key === 'ArrowDown' && history.length) {
      e.preventDefault();
      pos = Math.min(history.length, pos + 1);
      input.value = pos === history.length ? '' : history[pos];
    }
  });

  /* Click anywhere on the terminal to start typing */
  const terminal = document.querySelector('.terminal');
  if (terminal) terminal.addEventListener('click', () => input.focus());
})();
