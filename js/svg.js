// SVG illustrations for each gate style. Color reflects user's selected finish.

function gateSVG(style, colorHex, opts = {}) {
  const w = opts.w || 360;
  const h = opts.h || 440;
  const bg = opts.bg || '#F6F2EA';
  const c = colorHex || '#2F343A';
  const isLight = ['#F7F5F0', '#E2CFA8'].includes(c);
  const stroke = isLight ? '#1a1a1a22' : '#00000022';

  const frame = (inner) => `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="bg-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${bg}" />
          <stop offset="100%" stop-color="${shade(bg, -6)}" />
        </linearGradient>
        <linearGradient id="floor-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${shade(bg, -10)}" />
          <stop offset="100%" stop-color="${shade(bg, -22)}" />
        </linearGradient>
        <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${shade(c, 18)}" />
          <stop offset="100%" stop-color="${shade(c, -12)}" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#bg-grad)" />
      <rect x="0" y="${h*0.78}" width="${w}" height="${h*0.22}" fill="url(#floor-grad)" />
      ${inner}
    </svg>`;

  const gx = w*0.18, gy = h*0.18, gw = w*0.64, gh = h*0.60;

  const plexiPanel = (innerPattern = '') => `
    <rect x="${gx-2}" y="${gy-2}" width="${gw+4}" height="${gh+4}" rx="4"
      fill="${c}" opacity="0.95" />
    <rect x="${gx+6}" y="${gy+6}" width="${gw-12}" height="${gh-12}" rx="2"
      fill="${isLight ? '#ffffff55' : '#ffffff22'}" />
    ${innerPattern}
    <rect x="${gx-2}" y="${gy-2}" width="${gw+4}" height="${gh+4}" rx="4"
      fill="none" stroke="${stroke}" stroke-width="1" />`;

  const woodPanel = (innerPattern = '') => `
    <rect x="${gx}" y="${gy}" width="${gw}" height="${gh}" rx="3"
      fill="${c}" />
    ${innerPattern}
    <rect x="${gx}" y="${gy}" width="${gw}" height="${gh}" rx="3"
      fill="none" stroke="${shade(c, -25)}" stroke-width="1.2" />`;

  // shadow
  const shadow = `<ellipse cx="${w/2}" cy="${gy+gh+8}" rx="${gw*0.42}" ry="6" fill="#00000022"/>`;

  switch (style) {
    case 'plexi-cat': {
      // shorter gate
      const gy2 = h*0.42, gh2 = h*0.36;
      return frame(`
        <ellipse cx="${w/2}" cy="${gy2+gh2+8}" rx="${gw*0.42}" ry="6" fill="#00000022"/>
        <rect x="${gx-2}" y="${gy2-2}" width="${gw+4}" height="${gh2+4}" rx="4" fill="${c}" opacity="0.95"/>
        <rect x="${gx+6}" y="${gy2+6}" width="${gw-12}" height="${gh2-12}" rx="2" fill="${isLight ? '#ffffff55' : '#ffffff22'}"/>
        <rect x="${gx-2}" y="${gy2-2}" width="${gw+4}" height="${gh2+4}" rx="4" fill="none" stroke="${stroke}"/>
      `);
    }
    case 'plexi-frame':
      return frame(shadow + plexiPanel(`
        <rect x="${gx+10}" y="${gy+10}" width="${gw-20}" height="${gh-20}" rx="2"
          fill="none" stroke="${shade(c,-15)}" stroke-width="2"/>
      `));
    case 'plexi-full':
      return frame(shadow + plexiPanel(''));
    case 'plexi-bars': {
      let bars = '';
      const n = 5;
      for (let i = 1; i <= n; i++) {
        const x = gx + (gw/(n+1))*i - 3;
        bars += `<rect x="${x}" y="${gy+10}" width="6" height="${gh-20}" rx="2" fill="url(#metal)"/>`;
      }
      return frame(shadow + plexiPanel(bars));
    }
    case 'plexi-etched': {
      // diamond etch pattern
      let pattern = '';
      const cols = 6, rows = 6;
      for (let i = 0; i < cols; i++)
        for (let j = 0; j < rows; j++) {
          const x = gx + 18 + (gw-36)/cols * i + (gw-36)/cols/2;
          const y = gy + 18 + (gh-36)/rows * j + (gh-36)/rows/2;
          pattern += `<circle cx="${x}" cy="${y}" r="1.6" fill="${isLight ? '#00000033' : '#ffffff55'}"/>`;
        }
      // central monogram
      pattern += `<text x="${w/2}" y="${gy+gh/2+6}" text-anchor="middle"
        font-family="Cormorant Garamond, serif" font-size="${gw*0.22}"
        fill="${isLight ? '#00000022' : '#ffffff33'}">L</text>`;
      return frame(shadow + plexiPanel(pattern));
    }
    case 'plexi-bifold': {
      const half = gw/2;
      return frame(`
        ${shadow}
        <rect x="${gx-2}" y="${gy-2}" width="${half+2}" height="${gh+4}" rx="3" fill="${c}" opacity="0.95"/>
        <rect x="${gx+6}" y="${gy+6}" width="${half-14}" height="${gh-12}" fill="${isLight ? '#ffffff55' : '#ffffff22'}"/>
        <rect x="${gx+half-2}" y="${gy-2}" width="${half+2}" height="${gh+4}" rx="3" fill="${shade(c,-8)}" opacity="0.95"/>
        <rect x="${gx+half+6}" y="${gy+6}" width="${half-14}" height="${gh-12}" fill="${isLight ? '#ffffff55' : '#ffffff22'}"/>
        <line x1="${gx+half}" y1="${gy}" x2="${gx+half}" y2="${gy+gh}" stroke="${shade(c,-20)}" stroke-width="2"/>
      `);
    }
    case 'wood-vertical': {
      let slats = '';
      const n = 7;
      const slatW = (gw-12) / n;
      for (let i = 0; i < n; i++) {
        const x = gx + 6 + slatW*i;
        slats += `<rect x="${x+1}" y="${gy+6}" width="${slatW-2}" height="${gh-12}" rx="2"
          fill="${shade(c, i%2 ? -4 : 4)}" stroke="${shade(c,-22)}" stroke-width="0.6"/>`;
      }
      return frame(shadow + woodPanel(slats));
    }
    case 'wood-horizontal': {
      let slats = '';
      const n = 8;
      const slatH = (gh-12) / n;
      for (let i = 0; i < n; i++) {
        const y = gy + 6 + slatH*i;
        slats += `<rect x="${gx+6}" y="${y+1}" width="${gw-12}" height="${slatH-2}" rx="1.5"
          fill="${shade(c, i%2 ? -4 : 4)}" stroke="${shade(c,-22)}" stroke-width="0.6"/>`;
      }
      return frame(shadow + woodPanel(slats));
    }
    case 'wood-barn': {
      return frame(shadow + woodPanel(`
        <line x1="${gx+8}" y1="${gy+8}" x2="${gx+gw-8}" y2="${gy+gh-8}"
          stroke="${shade(c,-30)}" stroke-width="6" stroke-linecap="round"/>
        <line x1="${gx+gw-8}" y1="${gy+8}" x2="${gx+8}" y2="${gy+gh-8}"
          stroke="${shade(c,-30)}" stroke-width="6" stroke-linecap="round"/>
        <rect x="${gx+6}" y="${gy+6}" width="${gw-12}" height="${gh*0.08}" fill="${shade(c,-15)}"/>
        <rect x="${gx+6}" y="${gy+gh-6-gh*0.08}" width="${gw-12}" height="${gh*0.08}" fill="${shade(c,-15)}"/>
      `));
    }
    case 'wood-sliding': {
      return frame(`
        <rect x="${w*0.08}" y="${gy-12}" width="${w*0.84}" height="6" fill="#3a3a3a"/>
        <circle cx="${gx+gw*0.25}" cy="${gy-9}" r="6" fill="#5a5a5a"/>
        <circle cx="${gx+gw*0.75}" cy="${gy-9}" r="6" fill="#5a5a5a"/>
        ${shadow}
        ${woodPanel(`
          <rect x="${gx+8}" y="${gy+8}" width="${gw-16}" height="${gh*0.4}" rx="2"
            fill="none" stroke="${shade(c,-25)}" stroke-width="1.5"/>
          <rect x="${gx+8}" y="${gy+gh*0.5}" width="${gw-16}" height="${gh*0.4}" rx="2"
            fill="none" stroke="${shade(c,-25)}" stroke-width="1.5"/>
        `)}
      `);
    }
    case 'wood-cat': {
      const gy2 = h*0.42, gh2 = h*0.36;
      let slats = '';
      const n = 5;
      const slatW = (gw-12) / n;
      for (let i = 0; i < n; i++) {
        const x = gx + 6 + slatW*i;
        slats += `<rect x="${x+1}" y="${gy2+6}" width="${slatW-2}" height="${gh2-12}" rx="2"
          fill="${shade(c, i%2 ? -4 : 4)}" stroke="${shade(c,-22)}" stroke-width="0.6"/>`;
      }
      return frame(`
        <ellipse cx="${w/2}" cy="${gy2+gh2+8}" rx="${gw*0.42}" ry="6" fill="#00000022"/>
        <rect x="${gx}" y="${gy2}" width="${gw}" height="${gh2}" rx="3" fill="${c}"/>
        ${slats}
        <rect x="${gx}" y="${gy2}" width="${gw}" height="${gh2}" rx="3" fill="none" stroke="${shade(c,-25)}" stroke-width="1.2"/>
      `);
    }
    default:
      return frame(plexiPanel(''));
  }
}

// Lighten/darken a hex color
function shade(hex, percent) {
  if (!hex || hex === 'custom') hex = '#999999';
  const num = parseInt(hex.slice(1), 16);
  let r = (num >> 16) + percent;
  let g = ((num >> 8) & 0x00FF) + percent;
  let b = (num & 0x0000FF) + percent;
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return '#' + ((r<<16) | (g<<8) | b).toString(16).padStart(6, '0');
}

window.LUMINA_SVG = { gateSVG, shade };
