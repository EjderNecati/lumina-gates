#!/usr/bin/env python3
"""
Lumina Gates — Architect's Catalogue (PDF generator)

Usage:  python3 tools/build_catalogue.py
Output: dist/Lumina-Gates-Catalogue.pdf
"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY, TA_RIGHT
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, NextPageTemplate,
    Paragraph, Spacer, PageBreak, Image, Table, TableStyle,
)
from reportlab.platypus.flowables import HRFlowable
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from PIL import Image as PILImage

# ── Paths ─────────────────────────────────────────────────────────
HERE        = os.path.dirname(os.path.abspath(__file__))
ROOT        = os.path.dirname(HERE)
PHOTOS_DIR  = os.path.join(ROOT, 'assets', 'products')
DIST_DIR    = os.path.join(ROOT, 'dist')
os.makedirs(DIST_DIR, exist_ok=True)
OUTPUT      = os.path.join(DIST_DIR, 'Lumina-Gates-Catalogue.pdf')

# ── Fonts ─────────────────────────────────────────────────────────
def try_register(name, paths):
    for p in paths:
        if os.path.isfile(p):
            try:
                pdfmetrics.registerFont(TTFont(name, p))
                return name
            except Exception:
                pass
    return None

SERIF        = try_register('Cormorant',        ['/Library/Fonts/Cormorant Garamond.ttf']) or 'Times-Roman'
SERIF_BOLD   = try_register('Cormorant-Bold',   ['/Library/Fonts/Cormorant Garamond Bold.ttf']) or 'Times-Bold'
SERIF_ITALIC = try_register('Cormorant-Italic', ['/Library/Fonts/Cormorant Garamond Italic.ttf']) or 'Times-Italic'
SANS      = 'Helvetica'
SANS_BOLD = 'Helvetica-Bold'

# ── Palette ───────────────────────────────────────────────────────
INK     = HexColor('#0E0E0E')
INK_2   = HexColor('#2A2A2A')
INK_3   = HexColor('#5A5A56')
BG      = HexColor('#F6F2EA')
BG_SOFT = HexColor('#EFE9DD')
LINE    = HexColor('#1A1A1A26')
GOLD    = HexColor('#B89668')
GOLD_LT = HexColor('#C9B388')

PAGE_W, PAGE_H = A4
M = 18 * mm

# ── Paragraph styles ──────────────────────────────────────────────
def st(name, **kw):
    base = dict(fontName=SERIF, fontSize=10, leading=14, textColor=INK)
    base.update(kw)
    return ParagraphStyle(name, **base)

S = {
    'eyebrow':       st('eyebrow',   fontName=SANS_BOLD, fontSize=9, leading=12, textColor=INK_3),
    'eyebrow_c':     st('eyebrow_c', fontName=SANS_BOLD, fontSize=9, leading=12, alignment=TA_CENTER, textColor=INK_3),
    'h1_c':          st('h1_c',      fontName=SERIF_BOLD, fontSize=42, leading=48, alignment=TA_CENTER),
    'h2':            st('h2',        fontName=SERIF_BOLD, fontSize=28, leading=34),
    'h2_c':          st('h2_c',      fontName=SERIF_BOLD, fontSize=28, leading=34, alignment=TA_CENTER),
    'body':          st('body',      fontName=SERIF, fontSize=10.5, leading=16, textColor=INK_2, alignment=TA_JUSTIFY),
    'body_c':        st('body_c',    fontName=SERIF, fontSize=10.5, leading=16, textColor=INK_2, alignment=TA_CENTER),
    'product_name':  st('product_name', fontName=SERIF_BOLD, fontSize=22, leading=26),
    'product_tag':   st('product_tag',  fontName=SERIF_ITALIC, fontSize=11, leading=15, textColor=INK_3),
    'product_desc':  st('product_desc', fontName=SERIF, fontSize=9, leading=13, textColor=INK_2, alignment=TA_JUSTIFY),
    'small':         st('small', fontName=SANS, fontSize=8, leading=11, textColor=INK_3),
}

def spaced(text, gap=2):
    return (' ' * gap).join(text)

# ── Product catalogue ─────────────────────────────────────────────
PRODUCTS = [
    {'id':'aurora','name':'Aurora','material':'plexi','audience':'both','folder':'Yazılı Plexi','image':'123r.png',
     'tagline':'Personalised plexiglass with hand-engraved typography.',
     'description':'A crystal-clear plexiglass panel set in a slim dark frame, finished with hand-engraved typography of your choice. A heritage piece that adds character to the threshold of any home.'},
    {'id':'liten-etched','name':'Liten Etched','material':'plexi','audience':'both','folder':'Yazılı Liten','image':'23rqewda.png',
     'tagline':'A bifold plexiglass gate with a personalised script.',
     'description':'Liten, Swedish for "small". A folding plexiglass gate in an anthracite frame, etched with custom script. For openings where a name or word should greet you.'},
    {'id':'liten','name':'Liten','material':'plexi','audience':'both','folder':'Liten','image':'123qw.png',
     'tagline':'A bifold plexiglass gate in a graphite frame.',
     'description':'Two clear plexiglass panels in a graphite frame that fold flush against the wall. Concealed hinges, magnetic catch, scratch-resistant surface.'},
    {'id':'clear-plexi','name':'Clear','material':'plexi','audience':'both','folder':'Pleksi','image':'12q.png',
     'tagline':'A bifold plexiglass gate in a pale frame.',
     'description':'Pure plexiglass panels in a slim white frame with brass hardware. The brightest, most transparent gate we make, engineered to disappear into the architecture of your home.'},
    {'id':'klar','name':'Klar','material':'plexi','audience':'both','folder':'Klar','image':'wfe.png',
     'tagline':'A wide single-panel plexiglass gate.',
     'description':'Klar, German for "clear". A single, edge-polished plexiglass panel in a substantial graphite frame. Built for landings and wide openings where a single gesture is everything.'},
    {'id':'noord-etched','name':'Noord Etched','material':'plexi','audience':'both','folder':'Yazılı Noord','image':'12eqwd.png',
     'tagline':'A bifold plexiglass gate with bespoke calligraphy.',
     'description':'Noord, Dutch for "north". A bifold plexiglass gate in a soft anthracite frame, hand-engraved with names, dates or words of your choosing.'},
    {'id':'noord','name':'Noord','material':'plexi','audience':'both','folder':'Noord','image':'sdag.png',
     'tagline':'A bifold plexiglass gate in a soft white frame.',
     'description':'Quiet minimalism. Two clear plexiglass panels in a thin white frame with concealed hardware and brass hinges. A study in restraint.'},
    {'id':'bifold-glass','name':'Bifold Glass','material':'plexi','audience':'both','folder':'Bifold Plexi','image':'24erwfds.png',
     'tagline':'A folding plexiglass gate for wide openings.',
     'description':'Two hinged plexiglass panels in pale frames that fold flush against the wall when not in use. Engineered for open-plan kitchens, great rooms and entryways.'},
    {'id':'liten-oak','name':'Liten Oak','material':'plexi','audience':'both','folder':'Liten Ahşap','image':'12ewq.png',
     'tagline':'Oak-framed plexiglass, the warmest hybrid.',
     'description':'Solid European oak frame with a crystal-clear plexiglass panel. The warmth of wood meets the lightness of glass. Hand-finished with natural wax.'},
    {'id':'lugn-oak','name':'Lugn Oak','material':'plexi','audience':'both','folder':'Lugn Ahşap','image':'fhs.png',
     'tagline':'A wide oak-framed plexiglass gate.',
     'description':'Lugn, Swedish for "calm". A slim oak frame holding a single tall plexiglass panel, anchored in graphite mounts. Built for hallways and stair landings.'},
    {'id':'noord-oak','name':'Noord Oak','material':'plexi','audience':'both','folder':'Noord Ahşap','image':'q3argewfds.png',
     'tagline':'A bifold oak-framed plexiglass gate.',
     'description':'Two clear plexiglass panels in a natural oak frame, joined with brass hinges. The Noord line, warmed with wood.'},
    {'id':'flat-cat','name':'Flat Cat','material':'wood','audience':'cat','folder':'Flat Cat','image':'23rqewdfa.png',
     'tagline':'A panelled wooden gate with a built-in cat door.',
     'description':'A painted solid-wood gate with a discreet cat passage cut into the lower panel. Soft shaker detailing and brushed-steel hinges. Made for households where cats need to come and go.'},
    {'id':'elegant','name':'Elegant','material':'wood','audience':'both','folder':'Elegant','image':'1235r.png',
     'tagline':'A painted-wood gate with a diagonal slat reveal.',
     'description':'Our signature wood gate. A solid panel with diagonal slat-work that lets light through without compromising containment. Brass hinges, painted finish, hand-detailed edges.'},
    {'id':'trygg-cat','name':'Trygg Cat','material':'wood','audience':'cat','folder':'Tyrgg Cat','image':'3qrwd.png',
     'tagline':'A slatted wooden gate, cat-edition.',
     'description':'Trygg, Swedish for "safe". A solid-wood gate with vertical slat work, painted in deep jet black. A cat-scaled mirror to our flagship Trygg.'},
    {'id':'lux','name':'Lux','material':'wood','audience':'both','folder':'Lüx','image':'aszxc.png',
     'tagline':'A painted-wood lattice, our flagship.',
     'description':'Our most photographed model. An intricate lattice in painted solid wood, with brass-tipped hardware and concealed hinges. A piece of joinery that elevates the rooms it bridges.'},
    {'id':'flink','name':'Flink','material':'wood','audience':'both','folder':'Flink','image':'qw.png',
     'tagline':'A vertical-slat wooden gate, tool-free install.',
     'description':'Flink, Swedish for "quick". A vertical-slat wooden gate with brass-tipped wall mounts and a streamlined installation system. Refined craft, fast install.'},
    {'id':'laga','name':'Laga','material':'wood','audience':'both','folder':'Laga','image':'sda.png',
     'tagline':'A vertical-slat wooden gate, finished in soft white.',
     'description':'Laga, Swedish for "to build". A solid-wood gate with hand-finished vertical slats and brass-tipped hardware. Built for stair landings and the high-traffic family home.'},
    {'id':'trygg','name':'Trygg','material':'wood','audience':'both','folder':'Tyrgg','image':'1.png',
     'tagline':'A slatted wooden gate, engineered for daily life.',
     'description':'Reinforced corners, a child-resistant double-action latch and graphite-painted vertical slats on solid wood. Trygg is the everyday gate built to outlast routine.'},
    {'id':'elegant-cat','name':'Elegant Cat','material':'wood','audience':'cat','folder':'Elegant Cat','image':'t3q4erf.png',
     'tagline':'The Elegant silhouette, cat-edition.',
     'description':'All the architectural restraint of Elegant, scaled for cats. A solid wooden gate with an arched cat passage and diagonal slat reveal, finished in jet black.'},
    {'id':'lux-2','name':'Lux II','material':'wood','audience':'both','folder':'Lüx 2','image':'12e.png',
     'tagline':'A painted-wood chevron-lattice gate.',
     'description':'The second generation Lux. A solid-wood chevron lattice in deep matte black with brushed-steel hardware. Also available in soft white. Built for grand-room thresholds.'},
    {'id':'lux-3','name':'Lux III','material':'wood','audience':'both','folder':'Lüx 3','image':'12eqwd.png',
     'tagline':'A painted-wood gate with diamond lattice.',
     'description':'The third generation Lux. A solid-wood diamond lattice in deep jet black, with brushed-steel hardware. A heritage piece for our most architectural homes.'},
    {'id':'lux-3-oak','name':'Lux III Oak','material':'wood','audience':'both','folder':'Lüx 3 Ahşap','image':'wertbg.png',
     'tagline':'The Lux III silhouette in solid oak.',
     'description':'The Lux III diamond lattice executed in solid European oak, hand-finished with natural wax. The warmest interpretation of our flagship.'},
    {'id':'glide','name':'Glide','material':'wood','audience':'both','folder':'Sliding Wood','image':'FREADSV.png',
     'tagline':'A sliding solid-wood gate on a steel track.',
     'description':'Horizontal solid-wood slats on a wall-mounted steel track, gliding silently. For homeowners who prize uninterrupted floor space.'},
    {'id':'double-barn','name':'Double Barn','material':'wood','audience':'both','folder':'Double Barn','image':'arefds.png',
     'tagline':'Twin painted-wood barn panels.',
     'description':'Two cross-braced solid-wood panels that meet in the middle, finished in soft white with brass hardware. Inspired by traditional barn doors.'},
    {'id':'flat-oak','name':'Flat Oak Cat','material':'wood','audience':'cat','folder':'Cat Flat Ahşap','image':'FWEA.png',
     'tagline':'A panelled oak gate with a built-in cat door.',
     'description':'A cat-scaled gate in solid European oak, finished with natural oils. A discreet cat passage cut into the lower panel.'},
    {'id':'lux-2-oak','name':'Lux II Oak','material':'wood','audience':'both','folder':'Lüx 2 Ahşap','image':'frewa.png',
     'tagline':'The Lux II form in solid oak.',
     'description':'The Lux II chevron lattice in solid European oak. Mortise-and-tenon joinery, natural-oil finish, brushed-steel mounts.'},
    {'id':'barnhall-plus','name':'Barnhall Plus','material':'wood','audience':'cat','folder':'Barnhall +','image':'124.png',
     'tagline':'Our barn gate with a built-in cat passage.',
     'description':'A solid-wood barn gate with a reinforced X-brace and an arched cat passage cut into the lower panel. The classic Barnhall silhouette, made for households with cats.'},
    {'id':'stappa','name':'Stappa','material':'wood','audience':'both','folder':'Stappa','image':'wqesd.png',
     'tagline':'A folding wooden gate with vertical slats.',
     'description':'Stappa, Swedish for "step". A multi-panel folding wooden gate in soft white, with vertical slat reveals and brass hinges. Adapts to wide openings.'},
    {'id':'barnhall','name':'Barnhall','material':'wood','audience':'both','folder':'Barnhall','image':'124ew.png',
     'tagline':'The original Lumina barn gate.',
     'description':'A single cross-braced solid-wood panel, painted in jet black with brushed-steel hardware. The gate that started our wood collection.'},
]

# ── Long-form copy ────────────────────────────────────────────────
INTRO_TEXT = (
"Lumina Gates designs and builds bespoke gates for the most considered "
"homes in the world. Every piece is made to order, configured to the "
"inch, finished by hand in our atelier, and shipped (by us, with care) "
"to your project, anywhere on the map.<br/><br/>"

"This catalogue is for architects, interior designers, contractors and "
"developers who want a safety gate that belongs to the room it lives in. "
"It outlines our materials, our standard dimensions, the customisations "
"available to your client, and the full collection of twenty-nine "
"signature designs: eleven in optical-grade plexiglass and eighteen "
"in solid wood.<br/><br/>"

"Every gate is built one at a time, to your project. The full collection "
"and a live made-to-order configurator are available online at "
"<b>luminagates.com</b>."
)

MATERIALS_TEXT = (
"<b>Optical-grade plexiglass, 4&nbsp;mm.</b> Edge-polished, scratch-resistant, "
"shatter-tested. CNC-cut from a single sheet and bonded into frames of "
"brushed aluminium, painted hardwood or solid oak.<br/><br/>"

"<b>Solid wood, 18&nbsp;mm and 30&nbsp;mm.</b> 18&nbsp;mm for our lattice "
"and slatted designs (Lux, Flink, Trygg); 30&nbsp;mm for barn and panel "
"constructions (Barnhall, Double Barn, Flat Cat). Sourced from "
"sustainably managed European forests; finished by hand with low-VOC "
"oils, wax or water-based paint.<br/><br/>"

"<b>Hardware.</b> Brass, brushed steel, or matte black. Concealed "
"soft-close hinges, double-action child-resistant latches, and "
"wall-mount installation with concealed brackets, complete with "
"mounting templates and an installation handbook.<br/><br/>"

"<b>Wood species.</b> European oak by default. On request: American "
"walnut, ash, beech, maple, sapele or any specified species. Enquire at "
"specification stage for lead time."
)

DIMENSIONS_TEXT = (
"<b>Standard height: 70&nbsp;cm (27.5&nbsp;in).</b> Tested against "
"international child and pet safety standards.<br/><br/>"

"<b>Width: fully bespoke.</b> Standard range 30 to 137&nbsp;cm (12 to "
"54&nbsp;in); no upper limit. We have built gates as wide as 3&nbsp;m "
"(10&nbsp;ft) for grand-room thresholds.<br/><br/>"

"<b>Height: fully bespoke.</b> No minimum or maximum. Cat-scaled gates "
"from 40&nbsp;cm; stair-landing gates above 110&nbsp;cm.<br/><br/>"

"<b>Tolerance.</b> &plusmn;2&nbsp;mm on every cut, joint and panel.<br/><br/>"

"Every gate is made to order. Each project is quoted individually on "
"the basis of dimensions, material, finish and hardware."
)

CUSTOMISATION_TEXT = (
"Specify the following with your enquiry and we will respond within one "
"working day:<br/><br/>"

"<b>Opening dimensions.</b> Width and height in mm or inches.<br/>"
"<b>Material.</b> Plexiglass, solid wood, or hybrid (oak frame, plexi panel).<br/>"
"<b>Wood species.</b> Oak (default), walnut, ash, beech, maple, sapele or specify.<br/>"
"<b>Finish.</b> White, jet black, anthracite, natural oak, unfinished, or any RAL / Pantone / Farrow &amp; Ball.<br/>"
"<b>Hardware.</b> Brass, brushed steel, or matte black.<br/>"
"<b>Mounting.</b> Wall-mount with concealed brackets.<br/>"
"<b>Engraving.</b> Hand-engraved names or scripts (Aurora, Liten Etched, Noord Etched).<br/><br/>"

"For configurations beyond this list (bi-fold, oversized barn doors, "
"bespoke lattices, hospitality projects), write to us or browse the "
"full collection online at <b>luminagates.com</b>."
)

PROVENANCE_TEXT = (
"Lumina Gates has shipped more than one thousand made-to-order gates "
"to private clients, interior designers and architects across Europe, "
"the United Kingdom, the United States and beyond. The designs in this "
"catalogue have been refined over years of practice and feedback from "
"the field.<br/><br/>"

"We ship worldwide. Standard delivery to the UK and EU is two to three "
"weeks from order confirmation. The United States, Canada and Australia "
"are typically three to four weeks. White-glove installation is "
"available in selected metropolitan areas on request.<br/><br/>"

"Trade access and specification packs are available to professional "
"buyers. Please introduce your studio or practice by email and we will "
"respond within one working day. The full collection can also be "
"explored online at <b>luminagates.com</b>."
)

# ── Helpers ───────────────────────────────────────────────────────
CACHE_DIR = os.path.join(DIST_DIR, '_cache')
os.makedirs(CACHE_DIR, exist_ok=True)

def optimised_image_path(prod, max_dim=1600, quality=82):
    """Re-save a product photo as a smaller JPEG so the PDF stays slim."""
    src = os.path.join(PHOTOS_DIR, prod['folder'], prod['image'])
    if not os.path.isfile(src):
        return None
    cached = os.path.join(CACHE_DIR, f'{prod["id"]}.jpg')
    if os.path.isfile(cached):
        return cached
    with PILImage.open(src) as im:
        im = im.convert('RGB')  # drop alpha; JPEG can't carry it
        im.thumbnail((max_dim, max_dim), PILImage.LANCZOS)
        im.save(cached, 'JPEG', quality=quality, optimize=True, progressive=True)
    return cached

def fit_image(path, max_w, max_h):
    if not path or not os.path.isfile(path):
        return None
    with PILImage.open(path) as im:
        iw, ih = im.size
    ratio = min(max_w / iw, max_h / ih)
    return Image(path, width=iw * ratio, height=ih * ratio)

# ── Page-template painters ────────────────────────────────────────
def paint_cover(c, doc):
    c.saveState()
    c.setFillColor(INK)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    c.restoreState()

def paint_normal(c, doc):
    c.saveState()
    c.setFillColor(BG)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    # Footer
    c.setStrokeColor(LINE); c.setLineWidth(0.4)
    c.line(M, 16*mm, PAGE_W - M, 16*mm)
    c.setFont(SANS, 7); c.setFillColor(INK_3)
    c.drawString(M, 11*mm, 'L U M I N A   G A T E S')
    c.setFont(SANS, 6.5)
    c.drawCentredString(PAGE_W / 2, 11*mm, 'luminagates.com  \u00b7  dogukan@luminagates.com')
    c.setFont(SANS, 7); c.setFillColor(INK_3)
    # page number minus the cover
    c.drawRightString(PAGE_W - M, 11*mm, f'{doc.page - 1:02d}')
    c.restoreState()

# ── Build ─────────────────────────────────────────────────────────
def build():
    doc = BaseDocTemplate(
        OUTPUT, pagesize=A4,
        leftMargin=M, rightMargin=M,
        topMargin=22*mm, bottomMargin=22*mm,
        title="Lumina Gates Architect's Catalogue",
        author='Lumina Gates',
        subject='2026 collection of child and pet gates',
    )

    frame = Frame(M, 22*mm, PAGE_W - 2*M, PAGE_H - 44*mm,
                  leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0,
                  id='content')

    doc.addPageTemplates([
        PageTemplate(id='cover',  frames=[frame], onPage=paint_cover),
        PageTemplate(id='normal', frames=[frame], onPage=paint_normal),
    ])

    story = []

    # ── COVER ─────────────────────────────────────────────────────
    # Use a Frame that fills the page; reportlab will draw on cover bg.
    story.append(Spacer(1, 60*mm))
    story.append(Paragraph(spaced('LUMINA', 4),
        ParagraphStyle('cb', fontName=SERIF_BOLD, fontSize=68, leading=72,
                       alignment=TA_CENTER, textColor=white)))
    story.append(Spacer(1, 2*mm))
    story.append(Paragraph('<i>Gates Atelier</i>',
        ParagraphStyle('ck', fontName=SERIF_ITALIC, fontSize=20, leading=24,
                       alignment=TA_CENTER, textColor=GOLD_LT)))
    story.append(Spacer(1, 26*mm))
    story.append(HRFlowable(width=60*mm, thickness=0.6, color=GOLD_LT, hAlign='CENTER'))
    story.append(Spacer(1, 22*mm))
    story.append(Paragraph('The Architect&rsquo;s Catalogue',
        ParagraphStyle('cs', fontName=SERIF_ITALIC, fontSize=26, leading=32,
                       alignment=TA_CENTER, textColor=white)))
    story.append(Spacer(1, 6*mm))
    story.append(Paragraph('Bespoke child &amp; pet gates &middot; Crafted in Turkey &middot; Shipped worldwide',
        ParagraphStyle('cm', fontName=SANS, fontSize=9, leading=12,
                       alignment=TA_CENTER, textColor=GOLD_LT)))
    story.append(Spacer(1, 60*mm))
    story.append(Paragraph('<link href="https://luminagates.com" color="#C9B388">L U M I N A G A T E S . C O M</link>',
        ParagraphStyle('cu', fontName=SANS_BOLD, fontSize=10, leading=14,
                       alignment=TA_CENTER, textColor=GOLD_LT)))
    story.append(Spacer(1, 4*mm))
    story.append(Paragraph('2026 Collection',
        ParagraphStyle('cy', fontName=SANS, fontSize=8, leading=11,
                       alignment=TA_CENTER, textColor=white)))

    # Switch to normal template AFTER the cover
    story.append(NextPageTemplate('normal'))
    story.append(PageBreak())

    # ── PAGE 2: THE ATELIER (Intro + Provenance) ─────────────────
    story.append(Spacer(1, 8*mm))
    story.append(Paragraph('T H E   A T E L I E R', S['eyebrow_c']))
    story.append(Spacer(1, 4*mm))
    story.append(Paragraph('A gate, reconsidered.', S['h1_c']))
    story.append(Spacer(1, 3*mm))
    story.append(Paragraph('For the most considered homes in the world.',
        ParagraphStyle('introit', fontName=SERIF_ITALIC, fontSize=14, leading=18,
                       alignment=TA_CENTER, textColor=INK_3)))
    story.append(Spacer(1, 8*mm))
    story.append(HRFlowable(width=24*mm, thickness=0.6, color=GOLD, hAlign='CENTER'))
    story.append(Spacer(1, 8*mm))
    story.append(Paragraph(INTRO_TEXT, S['body']))
    story.append(Spacer(1, 6*mm))
    story.append(HRFlowable(width='100%', thickness=0.3, color=LINE))
    story.append(Spacer(1, 6*mm))
    story.append(Paragraph('P R O V E N A N C E', S['eyebrow']))
    story.append(Spacer(1, 2*mm))
    story.append(Paragraph('One thousand gates in the field.',
        ParagraphStyle('h2sm', fontName=SERIF_BOLD, fontSize=20, leading=24, textColor=INK)))
    story.append(Spacer(1, 4*mm))
    story.append(Paragraph(PROVENANCE_TEXT, S['body']))
    story.append(PageBreak())

    # ── PAGE 3: SPECIFICATIONS (Materials + Dimensions + Customisation) ──
    story.append(Spacer(1, 4*mm))
    story.append(Paragraph('S P E C I F I C A T I O N S', S['eyebrow_c']))
    story.append(Spacer(1, 3*mm))
    story.append(Paragraph('Materials, dimensions, customisation.',
        ParagraphStyle('h1sp', fontName=SERIF_BOLD, fontSize=32, leading=36, alignment=TA_CENTER, textColor=INK)))
    story.append(Spacer(1, 4*mm))
    story.append(HRFlowable(width=24*mm, thickness=0.6, color=GOLD, hAlign='CENTER'))
    story.append(Spacer(1, 6*mm))

    spec_body = ParagraphStyle('specbody', parent=S['body'], fontSize=8.5, leading=12)
    section_h = ParagraphStyle('sech', fontName=SANS_BOLD, fontSize=8.5, leading=11, textColor=INK_3)

    story.append(Paragraph('M A T E R I A L S   &amp;   C O N S T R U C T I O N', section_h))
    story.append(Spacer(1, 2*mm))
    story.append(Paragraph(MATERIALS_TEXT, spec_body))
    story.append(Spacer(1, 4*mm))
    story.append(HRFlowable(width='100%', thickness=0.3, color=LINE))
    story.append(Spacer(1, 4*mm))

    story.append(Paragraph('S T A N D A R D   D I M E N S I O N S', section_h))
    story.append(Spacer(1, 2*mm))
    story.append(Paragraph(DIMENSIONS_TEXT, spec_body))
    story.append(Spacer(1, 4*mm))
    story.append(HRFlowable(width='100%', thickness=0.3, color=LINE))
    story.append(Spacer(1, 4*mm))

    story.append(Paragraph('C U S T O M I S A T I O N', section_h))
    story.append(Spacer(1, 2*mm))
    story.append(Paragraph(CUSTOMISATION_TEXT, spec_body))
    story.append(PageBreak())

    # ── PRODUCT PAGES (2 per page) ────────────────────────────────
    avail_w = PAGE_W - 2 * M
    avail_h = PAGE_H - 44*mm
    half_h = (avail_h - 8*mm) / 2
    img_w = avail_w * 0.42
    img_h = half_h - 4*mm

    def product_row(prod):
        path = optimised_image_path(prod)
        img = fit_image(path, img_w, img_h) if path else Paragraph('<i>image missing</i>', S['small'])

        material_label = 'Optical-grade plexiglass, 4&nbsp;mm' if prod['material'] == 'plexi' else 'Solid wood, 18&nbsp;/&nbsp;30&nbsp;mm'
        audience_label = 'Cat Edition' if prod['audience'] == 'cat' else 'Child &amp; Pet'

        spec_rows = [
            ('Material',  material_label),
            ('Audience',  audience_label),
            ('Standard height', '70&nbsp;cm / 27.5&nbsp;in  (custom on request)'),
            ('Width',     'Fully bespoke, no upper limit'),
            ('Finishes',  'White, black, anthracite, natural oak, unfinished, or any RAL / Pantone'),
            ('Hardware',  'Brass, brushed steel, or matte black'),
            ('Mounting',  'Wall-mount with concealed brackets'),
        ]
        spec_flow = []
        for label, value in spec_rows:
            spec_flow.append(Paragraph(
                f'<font name="{SANS}" size="6.5" color="#5A5A56">{label.upper()}</font><br/>'
                f'<font name="{SERIF}" size="8.5" color="#1f1f1f">{value}</font>',
                ParagraphStyle('sp', leading=11, spaceAfter=2)
            ))

        eyebrow_txt = ('CAT EDITION' if prod['audience'] == 'cat' else 'CHILD & PET') + \
                      '  ·  ' + ('PLEXIGLASS' if prod['material'] == 'plexi' else 'SOLID WOOD')

        info_flow = [
            Paragraph(eyebrow_txt,
                ParagraphStyle('eyi', fontName=SANS_BOLD, fontSize=7.5, leading=10, textColor=INK_3)),
            Spacer(1, 2*mm),
            Paragraph(prod['name'], S['product_name']),
            Spacer(1, 1*mm),
            Paragraph(prod['tagline'], S['product_tag']),
            Spacer(1, 3*mm),
            HRFlowable(width='40%', thickness=0.4, color=GOLD),
            Spacer(1, 3*mm),
            Paragraph(prod['description'], S['product_desc']),
            Spacer(1, 4*mm),
        ] + spec_flow

        info_cell = Table([[info_flow]],
                          colWidths=[avail_w - img_w - 6*mm],
                          rowHeights=[half_h])
        info_cell.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('LEFTPADDING', (0,0), (-1,-1), 6*mm),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
            ('TOPPADDING', (0,0), (-1,-1), 0),
            ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ]))

        # The image cell: a Table cell so we can give it a soft background
        img_cell = Table([[img]], colWidths=[img_w], rowHeights=[half_h])
        img_cell.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), BG_SOFT),
            ('VALIGN',    (0,0), (-1,-1), 'MIDDLE'),
            ('ALIGN',     (0,0), (-1,-1), 'CENTER'),
            ('LEFTPADDING', (0,0), (-1,-1), 6),
            ('RIGHTPADDING', (0,0), (-1,-1), 6),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ]))

        row = Table([[img_cell, info_cell]], colWidths=[img_w, avail_w - img_w])
        row.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
            ('TOPPADDING', (0,0), (-1,-1), 0),
            ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ]))
        return row

    for i in range(0, len(PRODUCTS), 2):
        pair = PRODUCTS[i:i+2]
        story.append(product_row(pair[0]))
        story.append(Spacer(1, 8*mm))
        if len(pair) == 2:
            story.append(product_row(pair[1]))
        story.append(PageBreak())

    # ── CLOSING ───────────────────────────────────────────────────
    story.append(Spacer(1, 70*mm))
    story.append(Paragraph('T H A N K   Y O U', S['eyebrow_c']))
    story.append(Spacer(1, 8*mm))
    story.append(Paragraph('Let&rsquo;s build something.', S['h1_c']))
    story.append(Spacer(1, 14*mm))
    story.append(HRFlowable(width=24*mm, thickness=0.6, color=GOLD, hAlign='CENTER'))
    story.append(Spacer(1, 14*mm))
    contact_text = (
        "For trade access, project enquiries, lead-time confirmations and "
        "custom specifications, please write to us at:<br/><br/>"
        f"<font size='13' name='{SERIF_BOLD}'>dogukan@luminagates.com</font><br/><br/>"
        "Browse the full collection and the live configurator online:<br/>"
        f"<font size='13' name='{SERIF_BOLD}'>"
        "<link href='https://luminagates.com' color='#0E0E0E'>luminagates.com</link>"
        "</font><br/><br/>"
        "Atelier: Turkey &middot; shipped worldwide<br/><br/>"
        "Every gate is made to order. We respond to professional enquiries "
        "within one working day."
    )
    story.append(Paragraph(contact_text, S['body_c']))
    story.append(Spacer(1, 18*mm))
    story.append(HRFlowable(width=24*mm, thickness=0.4, color=GOLD, hAlign='CENTER'))
    story.append(Spacer(1, 8*mm))
    story.append(Paragraph('Lumina Gates &middot; 2026 Architect&rsquo;s Catalogue',
        ParagraphStyle('end', fontName=SANS, fontSize=8, alignment=TA_CENTER, textColor=INK_3)))

    doc.build(story)
    print(f'✓ Catalogue rendered: {OUTPUT}')

if __name__ == '__main__':
    build()
