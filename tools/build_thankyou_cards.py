#!/usr/bin/env python3
"""
Lumina Gates — Thank-you / Review-request bifold cards

Two designs:
  Design 1 — A5 sheet, folded once down the middle → A6 portrait card (compact, premium)
  Design 2 — A4 sheet, folded once down the middle → A5 portrait card (spacious, photo-forward)

Each card is a single sheet, printed double-sided, folded once on the vertical axis.

Page 1 of the PDF is the OUTSIDE of the card (back-cover on the left half, front-cover on the right half).
Page 2 is the INSIDE spread (left and right inside panels).

Run:  python3 tools/build_thankyou_cards.py
Output:
  dist/Lumina-ThankYou-Card-Design1-A6.pdf   (folded → A6)
  dist/Lumina-ThankYou-Card-Design2-A5.pdf   (folded → A5)
"""

import os
from reportlab.lib.pagesizes import A5, A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white, black
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from PIL import Image as PILImage

# ── Paths ─────────────────────────────────────────────────────────
HERE       = os.path.dirname(os.path.abspath(__file__))
ROOT       = os.path.dirname(HERE)
SHELTER    = os.path.join(ROOT, 'assets', 'shelter')
DIST       = os.path.join(ROOT, 'dist')
os.makedirs(DIST, exist_ok=True)

GATE_IMG   = os.path.join(SHELTER, 'shelter-gate.jpg')
REST_IMG   = os.path.join(SHELTER, 'shelter-rest.jpg')
PUPPY_IMG  = os.path.join(SHELTER, 'shelter-puppy.jpg')

# ── Fonts ─────────────────────────────────────────────────────────
def reg(name, paths):
    for p in paths:
        if os.path.isfile(p):
            try:
                pdfmetrics.registerFont(TTFont(name, p))
                return name
            except Exception:
                pass
    return None

SERIF        = reg('Cormorant',        ['/Library/Fonts/Cormorant Garamond.ttf']) or 'Times-Roman'
SERIF_BOLD   = reg('Cormorant-Bold',   ['/Library/Fonts/Cormorant Garamond Bold.ttf']) or 'Times-Bold'
SERIF_ITALIC = reg('Cormorant-Italic', ['/Library/Fonts/Cormorant Garamond Italic.ttf']) or 'Times-Italic'
SANS         = 'Helvetica'
SANS_BOLD    = 'Helvetica-Bold'

# ── Palette ───────────────────────────────────────────────────────
INK     = HexColor('#0E0E0E')
INK_2   = HexColor('#2A2A2A')
INK_3   = HexColor('#5A5A56')
BG      = HexColor('#F6F2EA')
BG_SOFT = HexColor('#EFE9DD')
GOLD    = HexColor('#B89668')
GOLD_LT = HexColor('#C9B388')

# ── Helpers ───────────────────────────────────────────────────────
def fold_line(c, page_w, page_h):
    """Faint dashed fold line down the middle (printer guide; can be removed for production)."""
    c.saveState()
    c.setStrokeColor(HexColor('#00000022'))
    c.setLineWidth(0.3)
    c.setDash(1.5, 2.5)
    c.line(page_w / 2, 4*mm, page_w / 2, page_h - 4*mm)
    c.restoreState()

def draw_image_clipped(c, path, x, y, w, h, cover=True):
    """Draw an image into a rectangle, cropping to fit (cover) or fitting inside (contain)."""
    if not os.path.isfile(path):
        c.setFillColor(BG_SOFT)
        c.rect(x, y, w, h, stroke=0, fill=1)
        return
    with PILImage.open(path) as im:
        iw, ih = im.size
    if cover:
        scale = max(w / iw, h / ih)
        nw, nh = iw * scale, ih * scale
        c.saveState()
        c.translate(x, y)
        p = c.beginPath(); p.rect(0, 0, w, h)
        c.clipPath(p, stroke=0, fill=0)
        c.drawImage(path, (w - nw) / 2, (h - nh) / 2, nw, nh,
                    preserveAspectRatio=True, mask='auto')
        c.restoreState()
    else:
        scale = min(w / iw, h / ih)
        nw, nh = iw * scale, ih * scale
        c.drawImage(path, x + (w - nw) / 2, y + (h - nh) / 2, nw, nh,
                    preserveAspectRatio=True, mask='auto')

def centred(c, font, size, text, cx, y, colour=None):
    if colour: c.setFillColor(colour)
    c.setFont(font, size)
    c.drawCentredString(cx, y, text)

def left_text(c, font, size, text, x, y, colour=None):
    if colour: c.setFillColor(colour)
    c.setFont(font, size)
    c.drawString(x, y, text)

def wrap(c, text, font, size, max_w, leading, x, y, colour=INK_2, align='left'):
    """Very small word-wrap helper."""
    c.setFont(font, size)
    c.setFillColor(colour)
    words = text.split(' ')
    line = ''
    cy = y
    for word in words + [None]:
        candidate = (line + ' ' + word).strip() if word else line
        if word is not None and c.stringWidth(candidate, font, size) <= max_w:
            line = candidate
            continue
        if line:
            if align == 'center':
                c.drawCentredString(x + max_w / 2, cy, line)
            else:
                c.drawString(x, cy, line)
            cy -= leading
        line = word or ''
    return cy

def small_caps_spaced(text):
    return ' '.join(list(text.upper()))

# ── Common copy ───────────────────────────────────────────────────
THANKYOU_TITLE_EN = 'thank you.'
THANKYOU_KICKER   = 'for choosing Lumina Gates'

SHELTER_HEAD = 'Behind every gate, a rescued dog.'

SHELTER_BODY = (
"In Turkey, stray dogs are being rounded up and put down. "
"Every order you place with us helps fund the small shelter we run, "
"where we rescue street dogs and give them a safe place to land."
)

REVIEW_HEAD = 'A small favour to ask.'

REVIEW_BODY = (
"If your gate has brought a little calm to your home, would you "
"share a few words on Etsy? Every review supports our atelier and "
"the dogs in our shelter, and we read every single one."
)

CLOSING_LINE = 'With gratitude, from all of us at Lumina.'

# ── DESIGN 1 — A5 sheet, folds to A6 portrait ─────────────────────
def build_design_1():
    out_path = os.path.join(DIST, 'Lumina-ThankYou-Card-Design1-A6.pdf')
    # Landscape A5: width=210mm, height=148mm; fold on x=105mm.
    page_w, page_h = A5[1], A5[0]
    c = canvas.Canvas(out_path, pagesize=(page_w, page_h))
    half = page_w / 2

    # ───── PAGE 1 — OUTSIDE of the card ─────
    # Whole page is ink black.
    c.setFillColor(INK)
    c.rect(0, 0, page_w, page_h, stroke=0, fill=1)

    # ── RIGHT panel = FRONT COVER ──
    cx_r = half + half / 2     # centre of right panel
    centred(c, SANS_BOLD, 8, small_caps_spaced('Lumina'),
            cx_r, page_h - 18*mm, white)
    centred(c, SERIF_ITALIC, 11, 'Gates Atelier',
            cx_r, page_h - 26*mm, GOLD_LT)

    # Gold rule
    c.setStrokeColor(GOLD_LT); c.setLineWidth(0.5)
    c.line(cx_r - 14*mm, page_h - 40*mm, cx_r + 14*mm, page_h - 40*mm)

    # Big italic 'thank you.'
    c.setFillColor(white)
    c.setFont(SERIF_ITALIC, 44)
    c.drawCentredString(cx_r, page_h / 2 - 4, 'thank you.')

    c.setStrokeColor(GOLD_LT); c.setLineWidth(0.5)
    c.line(cx_r - 14*mm, page_h / 2 - 16, cx_r + 14*mm, page_h / 2 - 16)

    centred(c, SANS, 7, small_caps_spaced('for choosing lumina'),
            cx_r, page_h / 2 - 30, GOLD_LT)

    centred(c, SANS, 6.5, 'luminagates.com',
            cx_r, 14*mm, GOLD_LT)

    # ── LEFT panel = BACK COVER (minimal mark) ──
    cx_l = half / 2
    centred(c, SERIF_ITALIC, 24, 'L',
            cx_l, page_h / 2 + 6, GOLD_LT)
    c.setStrokeColor(GOLD_LT); c.setLineWidth(0.4)
    c.line(cx_l - 5*mm, page_h / 2 - 4, cx_l + 5*mm, page_h / 2 - 4)
    centred(c, SANS, 6, small_caps_spaced('Lumina Gates'),
            cx_l, page_h / 2 - 14, GOLD_LT)
    centred(c, SANS, 6, 'luminagates.com',
            cx_l, page_h / 2 - 24, GOLD_LT)

    fold_line(c, page_w, page_h)
    c.showPage()

    # ───── PAGE 2 — INSIDE spread ─────
    c.setFillColor(BG)
    c.rect(0, 0, page_w, page_h, stroke=0, fill=1)

    # ── LEFT inside panel — shelter story ──
    pad = 12*mm
    photo_h = 60*mm
    photo_y = page_h - pad - photo_h
    draw_image_clipped(c, REST_IMG, pad, photo_y, half - 2*pad, photo_h, cover=True)

    # Eyebrow
    left_text(c, SANS_BOLD, 7,
              small_caps_spaced('our shelter'),
              pad, photo_y - 10, INK_3)
    # Heading
    c.setFillColor(INK)
    c.setFont(SERIF_BOLD, 16)
    c.drawString(pad, photo_y - 26, 'Behind every gate,')
    c.drawString(pad, photo_y - 42, 'a rescued dog.')

    # Body
    body_y = photo_y - 56
    wrap(c, SHELTER_BODY, SERIF, 8.5, half - 2*pad, 11, pad, body_y, INK_2)

    # ── RIGHT inside panel — review ask ──
    rx = half + pad
    rw = half - 2*pad

    # Small puppy photo top-right
    photo2_h = 40*mm
    draw_image_clipped(c, PUPPY_IMG, rx, page_h - pad - photo2_h,
                       rw, photo2_h, cover=True)

    # Stars
    c.setFillColor(GOLD)
    c.setFont(SERIF, 16)
    c.drawString(rx, page_h - pad - photo2_h - 18, '\u2605 \u2605 \u2605 \u2605 \u2605')

    # Eyebrow
    left_text(c, SANS_BOLD, 7,
              small_caps_spaced('a small favour'),
              rx, page_h - pad - photo2_h - 34, INK_3)
    # Heading
    c.setFillColor(INK)
    c.setFont(SERIF_BOLD, 16)
    c.drawString(rx, page_h - pad - photo2_h - 50, 'Would you share')
    c.drawString(rx, page_h - pad - photo2_h - 66, 'a review on Etsy?')

    # Body
    by = page_h - pad - photo2_h - 80
    wrap(c, REVIEW_BODY, SERIF, 8.5, rw, 11, rx, by, INK_2)

    # Closing line
    c.setStrokeColor(GOLD); c.setLineWidth(0.4)
    c.line(rx, pad + 16, rx + rw, pad + 16)
    c.setFillColor(INK)
    c.setFont(SERIF_ITALIC, 10)
    c.drawString(rx, pad + 4, CLOSING_LINE)

    fold_line(c, page_w, page_h)
    c.showPage()
    c.save()
    print(f'\u2713 Design 1 (folds to A6): {out_path}')

# ── DESIGN 2 — A4 sheet, folds to A5 portrait ─────────────────────
def build_design_2():
    out_path = os.path.join(DIST, 'Lumina-ThankYou-Card-Design2-A5.pdf')
    # Landscape A4: width=297, height=210mm; fold on x=148.5
    page_w, page_h = A4[1], A4[0]
    c = canvas.Canvas(out_path, pagesize=(page_w, page_h))
    half = page_w / 2

    # ───── PAGE 1 — OUTSIDE ─────
    c.setFillColor(BG)
    c.rect(0, 0, page_w, page_h, stroke=0, fill=1)

    # ── RIGHT panel = FRONT COVER, photo-forward ──
    pad = 12*mm
    # Full-bleed photo on right panel
    draw_image_clipped(c, REST_IMG, half, 0, half, page_h, cover=True)
    # Dark overlay band at bottom for text legibility
    c.saveState()
    c.setFillColor(HexColor('#000000'))
    c.setFillAlpha(0.55)
    c.rect(half, 0, half, 60*mm, stroke=0, fill=1)
    c.restoreState()

    cx_r = half + half / 2
    centred(c, SANS_BOLD, 9, small_caps_spaced('Lumina'),
            cx_r, 48*mm, white)
    centred(c, SERIF_ITALIC, 13, 'Gates Atelier',
            cx_r, 38*mm, GOLD_LT)

    c.setStrokeColor(GOLD_LT); c.setLineWidth(0.5)
    c.line(cx_r - 20*mm, 28*mm, cx_r + 20*mm, 28*mm)

    c.setFillColor(white)
    c.setFont(SERIF_ITALIC, 38)
    c.drawCentredString(cx_r, 14*mm, 'thank you.')

    # ── LEFT panel = BACK COVER (cream, minimal) ──
    cx_l = half / 2

    # Centred mark
    centred(c, SERIF_ITALIC, 80, 'L',
            cx_l, page_h / 2 + 8, GOLD_LT)
    c.setStrokeColor(GOLD); c.setLineWidth(0.5)
    c.line(cx_l - 22*mm, page_h / 2 - 18, cx_l + 22*mm, page_h / 2 - 18)
    centred(c, SANS_BOLD, 8, small_caps_spaced('Lumina Gates'),
            cx_l, page_h / 2 - 32, INK_3)
    centred(c, SERIF_ITALIC, 10, 'Made with care.',
            cx_l, page_h / 2 - 46, INK_3)

    # Bottom contact
    centred(c, SANS, 7, 'luminagates.com',
            cx_l, 24*mm, INK_3)
    centred(c, SANS, 7, 'luminagates@gmail.com',
            cx_l, 16*mm, INK_3)

    fold_line(c, page_w, page_h)
    c.showPage()

    # ───── PAGE 2 — INSIDE SPREAD ─────
    c.setFillColor(BG)
    c.rect(0, 0, page_w, page_h, stroke=0, fill=1)

    # ── LEFT inside panel — shelter story with two photos ──
    pad = 16*mm
    # Big photo top
    photo_h = 78*mm
    draw_image_clipped(c, GATE_IMG, pad, page_h - pad - photo_h,
                       half - 2*pad, photo_h, cover=True)

    # Eyebrow
    left_text(c, SANS_BOLD, 8,
              small_caps_spaced('our shelter'),
              pad, page_h - pad - photo_h - 14, INK_3)
    c.setFillColor(INK)
    c.setFont(SERIF_BOLD, 22)
    c.drawString(pad, page_h - pad - photo_h - 34, 'Behind every gate,')
    c.drawString(pad, page_h - pad - photo_h - 56, 'a rescued dog.')

    body_y = page_h - pad - photo_h - 74
    wrap(c, SHELTER_BODY, SERIF, 10, half - 2*pad, 14, pad, body_y, INK_2)

    # Closing italic line
    c.setStrokeColor(GOLD); c.setLineWidth(0.4)
    c.line(pad, pad + 16, half - pad, pad + 16)
    c.setFillColor(INK)
    c.setFont(SERIF_ITALIC, 11)
    c.drawString(pad, pad + 4, CLOSING_LINE)

    # ── RIGHT inside panel — review request + puppy photo ──
    rx = half + pad
    rw = half - 2*pad

    # Puppy photo on top
    p2_h = 78*mm
    draw_image_clipped(c, PUPPY_IMG, rx, page_h - pad - p2_h, rw, p2_h, cover=True)

    # Stars
    c.setFillColor(GOLD)
    c.setFont(SERIF, 20)
    c.drawString(rx, page_h - pad - p2_h - 24, '\u2605 \u2605 \u2605 \u2605 \u2605')

    # Eyebrow
    left_text(c, SANS_BOLD, 8,
              small_caps_spaced('a small favour'),
              rx, page_h - pad - p2_h - 42, INK_3)
    c.setFillColor(INK)
    c.setFont(SERIF_BOLD, 22)
    c.drawString(rx, page_h - pad - p2_h - 62, 'Would you share')
    c.drawString(rx, page_h - pad - p2_h - 84, 'a review on Etsy?')

    by = page_h - pad - p2_h - 102
    wrap(c, REVIEW_BODY, SERIF, 10, rw, 14, rx, by, INK_2)

    # Bottom: tiny photo + signature
    sig_y = pad + 4
    c.setFillColor(INK_3)
    c.setFont(SANS, 7)
    c.drawString(rx, sig_y, 'Find us on Etsy and at luminagates.com')

    fold_line(c, page_w, page_h)
    c.showPage()
    c.save()
    print(f'\u2713 Design 2 (folds to A5): {out_path}')

# ── Run both ──────────────────────────────────────────────────────
if __name__ == '__main__':
    build_design_1()
    build_design_2()
