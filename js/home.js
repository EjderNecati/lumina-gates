// Home page logic — render product grid, hero, filters using real photos

(function () {
  const { PRODUCTS, computePrice, imagePath } = window.LUMINA;
  const I18N = window.LUMINA_I18N;
  const t = (k) => I18N.t(k);

  // Hero — flagship visual (Lux is our most photographed wood gate)
  const hero = document.getElementById('heroVisual');
  if (hero) {
    const flagship = PRODUCTS.find(p => p.id === 'lux') || PRODUCTS[0];
    hero.innerHTML = `<img src="${imagePath(flagship, 0)}" alt="${flagship.name}" loading="eager" />`;
  }

  let currentFilter = 'all';

  // Build product cards
  const grid = document.getElementById('productGrid');
  function renderGrid(filter = currentFilter) {
    currentFilter = filter;
    grid.innerHTML = '';
    const filtered = PRODUCTS.filter(p => {
      if (filter === 'all') return true;
      if (filter === 'plexi') return p.material === 'plexi';
      if (filter === 'wood')  return p.material === 'wood';
      if (filter === 'cat')   return p.audience === 'cat';
      return true;
    });

    const lang = I18N.lang;

    filtered.forEach((p) => {
      const pricing = computePrice(p.material, 18, window.LUMINA.DEFAULT_HEIGHT_INCH);
      const img1 = imagePath(p, 0);
      const img2 = imagePath(p, 1);
      const tagline = (lang === 'tr' && p.tagline_tr) ? p.tagline_tr : p.tagline;
      const audienceLabel = p.audience === 'cat' ? t('card.cat') : t('card.both');
      const materialLabel = p.material === 'plexi' ? t('card.plexi') : t('card.wood');
      const collectionLabel = p.material === 'plexi' ? t('filter.plexi') : t('filter.wood');

      const card = document.createElement('a');
      card.href = `product.html?id=${p.id}`;
      card.className = 'card';
      card.innerHTML = `
        <div class="card-media">
          <span class="card-badge">${collectionLabel}</span>
          <span class="card-sale sale-pill">${t('card.sale')}</span>
          <img class="card-img card-img-a" src="${img1}" alt="${p.name}" loading="lazy" />
          <img class="card-img card-img-b" src="${img2}" alt="${p.name}" loading="lazy" />
        </div>
        <div class="card-body">
          <div class="card-meta">
            <span class="eyebrow">${audienceLabel}</span>
            <span class="dot"></span>
            <span class="eyebrow">${materialLabel}</span>
          </div>
          <h3>${p.name}</h3>
          <p class="card-tagline">${tagline}</p>
          <div class="card-price">
            <span class="from">${t('card.from')}</span>
            <span class="was">$${pricing.original.toFixed(0)}</span>
            <span class="now">$${pricing.final.toFixed(0)}</span>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }
  renderGrid();

  // Filter chips
  document.querySelectorAll('#filters .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#filters .chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderGrid(chip.dataset.filter);
    });
  });

  // Footer quick-jump filter
  document.querySelectorAll('[data-jump]').forEach(a => {
    a.addEventListener('click', () => {
      const t = a.dataset.jump;
      const chip = document.querySelector(`#filters .chip[data-filter="${t}"]`);
      if (chip) chip.click();
    });
  });

  // Re-render cards when language changes
  window.addEventListener('lumina:langchange', () => renderGrid());
})();
