// Страница проектов как сеанс в консоли.
// Команды можно вводить руками или нажимать подсказки под строкой.

import { projects } from './projects-data.js';

const screen = document.getElementById('term-screen');
const input = document.getElementById('term-input');
const form = document.getElementById('term-form');
const hints = document.getElementById('term-hints');

if (screen && input && form) {
  const esc = t => String(t)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const byId = id => projects.find(p => p.id === id);
  const ids = projects.map(p => p.id);

  // ── вывод ──────────────────────────────────────────────

  function write(html, cls = '') {
    const block = document.createElement('div');
    block.className = 'term-block' + (cls ? ' ' + cls : '');
    block.innerHTML = html;
    screen.appendChild(block);
    screen.scrollTop = screen.scrollHeight;
  }

  const line = (text, cls = '') => `<div class="term-line${cls ? ' ' + cls : ''}">${text}</div>`;

  const pair = (key, value) =>
    `<div class="term-pair"><span class="term-key">${esc(key)}</span><span>${value}</span></div>`;

  function echo(command) {
    write(`<div class="term-echo"><span class="term-prompt">$</span> ${esc(command)}</div>`);
  }

  // ── команды ────────────────────────────────────────────

  function cmdHelp() {
    write(
      line('доступные команды:') +
      pair('list', 'список проектов') +
      pair('show <id>', 'подробности про один') +
      pair('open <id>', 'открыть ссылку проекта') +
      pair('clear', 'очистить экран') +
      pair('help', 'вот это') +
      line('стрелки вверх и вниз листают историю, Tab дополняет имя.', 'is-dim')
    );
  }

  function cmdList() {
    const rows = projects.map((p, i) => {
      const tags = [...p.tags, p.status.label].join(' · ');
      return `<button class="term-item" type="button" data-show="${esc(p.id)}">
          <span class="term-index">[${i + 1}]</span>
          <span class="term-id">${esc(p.id)}</span>
          <span class="term-tags is-${esc(p.status.tone)}">${esc(tags)}</span>
        </button>`;
    }).join('');
    write(`<div class="term-list">${rows}</div>` +
      line(`всего ${projects.length}. подробности: show &lt;id&gt;`, 'is-dim'));
  }

  function cmdShow(id) {
    const p = byId(id);
    if (!p) return notFound(id);

    const facts = p.facts.map(([k, v]) => pair(k, esc(v))).join('');
    const body = p.lines.map(t => line(esc(t), 'is-text')).join('');
    const note = p.note ? line(esc(p.note), 'is-note') : '';
    const links = p.links.length
      ? `<div class="term-links">` + p.links.map(l =>
          `<a href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join('') + `</div>`
      : line('ссылок нет', 'is-dim');

    write(
      `<div class="term-head"><span class="term-name">${esc(p.name)}</span>` +
      `<span class="term-badge is-${esc(p.status.tone)}">${esc(p.status.label)}</span></div>` +
      facts + body + note + links
    );
  }

  function cmdOpen(id) {
    const p = byId(id);
    if (!p) return notFound(id);
    if (!p.links.length) return write(line(`у проекта ${esc(id)} нет ссылок`, 'is-warn'));
    window.open(p.links[0].href, '_blank', 'noopener');
    write(line(`открываю ${esc(p.links[0].label)}…`, 'is-dim'));
  }

  function notFound(id) {
    write(
      line(`нет такого проекта: ${esc(id || '(пусто)')}`, 'is-warn') +
      line(`есть: ${ids.join(', ')}`, 'is-dim')
    );
  }

  function run(raw) {
    const text = raw.trim();
    if (!text) return;

    echo(text);
    const [cmd, ...rest] = text.split(/\s+/);
    const arg = rest.join(' ');

    switch (cmd.toLowerCase()) {
      case 'help': case '?': cmdHelp(); break;
      case 'list': case 'ls': cmdList(); break;
      case 'show': case 'cat': cmdShow(arg); break;
      case 'open': cmdOpen(arg); break;
      case 'clear': screen.replaceChildren(); break;
      case 'whoami': write(line('вирус. бездарь за 100 рублей.')); break;
      default:
        write(
          line(`неизвестная команда: ${esc(cmd)}`, 'is-warn') +
          line('help покажет список', 'is-dim')
        );
    }
  }

  // ── история ввода ──────────────────────────────────────

  const history = [];
  let cursor = 0;

  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      if (!history.length) return;
      e.preventDefault();
      cursor += e.key === 'ArrowUp' ? -1 : 1;
      cursor = Math.max(0, Math.min(history.length, cursor));
      input.value = history[cursor] || '';
      input.setSelectionRange(input.value.length, input.value.length);
      return;
    }

    if (e.key === 'Tab') {
      // дополняем имя проекта после show/open
      const m = input.value.match(/^(\s*(?:show|open|cat)\s+)(\S*)$/i);
      if (!m) return;
      const match = ids.find(id => id.startsWith(m[2].toLowerCase()));
      if (!match) return;
      e.preventDefault();
      input.value = m[1] + match;
    }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const text = input.value;
    if (text.trim()) {
      history.push(text.trim());
      cursor = history.length;
    }
    run(text);
    input.value = '';
  });

  // клик по строке списка и по подсказкам
  document.addEventListener('click', e => {
    const item = e.target.closest('[data-show]');
    if (item) { run('show ' + item.dataset.show); input.focus(); return; }
    const hint = e.target.closest('[data-cmd]');
    if (hint) { run(hint.dataset.cmd); input.focus(); }
  });

  // клик по пустому месту экрана ставит курсор в строку ввода
  screen.addEventListener('click', e => {
    if (e.target.closest('a, button')) return;
    if (!window.getSelection().toString()) input.focus();
  });

  // ── стартовый вывод ────────────────────────────────────

  write(line(`virus projects — ${projects.length} записи. help покажет команды.`, 'is-dim'));
  run('list');

  if (hints) {
    hints.hidden = false;
    hints.innerHTML = ['help', 'list', ...ids.map(id => 'show ' + id), 'clear']
      .map(c => `<button class="term-hint" type="button" data-cmd="${esc(c)}">${esc(c)}</button>`)
      .join('');
  }
}
