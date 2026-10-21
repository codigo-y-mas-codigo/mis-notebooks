(() => {
  const normalize = (value) => (value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es-MX').trim();
  const textOf = (node) => node ? (node.innerText || node.textContent || '') : '';

  function disableNavigation() {
    document.querySelectorAll('a[aria-label^="Cuenta de Google"], a[aria-label*="Cuenta de Google"]').forEach((link) => {
      link.removeAttribute('href');
      link.setAttribute('aria-disabled', 'true');
      link.addEventListener('click', (event) => event.preventDefault());
    });
    document.querySelectorAll('a, button, [role="menuitem"], [role="button"]').forEach((node) => {
      const label = `${node.getAttribute('aria-label') || ''} ${textOf(node)}`;
      if (/productos/i.test(label)) {
        node.addEventListener('click', (event) => event.preventDefault());
        node.setAttribute('aria-disabled', 'true');
      }
    });
  }

  function linkNotebookToThisPage() {
    document.querySelectorAll('a').forEach((link) => {
      if (/^notebooklm$/i.test(textOf(link).trim()) || /notebooklm/i.test(link.getAttribute('aria-label') || '')) link.href = './todosmisnotebooks.html';
    });
  }

  function addConsecutiveIds() {
    document.querySelectorAll('.project-table-title').forEach((title, index) => {
      if (title.querySelector('.notebook-consecutive')) return;
      const id = document.createElement('span');
      id.className = 'notebook-consecutive';
      id.textContent = String(index + 1);
      id.title = `Notebook ${index + 1}`;
      title.prepend(id);
    });
  }

  function tagsFor(title) {
    const text = normalize(title);
    const rules = [
      ['Tarot y espiritualidad', /tarot|arcano|videncia|esoter|intuici[oó]n|carta/],
      ['Inteligencia artificial', /\bia\b|inteligencia artificial|claude|notebooklm|prompt|midjourney|copiloto|google whisk/],
      ['Marketing y ventas', /marketing|copywriting|seo|linkedin|audiencia|venta|hotmart|substack/],
      ['Diseño y creatividad', /dise[nñ]o|design|visual|ilustr|cartoon|stickers|identidad|arte/],
      ['Formación', /curso|gu[ií]a|manual|fundamentos|competencias|educa/],
      ['Negocios', /negocio|emprend|empresa|financ|estrategia|econom[ií]a/],
      ['Cultura y medios', /cine|pel[ií]cula|canci[oó]n|podcast|narrativa|m[uú]sica/],
      ['Investigación', /psicolog[ií]a|salud|privacidad|privacy|legal|justicia|ciencia|investig/]
    ];
    const tags = rules.filter(([, pattern]) => pattern.test(text)).map(([tag]) => tag);
    return tags.length ? tags : ['Archivo general'];
  }

  function addContentTags() {
    document.querySelectorAll('.project-table-title').forEach((title) => {
      if (title.querySelector('.notebook-tag')) return;
      tagsFor(textOf(title)).forEach((tag) => {
        const label = document.createElement('span');
        label.className = 'notebook-tag';
        label.textContent = tag;
        title.append(' ', label);
      });
    });
  }

  function addBackToTop() {
    if (document.querySelector('.mis-notebooks-back-to-top')) return;
    const button = document.createElement('button');
    button.className = 'mis-notebooks-back-to-top';
    button.type = 'button';
    button.setAttribute('aria-label', 'Volver arriba');
    button.title = 'Volver arriba';
    button.textContent = '↑';
    document.body.append(button);
    const update = () => button.classList.toggle('is-visible', window.scrollY > 500);
    window.addEventListener('scroll', update, { passive: true });
    button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    update();
  }

  function enableSearchAndViews() {
    if (document.querySelector('.mis-notebooks-toolbar')) return;
    const table = document.querySelector('.project-table');
    if (!table) return;
    const toolbar = document.createElement('div');
    toolbar.className = 'mis-notebooks-toolbar';
    const search = document.createElement('label');
    search.className = 'mis-notebooks-search';
    search.innerHTML = '<span aria-hidden="true">⌕</span><input type="search" aria-label="Buscar notebooks" placeholder="Buscar por título, fuente o emoji" autocomplete="off">';
    const list = document.createElement('button');
    list.className = 'mis-notebooks-view'; list.type = 'button'; list.textContent = 'Lista'; list.setAttribute('aria-pressed', 'true');
    const panels = document.createElement('button');
    panels.className = 'mis-notebooks-view'; panels.type = 'button'; panels.textContent = 'Paneles'; panels.setAttribute('aria-pressed', 'false');
    toolbar.append(search, list, panels);
    table.parentElement.insertBefore(toolbar, table);
    const status = document.createElement('div'); status.className = 'mis-notebooks-search-status'; toolbar.insertAdjacentElement('afterend', status);
    const input = search.querySelector('input');
    const rows = () => [...table.querySelectorAll('tbody tr')];
    const filter = () => {
      const query = normalize(input.value); let visible = 0;
      rows().forEach((row) => { const matches = !query || normalize(textOf(row)).includes(query); row.classList.toggle('mis-notebooks-hidden', !matches); if (matches) visible += 1; });
      status.textContent = query ? `${visible} notebook${visible === 1 ? '' : 's'} encontrado${visible === 1 ? '' : 's'}` : '';
    };
    input.addEventListener('input', filter);
    list.addEventListener('click', () => { table.closest('project-table')?.classList.remove('mis-notebooks-panels'); list.setAttribute('aria-pressed','true'); panels.setAttribute('aria-pressed','false'); });
    panels.addEventListener('click', () => { table.closest('project-table')?.classList.add('mis-notebooks-panels'); list.setAttribute('aria-pressed','false'); panels.setAttribute('aria-pressed','true'); });
  }

  function initialize() { disableNavigation(); linkNotebookToThisPage(); addConsecutiveIds(); addContentTags(); enableSearchAndViews(); addBackToTop(); }
  document.addEventListener('DOMContentLoaded', initialize, { once:true });
  window.addEventListener('load', initialize, { once:true });
})();
