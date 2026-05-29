#!/usr/bin/env python3
"""
MobilyHome — Thank-you / Etsy review-request bifold card

A5 sheet, folded once down the middle → A6 portrait card.

Page 1 (outside) = back cover (left half) + front cover (right half), ink black.
Page 2 (inside spread) = cream:
  Left panel: two dog photos + brief "Our Shelter" introduction.
  Right panel: a heartfelt plea for a 5-star Etsy review + QR code (bottom right).

Output: dist/MobilyHome-ThankYou-Card-A6.pdf
"""

import os
from reportlab.lib.pagesizes import A5
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from PIL import Image as PILImage

HERE     = os.path.dirname(os.path.abspath(__file__))
ROOT     = os.path.dirname(HERE)
SHELTER  = os.path.join(ROOT, 'assets', 'shelter')
DIST     = os.path.join(ROOT, 'dist')
os.makedirs(DIST, exist_ok=True)

REST_IMG  = os.path.join(SHELTER, 'shelter-rest.jpg')
PUPPY_IMG = os.path.join(SHELTER, 'shelter-puppy.jpg')
QR_IMG    = os.path.join(SHELTER, 'etsy-qr.png')

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
    c.saveState()
    c.setStrokeColor(HexColor('#00000022'))
    c.setLineWidth(0.3); c.setDash(1.5, 2.5)
    c.line(page_w/2, 4*mm, page_w/2, page_h - 4*mm)
    c.restoreState()

def draw_image_cover(c, path, x, y, w, h):
    if not os.path.isfile(path):
        c.setFillColor(BG_SOFT); c.rect(x, y, w, h, stroke=0, fill=1); return
    with PILImage.open(path) as im:
        iw, ih = im.size
    scale = max(w/iw, h/ih)
    nw, nh = iw*scale, ih*scale
    c.saveState(); c.translate(x, y)
    p = c.beginPath(); p.rect(0, 0, w, h); c.clipPath(p, stroke=0, fill=0)
    c.drawImage(path, (w-nw)/2, (h-nh)/2, nw, nh,
                preserveAspectRatio=True, mask='auto')
    c.restoreState()

def draw_image_contain(c, path, x, y, w, h):
    if not os.path.isfile(path): return
    with PILImage.open(path) as im:
        iw, ih = im.size
    scale = min(w/iw, h/ih)
    nw, nh = iw*scale, ih*scale
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

# ── Copy ──────────────────────────────────────────────────────────
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

# ── Build ─────────────────────────────────────────────────────────
def build():
    out_path = os.path.join(DIST, 'MobilyHome-ThankYou-Card-A6.pdf')
    page_w, page_h = A5[1], A5[0]   # 210 x 148 mm landscape
    c = canvas.Canvas(out_path, pagesize=(page_w, page_h))
    half = page_w / 2

    # ╔════════════ PAGE 1 — OUTSIDE ════════════╗
    c.setFillColor(INK)
    c.rect(0, 0, page_w, page_h, stroke=0, fill=1)

    # RIGHT panel = FRONT COVER
    cx_r = half + half/2
    centred(c, SANS_BOLD, 9, spaced('MobilyHome'),
            cx_r, page_h - 20*mm, white)
    centred(c, SERIF_ITALIC, 12, 'Handcrafted Atelier',
            cx_r, page_h - 30*mm, GOLD_LT)

    c.setStrokeColor(GOLD_LT); c.setLineWidth(0.5)
    c.line(cx_r - 14*mm, page_h - 44*mm, cx_r + 14*mm, page_h - 44*mm)

    c.setFillColor(white); c.setFont(SERIF_ITALIC, 44)
    c.drawCentredString(cx_r, page_h/2 - 4, 'thank you.')

    c.setStrokeColor(GOLD_LT); c.setLineWidth(0.5)
    c.line(cx_r - 14*mm, page_h/2 - 18, cx_r + 14*mm, page_h/2 - 18)

    centred(c, SANS, 7, spaced('for choosing MobilyHome'),
            cx_r, page_h/2 - 32, GOLD_LT)

    # LEFT panel = BACK COVER (minimal)
    cx_l = half/2
    centred(c, SERIF_ITALIC, 28, 'M',
            cx_l, page_h/2 + 8, GOLD_LT)
    c.setStrokeColor(GOLD_LT); c.setLineWidth(0.4)
    c.line(cx_l - 6*mm, page_h/2 - 4, cx_l + 6*mm, page_h/2 - 4)
    centred(c, SANS, 6, spaced('MobilyHome'), cx_l, page_h/2 - 16, GOLD_LT)
    centred(c, SANS, 6, 'find us on Etsy',     cx_l, page_h/2 - 26, GOLD_LT)

    fold_line(c, page_w, page_h)
    c.showPage()

    # ╔════════════ PAGE 2 — INSIDE SPREAD ════════════╗
    c.setFillColor(BG)
    c.rect(0, 0, page_w, page_h, stroke=0, fill=1)

    pad = 10*mm

    # ── LEFT panel: two dog photos + Our Shelter intro ──
    # Two stacked photos, each cover-fit.
    photo_w = half - 2*pad
    photo_h = 42*mm

    # Top photo: the two dogs on the red bench
    photo_top_y = page_h - pad - photo_h
    draw_image_cover(c, REST_IMG, pad, photo_top_y, photo_w, photo_h)

    # Bottom photo: the small cavalier puppy
    gap = 3*mm
    photo_bot_y = photo_top_y - gap - photo_h
    draw_image_cover(c, PUPPY_IMG, pad, photo_bot_y, photo_w, photo_h)

    # Below photos: "Our Shelter" intro
    text_top = photo_bot_y - 10
    c.setFillColor(INK_3); c.setFont(SANS_BOLD, 7)
    c.drawString(pad, text_top, spaced('our shelter'))

    c.setFillColor(INK); c.setFont(SERIF_BOLD, 15)
    c.drawString(pad, text_top - 16, SHELTER_HEAD)

    wrap(c, SHELTER_BODY, SERIF, 8, photo_w, 10.5,
         pad, text_top - 30, INK_2)

    # ── RIGHT panel: emotional review request + QR ──
    rx = half + pad
    rw = half - 2*pad

    # Stars at top
    c.setFillColor(GOLD); c.setFont(SERIF, 18)
    c.drawString(rx, page_h - pad - 14, '\u2605 \u2605 \u2605 \u2605 \u2605')

    # Eyebrow
    c.setFillColor(INK_3); c.setFont(SANS_BOLD, 7)
    c.drawString(rx, page_h - pad - 30, spaced('a small favour'))

    # Heading (two lines)
    c.setFillColor(INK); c.setFont(SERIF_BOLD, 18)
    c.drawString(rx, page_h - pad - 50, REVIEW_HEAD_1)
    c.drawString(rx, page_h - pad - 70, REVIEW_HEAD_2)

    # Body — emotional plea
    body_y = page_h - pad - 86
    end_y  = wrap(c, REVIEW_BODY, SERIF, 8.5, rw, 11.5, rx, body_y, INK_2)

    # Italic closing line
    c.setFont(SERIF_ITALIC, 9.5); c.setFillColor(INK)
    c.drawString(rx, end_y - 6, CLOSING)

    # Bottom-right QR
    qr_size = 28*mm
    qr_x = page_w - pad - qr_size
    qr_y = pad
    # white card behind the QR for printing safety
    c.setFillColor(white)
    c.rect(qr_x - 2*mm, qr_y - 2*mm, qr_size + 4*mm, qr_size + 4*mm + 6, stroke=0, fill=1)
    draw_image_contain(c, QR_IMG, qr_x, qr_y + 6, qr_size, qr_size)

    # Small label next to QR
    c.setFillColor(INK_3); c.setFont(SANS_BOLD, 6)
    c.drawString(rx, qr_y + qr_size - 6, spaced('scan to leave'))
    c.drawString(rx, qr_y + qr_size - 14, spaced('a review on etsy'))
    c.setFillColor(INK); c.setFont(SERIF_ITALIC, 9)
    c.drawString(rx, qr_y + 4, 'It only takes a minute.')

    fold_line(c, page_w, page_h)
    c.showPage()
    c.save()
    print(f'\u2713 MobilyHome card: {out_path}')

if __name__ == '__main__':
    build()
