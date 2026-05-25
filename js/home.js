// Home page logic — render product grid, hero, filters using real photos

(function () {
  const { PRODUCTS, computePrice, imagePath } = window.LUMINA;

  // Hero — flagship visual (Lux is our most photographed wood gate)
  const hero = document.getElementById('heroVisual');
  if (hero) {
    const flagship = PRODUCTS.find(p => p.id === 'lux') || PRODUCTS[0];
    hero.innerHTML = `<img src="${imagePath(flagship, 0)}" alt="${flagship.name}" loading="eager" />`;
  }

  // Build product cards
  const grid = document.getElementById('productGrid');
  function renderGrid(filter = 'all') {
    grid.innerHTML = '';
    const filtered = PRODUCTS.filter(p => {
      if (filter === 'all') return true;
      if (filter === 'plexi') return p.material === 'plexi';
      if (filter === 'wood')  return p.material === 'wood';
      if (filter === 'cat')   return p.audience === 'cat';
      return true;
    });

    filtered.forEach((p) => {
      // From-price: 50% of the 12-18 tier (representative)
      const pricing = computePrice(p.material, 18, window.LUMINA.DEFAULT_HEIGHT_INCH);
      const img1 = imagePath(p, 0);
      const img2 = imagePath(p, 1);
      const card = document.createElement('a');
      card.href = `product.html?id=${p.id}`;
      card.className = 'card';
      card.innerHTML = `
        <div class="card-media">
          <span class="card-badge">${p.collection}</span>
          <span class="card-sale sale-pill">50% off</span>
          <img class="card-img card-img-a" src="${img1}" alt="${p.name}" loading="lazy" />
          <img class="card-img card-img-b" src="${img2}" alt="${p.name}" loading="lazy" />
        </div>
        <div class="card-body">
          <div class="card-meta">
            <span class="eyebrow">${p.audience === 'cat' ? 'Cat Edition' : 'Child & Pet'}</span>
            <span class="dot"></span>
            <span class="eyebrow">${p.material === 'plexi' ? 'Plexiglass' : 'Solid Oak'}</span>
          </div>
          <h3>${p.name}</h3>
          <p class="card-tagline">${p.tagline}</p>
          <div class="card-price">
            <span class="from">From</span>
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
})();
