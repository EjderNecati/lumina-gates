#!/usr/bin/env python3
"""
Brand thank-you / Etsy review-request bifold cards

Generates four PDFs — two brands (MobilyHome, TosscoThings) × two folded sizes (A6, A5).

Card construction:
  • A6 card = A5 landscape sheet (210×148 mm) folded once down the middle.
  • A5 card = A4 landscape sheet (297×210 mm) folded once down the middle.

PDF page 1 = OUTSIDE of the card (back cover left half, front cover right half).
PDF page 2 = INSIDE SPREAD (left + right panels visible when card is opened).

Each brand has its own visual treatment but identical copy and layout structure:
  Inside left  : two dog photos stacked + "Our Shelter" intro
  Inside right : five stars + heartfelt review plea + Etsy QR (bottom-right)

Output:  dist/cards/<brand>-<size>.pdf
"""

import os
from reportlab.lib.pagesizes import A5, A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from PIL import Image as PILImage

HERE    = os.path.dirname(os.path.abspath(__file__))
ROOT    = os.path.dirname(HERE)
SHELTER = os.path.join(ROOT, 'assets', 'shelter')
DIST    = os.path.join(ROOT, 'dist', 'cards')
os.makedirs(DIST, exist_ok=True)

REST_IMG  = os.path.join(SHELTER, 'shelter-rest.jpg')
PUPPY_IMG = os.path.join(SHELTER, 'shelter-puppy.jpg')
GATE_IMG  = os.path.join(SHELTER, 'shelter-gate.jpg')
MOBILY_QR = os.path.join(SHELTER, 'etsy-qr.png')        # MobilyHome
TOSSCO_QR = os.path.join(SHELTER, 'tossco-qr.png')      # TosscoThings

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
BG      = HexColor('#F6F2EA')   # main cream
BG_WARM = HexColor('#EDE3CF')   # warmer cream for Tossco outside
BG_SOFT = HexColor('#EFE9DD')
GOLD    = HexColor('#B89668')
GOLD_LT = HexColor('#C9B388')
TERRA   = HexColor('#8C5234')   # warm terracotta accent (Tossco)

# ── Helpers ───────────────────────────────────────────────────────
def fold_line(c, page_w, page_h):
    c.saveState()
    c.setStrokeColor(HexColor('#00000022')); c.setLineWidth(0.3); c.setDash(1.5, 2.5)
    c.line(page_w/2, 4*mm, page_w/2, page_h - 4*mm)
    c.restoreState()

def draw_image_cover(c, path, x, y, w, h):
    if not os.path.isfile(path):
        c.setFillColor(BG_SOFT); c.rect(x, y, w, h, stroke=0, fill=1); return
    with PILImage.open(path) as im:
        iw, ih = im.size
    scale = max(w/iw, h/ih); nw, nh = iw*scale, ih*scale
    c.saveState(); c.translate(x, y)
    p = c.beginPath(); p.rect(0, 0, w, h); c.clipPath(p, stroke=0, fill=0)
    c.drawImage(path, (w-nw)/2, (h-nh)/2, nw, nh, preserveAspectRatio=True, mask='auto')
    c.restoreState()

def draw_image_contain(c, path, x, y, w, h):
    if not os.path.isfile(path): return
    with PILImage.open(path) as im:
        iw, ih = im.size
    scale = min(w/iw, h/ih); nw, nh = iw*scale, ih*scale
    c.drawImage(path, x + (w-nw)/2, y + (h-nh)/2, nw, nh,
                preserveAspectRatio=True, mask='auto')

def centred(c, font, size, text, cx, y, colour=None):
    if colour: c.setFillColor(colour)
    c.setFont(font, size); c.drawCentredString(cx, y, text)

def wrap(c, text, font, size, max_w, leading, x, y, colour=INK_2):
    c.setFont(font, size); c.setFillColor(colour)
    words = text.split(' '); line = ''; cy = y
    for word in words + [None]:
        candidate = (line + ' ' + word).strip() if word else line
        if word is not None and c.stringWidth(candidate, font, size) <= max_w:
            line = candidate; continue
        if line: c.drawString(x, cy, line); cy -= leading
        line = word or ''
    return cy

def spaced(text):
    return ' '.join(list(text.upper()))

# ── Shared copy ───────────────────────────────────────────────────
SHELTER_HEAD = 'Our shelter.'
SHELTER_BODY = (
"In July 2024, Turkey passed a law ordering municipalities to "
"clear every street of stray dogs. Dogs not adopted within thirty "
"days are euthanised. Millions are at risk. We run a small shelter "
"that takes in as many as we can, gives them food, vet care, and a "
"real chance at a home."
)
REVIEW_HEAD_1 = 'Will you help us'
REVIEW_HEAD_2 = 'keep them alive?'
REVIEW_BODY = (
"Every Etsy review keeps our atelier running. Every gate we craft "
"pays for food, vaccinations, and another safe corner for a dog "
"who would otherwise be lost to this law. A few honest words from "
"you can, genuinely, save a life. We mean that literally."
)
CLOSING = 'With everything we have, thank you.'

# ── Brand definitions ─────────────────────────────────────────────
# Each brand has a "skin" — outside cover treatment.
BRANDS = {
    'MobilyHome': {
        'name':       'MobilyHome',
        'sub':        'Handcrafted Atelier',
        'monogram':   'M',
        'qr':         MOBILY_QR,
        'outside_bg': INK,           # ink black outside
        'outside_fg': white,
        'accent':     GOLD_LT,
        'outside_style': 'dark',
    },
    'TosscoThings': {
        'name':       'TosscoThings',
        'sub':        'Handcrafted Atelier',
        'monogram':   'T',
        'qr':         TOSSCO_QR,
        'outside_bg': BG_WARM,       # warm cream outside
        'outside_fg': INK,
        'accent':     TERRA,         # terracotta accent
        'outside_style': 'light',
    },
}

# ── Builder ───────────────────────────────────────────────────────
def build(brand_key, size_key):
    brand = BRANDS[brand_key]
    if size_key == 'A6':
        page_w, page_h = A5[1], A5[0]   # 210 × 148 mm landscape
        pad = 10*mm
        photo_h = 42*mm
        cover_brand_size = 9
        cover_sub_size   = 12
        cover_thanks_size= 44
        cover_kicker_size= 7
        sh_eyebrow_size  = 7
        sh_head_size     = 15
        sh_body_size     = 8
        sh_body_leading  = 10.5
        rv_star_size     = 18
        rv_eyebrow_size  = 7
        rv_head_size     = 18
        rv_body_size     = 8.5
        rv_body_leading  = 11.5
        rv_closing_size  = 9.5
        qr_size          = 28*mm
        back_M_size      = 28
    else:  # A5
        page_w, page_h = A4[1], A4[0]   # 297 × 210 mm landscape
        pad = 14*mm
        photo_h = 58*mm
        cover_brand_size = 11
        cover_sub_size   = 16
        cover_thanks_size= 60
        cover_kicker_size= 9
        sh_eyebrow_size  = 9
        sh_head_size     = 22
        sh_body_size     = 11
        sh_body_leading  = 15
        rv_star_size     = 24
        rv_eyebrow_size  = 9
        rv_head_size     = 26
        rv_body_size     = 11.5
        rv_body_leading  = 16
        rv_closing_size  = 12
        qr_size          = 40*mm
        back_M_size      = 56

    half = page_w / 2

    out_path = os.path.join(DIST, f'{brand_key}-Card-{size_key}.pdf')
    c = canvas.Canvas(out_path, pagesize=(page_w, page_h))

    # ╔════════════ PAGE 1 — OUTSIDE ════════════╗
    c.setFillColor(brand['outside_bg'])
    c.rect(0, 0, page_w, page_h, stroke=0, fill=1)
    fg     = brand['outside_fg']
    accent = brand['accent']

    # RIGHT panel = FRONT COVER
    cx_r = half + half/2
    centred(c, SANS_BOLD, cover_brand_size, spaced(brand['name']),
            cx_r, page_h - (18*mm if size_key=='A6' else 28*mm), fg)
    centred(c, SERIF_ITALIC, cover_sub_size, brand['sub'],
            cx_r, page_h - (28*mm if size_key=='A6' else 42*mm), accent)

    c.setStrokeColor(accent); c.setLineWidth(0.5)
    rule_y = page_h - (42*mm if size_key=='A6' else 58*mm)
    rw_half = 14*mm if size_key=='A6' else 22*mm
    c.line(cx_r - rw_half, rule_y, cx_r + rw_half, rule_y)

    c.setFillColor(fg); c.setFont(SERIF_ITALIC, cover_thanks_size)
    c.drawCentredString(cx_r, page_h/2 - 4, 'thank you.')

    c.setStrokeColor(accent); c.setLineWidth(0.5)
    c.line(cx_r - rw_half, page_h/2 - (16 if size_key=='A6' else 22),
           cx_r + rw_half, page_h/2 - (16 if size_key=='A6' else 22))

    centred(c, SANS, cover_kicker_size,
            spaced('for choosing ' + brand['name'].lower()),
            cx_r, page_h/2 - (30 if size_key=='A6' else 42), accent)

    # LEFT panel = BACK COVER (minimal monogram)
    cx_l = half/2
    centred(c, SERIF_ITALIC, back_M_size, brand['monogram'],
            cx_l, page_h/2 + (8 if size_key=='A6' else 12), accent)
    c.setStrokeColor(accent); c.setLineWidth(0.4)
    bw = 6*mm if size_key=='A6' else 12*mm
    by = page_h/2 - (8 if size_key=='A6' else 20)
    c.line(cx_l - bw, by, cx_l + bw, by)
    centred(c, SANS, 6 if size_key=='A6' else 8,
            spaced(brand['name']), cx_l,
            by - (12 if size_key=='A6' else 18), accent)
    centred(c, SANS, 6 if size_key=='A6' else 8,
            'find us on Etsy', cx_l,
            by - (22 if size_key=='A6' else 32), accent)

    fold_line(c, page_w, page_h)
    c.showPage()

    # ╔════════════ PAGE 2 — INSIDE SPREAD ════════════╗
    c.setFillColor(BG)
    c.rect(0, 0, page_w, page_h, stroke=0, fill=1)

    # Subtle accent strip at the top of each inside panel
    c.setFillColor(accent)
    strip_h = 1.2 if size_key == 'A6' else 1.6
    c.rect(pad, page_h - pad/2, half - 2*pad, strip_h, stroke=0, fill=1)
    c.rect(half + pad, page_h - pad/2, half - 2*pad, strip_h, stroke=0, fill=1)

    # ── LEFT panel: two stacked photos + Our Shelter intro ──
    photo_w = half - 2*pad
    photo_top_y = page_h - pad - photo_h
    draw_image_cover(c, REST_IMG, pad, photo_top_y, photo_w, photo_h)
    gap = 3*mm
    photo_bot_y = photo_top_y - gap - photo_h
    draw_image_cover(c, PUPPY_IMG, pad, photo_bot_y, photo_w, photo_h)

    text_top = photo_bot_y - 10
    c.setFillColor(INK_3); c.setFont(SANS_BOLD, sh_eyebrow_size)
    c.drawString(pad, text_top, spaced('our shelter'))
    c.setFillColor(INK); c.setFont(SERIF_BOLD, sh_head_size)
    c.drawString(pad, text_top - (16 if size_key=='A6' else 22), SHELTER_HEAD)
    body_start = text_top - (30 if size_key=='A6' else 42)
    wrap(c, SHELTER_BODY, SERIF, sh_body_size, photo_w,
         sh_body_leading, pad, body_start, INK_2)

    # ── RIGHT panel: stars + heading + body + closing + QR ──
    rx = half + pad
    rw = half - 2*pad

    c.setFillColor(GOLD); c.setFont(SERIF, rv_star_size)
    c.drawString(rx, page_h - pad - (14 if size_key=='A6' else 20),
                 '\u2605 \u2605 \u2605 \u2605 \u2605')

    c.setFillColor(INK_3); c.setFont(SANS_BOLD, rv_eyebrow_size)
    c.drawString(rx, page_h - pad - (30 if size_key=='A6' else 42),
                 spaced('a small favour'))

    c.setFillColor(INK); c.setFont(SERIF_BOLD, rv_head_size)
    h1_y = page_h - pad - (50 if size_key=='A6' else 72)
    h2_y = page_h - pad - (70 if size_key=='A6' else 100)
    c.drawString(rx, h1_y, REVIEW_HEAD_1)
    c.drawString(rx, h2_y, REVIEW_HEAD_2)

    body_y = page_h - pad - (86 if size_key=='A6' else 122)
    end_y = wrap(c, REVIEW_BODY, SERIF, rv_body_size, rw,
                 rv_body_leading, rx, body_y, INK_2)

    c.setFont(SERIF_ITALIC, rv_closing_size); c.setFillColor(INK)
    c.drawString(rx, end_y - 6, CLOSING)

    # QR bottom-right
    qr_x = page_w - pad - qr_size
    qr_y = pad
    c.setFillColor(white)
    c.rect(qr_x - 2*mm, qr_y - 2*mm, qr_size + 4*mm, qr_size + 4*mm + 6,
           stroke=0, fill=1)
    draw_image_contain(c, brand['qr'], qr_x, qr_y + 6, qr_size, qr_size)

    # Label next to QR
    c.setFillColor(INK_3); c.setFont(SANS_BOLD, 6 if size_key=='A6' else 8)
    label_x = rx
    c.drawString(label_x, qr_y + qr_size - 6, spaced('scan to leave'))
    c.drawString(label_x, qr_y + qr_size - 14, spaced('a review on etsy'))
    c.setFillColor(INK); c.setFont(SERIF_ITALIC, 9 if size_key=='A6' else 11)
    c.drawString(label_x, qr_y + 4, 'It only takes a minute.')

    fold_line(c, page_w, page_h)
    c.showPage()
    c.save()
    print(f'\u2713 {brand_key} {size_key}: {out_path}')

# ── Flat (non-folded) builder ─────────────────────────────────────
# Single-sheet card, printed double-sided.
#   • A6 flat: 105 × 148 mm portrait (one A6 sheet, two sides)
#   • A5 flat: 148 × 210 mm portrait (one A5 sheet, two sides)
# Page 1 of the PDF = FRONT face of the card
# Page 2 of the PDF = BACK face of the card

def build_flat(brand_key, size_key):
    brand = BRANDS[brand_key]
    if size_key == 'A6-flat':
        page_w, page_h = 105*mm, 148*mm     # A6 portrait
        pad = 8*mm
        brand_size      = 9
        sub_size        = 12
        thanks_size     = 36
        rule_w          = 14*mm
        star_size       = 14
        eyebrow_size    = 6.5
        head_size       = 14
        body_size       = 7.5
        body_leading    = 10
        closing_size    = 8.5
        qr_size         = 22*mm
        photo_h         = 36*mm
        photo_w_max     = page_w - 2*pad
        body_max_w_back = page_w - 2*pad
    else:  # A5-flat
        page_w, page_h = 148*mm, 210*mm     # A5 portrait
        pad = 12*mm
        brand_size      = 11
        sub_size        = 16
        thanks_size     = 54
        rule_w          = 22*mm
        star_size       = 22
        eyebrow_size    = 8.5
        head_size       = 22
        body_size       = 10.5
        body_leading    = 14.5
        closing_size    = 12
        qr_size         = 34*mm
        photo_h         = 56*mm
        photo_w_max     = page_w - 2*pad
        body_max_w_back = page_w - 2*pad

    out_path = os.path.join(DIST, f'{brand_key}-Card-{size_key}.pdf')
    c = canvas.Canvas(out_path, pagesize=(page_w, page_h))

    fg     = brand['outside_fg']
    accent = brand['accent']

    # ╔══════════ FRONT (page 1) ══════════╗
    c.setFillColor(brand['outside_bg'])
    c.rect(0, 0, page_w, page_h, stroke=0, fill=1)

    cx = page_w / 2
    centred(c, SANS_BOLD, brand_size, spaced(brand['name']),
            cx, page_h - (22*mm if size_key=='A6-flat' else 36*mm), fg)
    centred(c, SERIF_ITALIC, sub_size, brand['sub'],
            cx, page_h - (32*mm if size_key=='A6-flat' else 50*mm), accent)

    c.setStrokeColor(accent); c.setLineWidth(0.5)
    rule_y = page_h - (46*mm if size_key=='A6-flat' else 68*mm)
    c.line(cx - rule_w, rule_y, cx + rule_w, rule_y)

    c.setFillColor(fg); c.setFont(SERIF_ITALIC, thanks_size)
    c.drawCentredString(cx, page_h/2 - 6, 'thank you.')

    c.setStrokeColor(accent); c.setLineWidth(0.5)
    c.line(cx - rule_w, page_h/2 - 22, cx + rule_w, page_h/2 - 22)

    centred(c, SANS, 7 if size_key=='A6-flat' else 9,
            spaced('for choosing ' + brand['name'].lower()),
            cx, page_h/2 - (36 if size_key=='A6-flat' else 44), accent)

    # Brand monogram big at bottom
    centred(c, SERIF_ITALIC, 60 if size_key=='A6-flat' else 92,
            brand['monogram'],
            cx, pad + (16*mm if size_key=='A6-flat' else 22*mm), accent)

    centred(c, SANS, 6 if size_key=='A6-flat' else 8,
            'find us on Etsy', cx,
            pad + 4, accent)

    c.showPage()

    # ╔══════════ BACK (page 2) ══════════╗
    c.setFillColor(BG)
    c.rect(0, 0, page_w, page_h, stroke=0, fill=1)

    # Subtle accent strip at the top
    c.setFillColor(accent)
    strip_h = 1.2 if size_key=='A6-flat' else 1.6
    c.rect(pad, page_h - pad/2, page_w - 2*pad, strip_h, stroke=0, fill=1)

    # ── Three photos in one clean row across the top ──
    photos = [REST_IMG, PUPPY_IMG, GATE_IMG]
    photo_gap = 2.5*mm if size_key == 'A6-flat' else 4*mm
    row_w = page_w - 2*pad
    tile_w = (row_w - 2*photo_gap) / 3
    tile_h = tile_w * 1.15   # slightly portrait

    row_y = page_h - pad - tile_h
    for i, p in enumerate(photos):
        x = pad + i * (tile_w + photo_gap)
        draw_image_cover(c, p, x, row_y, tile_w, tile_h)

    # Caption strip under the photos
    cap_y = row_y - (10 if size_key == 'A6-flat' else 16)
    c.setFillColor(INK_3); c.setFont(SANS_BOLD, eyebrow_size)
    c.drawString(pad, cap_y, spaced('our shelter, in three frames'))

    # ── Stars row ──
    star_y = cap_y - (14 if size_key == 'A6-flat' else 22)
    c.setFillColor(GOLD); c.setFont(SERIF, star_size)
    c.drawString(pad, star_y, '\u2605 \u2605 \u2605 \u2605 \u2605')

    # ── Heading ──
    c.setFillColor(INK); c.setFont(SERIF_BOLD, head_size)
    h1_y = star_y - (18 if size_key == 'A6-flat' else 30)
    h2_y = h1_y - (16 if size_key == 'A6-flat' else 26)
    c.drawString(pad, h1_y, REVIEW_HEAD_1)
    c.drawString(pad, h2_y, REVIEW_HEAD_2)

    # ── Body (full width, terminates above the QR row) ──
    full_body = (
        "In July 2024, Turkey passed a law: any street dog not "
        "adopted within thirty days is euthanised. We run a small "
        "shelter to rescue as many as we can. Every Etsy review you "
        "leave keeps our atelier alive and pays for food, vet care, "
        "and another safe corner for a dog who would otherwise be "
        "lost. A few honest words from you can, genuinely, save a "
        "life."
    )

    body_y = h2_y - (14 if size_key == 'A6-flat' else 22)
    body_w = page_w - 2*pad
    end_y = wrap(c, full_body, SERIF, body_size, body_w,
                 body_leading, pad, body_y, INK_2)

    # ── Bottom row: closing line on left, QR on right (no overlap) ──
    qr_x = page_w - pad - qr_size
    qr_y = pad

    # QR with white safety card
    c.setFillColor(white)
    c.rect(qr_x - 2*mm, qr_y - 2*mm,
           qr_size + 4*mm, qr_size + 4*mm,
           stroke=0, fill=1)
    draw_image_contain(c, brand['qr'], qr_x, qr_y, qr_size, qr_size)

    # Small scan label above the QR
    c.setFillColor(INK_3); c.setFont(SANS_BOLD, 5.5 if size_key == 'A6-flat' else 8)
    c.drawRightString(page_w - pad, qr_y + qr_size + 4, spaced('scan for etsy'))

    # Closing italic on the left — vertically centred against the QR
    c.setFillColor(INK); c.setFont(SERIF_ITALIC, closing_size)
    closing_y = qr_y + qr_size / 2 - closing_size / 2
    c.drawString(pad, closing_y, CLOSING)

    c.showPage()
    c.save()
    print(f'\u2713 {brand_key} {size_key}: {out_path}')

if __name__ == '__main__':
    for brand in BRANDS:
        for size in ('A6', 'A5'):
            build(brand, size)
        for size in ('A6-flat', 'A5-flat'):
            build_flat(brand, size)
