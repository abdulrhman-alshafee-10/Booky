export function initFilterLists() {
  initFaqSearch();
  initEventFilter();
  initStoreSearch();
}

function initFaqSearch() {
  const input = document.querySelector('[data-faq-search]');
  if (!input) return;

  const items = Array.from(document.querySelectorAll('[data-faq-item]'));
  const groups = Array.from(document.querySelectorAll('[data-faq-group]'));
  const empty = document.getElementById('faq-empty');

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    let visible = 0;

    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      const match = !q || text.includes(q);
      item.hidden = !match;
      if (match) visible++;
    });

    groups.forEach(group => {
      const anyVisible = Array.from(group.querySelectorAll('[data-faq-item]')).some(i => !i.hidden);
      group.hidden = !anyVisible;
    });

    if (empty) empty.classList.toggle('hidden', visible > 0);
  });
}

function initEventFilter() {
  const chips = Array.from(document.querySelectorAll('[data-event-filter]'));
  if (!chips.length) return;

  const items = Array.from(document.querySelectorAll('[data-event-tags]'));
  const empty = document.getElementById('events-empty');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => { c.classList.remove('is-active'); c.setAttribute('aria-pressed', 'false'); });
      chip.classList.add('is-active');
      chip.setAttribute('aria-pressed', 'true');

      const filter = chip.dataset.eventFilter;
      let visible = 0;

      items.forEach(item => {
        const tags = item.dataset.eventTags ?? '';
        const match = filter === 'all' || tags.includes(filter);
        item.hidden = !match;
        if (match) visible++;
      });

      if (empty) empty.classList.toggle('hidden', visible > 0);
    });
  });
}

function initStoreSearch() {
  const input = document.querySelector('[data-store-search]');
  if (!input) return;

  const cards = Array.from(document.querySelectorAll('[data-store-city]'));
  const empty = document.getElementById('store-empty');

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    let visible = 0;

    cards.forEach(card => {
      const city = (card.dataset.storeCity ?? '').toLowerCase();
      const name = (card.dataset.storeName ?? '').toLowerCase();
      const match = !q || city.includes(q) || name.includes(q);
      card.hidden = !match;
      if (match) visible++;
    });

    if (empty) empty.classList.toggle('hidden', visible > 0);
  });
}
