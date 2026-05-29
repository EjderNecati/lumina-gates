// Lumina Gates — Product catalog & pricing engine

const PRICE_TIERS = {
  plexi: [
    { minW: 0,  maxW: 12, price: 100  },
    { minW: 12, maxW: 18, price: 300  },
    { minW: 18, maxW: 24, price: 400  },
    { minW: 24, maxW: 30, price: 500  },
    { minW: 30, maxW: 36, price: 600  },
    { minW: 36, maxW: 42, price: 700  },
    { minW: 42, maxW: 48, price: 900  },
    { minW: 48, maxW: 54, price: 1100 }
  ],
  wood: [
    { minW: 0,  maxW: 12, price: 100  },
    { minW: 12, maxW: 18, price: 200  },
    { minW: 18, maxW: 24, price: 300  },
    { minW: 24, maxW: 30, price: 400  },
    { minW: 30, maxW: 36, price: 500  },
    { minW: 36, maxW: 42, price: 600  },
    { minW: 42, maxW: 48, price: 800  },
    { minW: 48, maxW: 54, price: 1000 }
  ]
};

const DEFAULT_HEIGHT_INCH = 27.5;   // 70 cm
const DEFAULT_HEIGHT_CM   = 70;
const HEIGHT_DEVIATION_FEE = 20;    // flat add-on as soon as height differs from 27.5"
const OVERSIZE_THRESHOLD   = 54;    // inches
const OVERSIZE_BLOCK       = 6;     // every 6 inches beyond 54
const OVERSIZE_FEE         = 100;   // $100 per 6-inch block (not discounted)
const GLOBAL_DISCOUNT      = 0.5;   // 50% off tier price only

const COLORS = [
  { id: 'white',      name: 'Pure White',  hex: '#F7F5F0', ring: '#D9D4C7' },
  { id: 'black',      name: 'Jet Black',   hex: '#0E0E0E', ring: '#0E0E0E' },
  { id: 'anthracite', name: 'Anthracite',  hex: '#2F343A', ring: '#2F343A' },
  { id: 'natural',    name: 'Natural Oak', hex: '#C29365', ring: '#A77B4D' },
  { id: 'unfinished', name: 'Unfinished',  hex: '#E2CFA8', ring: '#C9B388' },
  { id: 'other',      name: 'Other',       hex: 'custom',  ring: '#A6A6A6' }
];

// 29 gates — each item's material reflects what the photos actually show
const PRODUCTS = [
  // ─────────────────────────────────────────────────────────
  //  PLEXIGLASS COLLECTION (12) — clear panel is the hero
  // ─────────────────────────────────────────────────────────
  { id: 'aurora',         name: 'Aurora',          material: 'plexi',
    audience: 'both', collection: 'Plexiglass',
    folder: 'Yazılı Plexi',
    images: ['123r.png','124.png','21qwr.png','q.png'],
    tagline: 'Personalised plexiglass with hand-engraved typography.',
    description: 'A crystal-clear plexiglass panel set in a slim dark frame, finished with hand-engraved typography of your choice. A heritage piece that adds character to the threshold of any home.',
    tagline_tr: 'El kazıma tipografi ile kişiselleştirilmiş pleksiglas.',
    description_tr: 'İnce koyu çerçeve içinde kristal berraklığında pleksiglas panel; istediğiniz yazıyla el kazıma ile bitirildi. Evinizin eşiğine karakter katacak bir miras parçası.' },

  { id: 'liten-etched',   name: 'Liten Etched',    material: 'plexi',
    audience: 'both', collection: 'Plexiglass',
    folder: 'Yazılı Liten',
    images: ['23rqewda.png','ewfsdac.png','t35agerfs.png','wefsd.png'],
    tagline: 'A bifold plexiglass gate with a personalised script.',
    description: 'Liten — Swedish for "small". A folding plexiglass gate in an anthracite frame, etched with custom script. For openings where a name or word should greet you.',
    tagline_tr: 'Kişiselleştirilmiş yazılı katlanır pleksiglas kapı.',
    description_tr: 'Liten — İsveççe "küçük" anlamına gelir. Antrasit çerçeveli, özel yazıyla kazınmış katlanır pleksiglas kapı. Sizi bir isim ya da kelimenin karşıladığı geçişler için.' },

  { id: 'liten',          name: 'Liten',           material: 'plexi',
    audience: 'both', collection: 'Plexiglass',
    folder: 'Liten',
    images: ['123qw.png','12e.png','23r.png','23r1.png','23rqewa.png','3t4qew.png'],
    tagline: 'A bifold plexiglass gate in a graphite frame.',
    description: 'Two clear plexiglass panels in a graphite frame that fold flush against the wall. Concealed hinges, magnetic catch, scratch-resistant surface.',
    tagline_tr: 'Grafit çerçeveli, katlanır pleksiglas kapı.',
    description_tr: 'Grafit çerçeve içinde, duvara hizalanacak şekilde katlanan iki şeffaf pleksiglas panel. Gizli menteşeler, manyetik kapanma, çizilmeye dayanıklı yüzey.' },


  { id: 'clear-plexi',    name: 'Clear',           material: 'plexi',
    audience: 'both', collection: 'Plexiglass',
    folder: 'Pleksi',
    images: ['12q.png','12q3wefsdvc.png','12qewds.png','12r3qwefsd.png','q3rwefsadxz.png','wqadszcx.png'],
    tagline: 'A bifold plexiglass gate in a pale frame.',
    description: 'Pure plexiglass panels in a slim white frame with brass hardware. The brightest, most transparent gate we make — engineered to disappear into the architecture of your home.',
    tagline_tr: 'Açık tonlu çerçeveli katlanır pleksiglas kapı.',
    description_tr: 'İnce beyaz çerçeve ve pirinç donanımla saf pleksiglas paneller. Yaptığımız en parlak ve şeffaf kapı — evinizin mimarisine kusursuz uyum sağlayacak şekilde tasarlandı.' },

  { id: 'klar',           name: 'Klar',            material: 'plexi',
    audience: 'both', collection: 'Plexiglass',
    folder: 'Klar',
    images: ['wfe.png','jknb.png','23q.png','2r3qwe.png','1eq23.png'],
    tagline: 'A wide single-panel plexiglass gate.',
    description: 'Klar — German for "clear". A single, edge-polished plexiglass panel in a substantial graphite frame. Built for landings and wide openings where a single gesture is everything.',
    tagline_tr: 'Geniş, tek panelli pleksiglas kapı.',
    description_tr: 'Klar — Almanca "berrak" anlamına gelir. Geniş grafit çerçeve içinde, kenarları cilalı tek pleksiglas panel. Tek bir hamlenin yeterli olduğu sahanlıklar ve geniş geçişler için.' },

  { id: 'noord-etched',   name: 'Noord Etched',    material: 'plexi',
    audience: 'both', collection: 'Plexiglass',
    folder: 'Yazılı Noord',
    images: ['12eqwd.png','2r3we.png','2rewf.png','2t4ewf.png','r32qefw.png'],
    tagline: 'A bifold plexiglass gate with bespoke calligraphy.',
    description: 'Noord — Dutch for "north". A bifold plexiglass gate in a soft anthracite frame, hand-engraved with names, dates or words of your choosing.',
    tagline_tr: 'Özel yazı işlemeli katlanır pleksiglas kapı.',
    description_tr: 'Noord — Felemenkçe "kuzey" anlamına gelir. Yumuşak antrasit çerçeve içinde, seçtiğiniz isim, tarih veya kelimelerle el kazıma katlanır pleksiglas kapı.' },

  { id: 'noord',          name: 'Noord',           material: 'plexi',
    audience: 'both', collection: 'Plexiglass',
    folder: 'Noord',
    images: ['sdag.png','wefS.png','AWSD.png','asdgf.png','aergsd.png','wterag.png','wasd.png'],
    tagline: 'A bifold plexiglass gate in a soft white frame.',
    description: 'Quiet minimalism. Two clear plexiglass panels in a thin white frame with concealed hardware and brass hinges. A study in restraint.',
    tagline_tr: 'Yumuşak beyaz çerçeveli katlanır pleksiglas kapı.',
    description_tr: 'Sessiz minimalizm. İnce beyaz çerçeve, gizli donanım ve pirinç menteşelerle iki şeffaf pleksiglas panel. Ölçülü tasarımın özeti.' },

  { id: 'bifold-glass',   name: 'Bifold Glass',    material: 'plexi',
    audience: 'both', collection: 'Plexiglass',
    folder: 'Bifold Plexi',
    images: ['24erwfds.png','2r3ewfq.png','32rewfsdcx.png','jhgv.png','t3erfds.png'],
    tagline: 'A folding plexiglass gate for wide openings.',
    description: 'Two hinged plexiglass panels in pale frames that fold flush against the wall when not in use. Engineered for open-plan kitchens, great rooms and entryways.',
    tagline_tr: 'Geniş geçişler için katlanır pleksiglas kapı.',
    description_tr: 'Açık tonlu çerçeve içinde, kullanılmadığında duvara hizalanan iki menteşeli pleksiglas panel. Açık plan mutfaklar, büyük odalar ve girişler için tasarlandı.' },

  { id: 'liten-oak',      name: 'Liten Oak',       material: 'plexi',
    audience: 'both', collection: 'Plexiglass',
    folder: 'Liten Ahşap',
    images: ['12ewq.png','2.png','adsf.png','erfw.png'],
    tagline: 'Oak-framed plexiglass — the warmest hybrid.',
    description: 'Solid European oak frame with a crystal-clear plexiglass panel. The warmth of wood meets the lightness of glass. Hand-finished with natural wax.',
    tagline_tr: 'Meşe çerçeveli pleksiglas — en sıcak karma.',
    description_tr: 'Masif Avrupa meşesi çerçeve, kristal berraklığında pleksiglas panel. Ahşabın sıcaklığı camın hafifliğiyle buluşur. Doğal vaks ile el cilalı.' },

  { id: 'lugn-oak',       name: 'Lugn Oak',        material: 'plexi',
    audience: 'both', collection: 'Plexiglass',
    folder: 'Lugn Ahşap',
    images: ['fhs.png','wer.png','wef.png','aerfswd.png','dsfg.png','qw.png','ergafds.png'],
    tagline: 'A wide oak-framed plexiglass gate.',
    description: 'Lugn — Swedish for "calm". A slim oak frame holding a single tall plexiglass panel, anchored in graphite mounts. Built for hallways and stair landings.',
    tagline_tr: 'Geniş, meşe çerçeveli pleksiglas kapı.',
    description_tr: 'Lugn — İsveççe "sakin" anlamına gelir. İnce meşe çerçeve içinde tek uzun pleksiglas panel, grafit montajlarla sabitlenmiş. Koridorlar ve merdiven sahanlıkları için.' },

  { id: 'noord-oak',      name: 'Noord Oak',       material: 'plexi',
    audience: 'both', collection: 'Plexiglass',
    folder: 'Noord Ahşap',
    images: ['q3argewfds.png','asdfg.png','123q.png','2r3.png','wefasd.png','34qrfewds.png'],
    tagline: 'A bifold oak-framed plexiglass gate.',
    description: 'Two clear plexiglass panels in a natural oak frame, joined with brass hinges. The Noord line, warmed with wood.',
    tagline_tr: 'Meşe çerçeveli katlanır pleksiglas kapı.',
    description_tr: 'Doğal meşe çerçeve içinde, pirinç menteşelerle birleştirilmiş iki şeffaf pleksiglas panel. Ahşabın sıcaklığıyla Noord serisi.' },

  // ─────────────────────────────────────────────────────────
  //  WOOD COLLECTION (17) — solid wood is the hero
  // ─────────────────────────────────────────────────────────
  { id: 'flat-cat',       name: 'Flat Cat',        material: 'wood',
    audience: 'cat', collection: 'Wood',
    folder: 'Flat Cat',
    images: ['23rqewdfa.png','e123rqw.png','qfaewdsc.png'],
    tagline: 'A panelled wooden gate with a built-in cat door.',
    description: 'A painted solid-wood gate with a discreet cat passage cut into the lower panel. Soft shaker detailing and brushed-steel hinges. Made for households where cats need to come and go.',
    tagline_tr: 'Dahili kedi geçişi olan panelli ahşap kapı.',
    description_tr: 'Alt panele gizli bir kedi geçişi açılmış, boyalı masif ahşap kapı. Yumuşak shaker detayları ve fırçalanmış çelik menteşeler. Kedilerin gelip gitmesi gereken evler için.' },

  { id: 'elegant',        name: 'Elegant',         material: 'wood',
    audience: 'both', collection: 'Wood',
    folder: 'Elegant',
    images: ['1235r.png','2134.png','wqefasD.png','23wef.png','123.png','32rqwe.png','23QRWEFASD.png'],
    tagline: 'A painted-wood gate with a diagonal slat reveal.',
    description: 'Our signature wood gate. A solid panel with diagonal slat-work that lets light through without compromising containment. Brass hinges, painted finish, hand-detailed edges.',
    tagline_tr: 'Çapraz slat detaylı, boyalı ahşap kapı.',
    description_tr: 'İmza ahşap kapımız. Tutmadan ödün vermeden ışığı geçiren çapraz slat işçilikli masif panel. Pirinç menteşeler, boyalı cila, el detayı kenarlar.' },

  { id: 'trygg-cat',      name: 'Trygg Cat',       material: 'wood',
    audience: 'cat', collection: 'Wood',
    folder: 'Tyrgg Cat',
    images: ['3qrwd.png','dfv.png','qwda.png','wefsd.png','wesd.png'],
    tagline: 'A slatted wooden gate, cat-edition.',
    description: 'Trygg — Swedish for "safe". A solid-wood gate with vertical slat work, painted in deep jet black. A cat-scaled mirror to our flagship Trygg.',
    tagline_tr: 'Slatlı ahşap kapı — kedi serisi.',
    description_tr: 'Trygg — İsveççe "güvenli" anlamına gelir. Derin jet siyahına boyanmış, dikey slat işçilikli masif ahşap kapı. Amiral gemimiz Trygg\'in kedi ölçeğinde yansıması.' },

  { id: 'lux',            name: 'Lux',             material: 'wood',
    audience: 'both', collection: 'Wood',
    folder: 'Lüx',
    images: ['aszxc.png','qwdas.png','qwasdfczx.png','qwads.png','waf.png','aefgsd.png'],
    tagline: 'A painted-wood lattice — our flagship.',
    description: 'Our most photographed model. An intricate lattice in painted solid wood, with brass-tipped hardware and concealed hinges. A piece of joinery that elevates the rooms it bridges.',
    tagline_tr: 'Boyalı ahşap kafes — amiral modelimiz.',
    description_tr: 'En çok fotoğraflanan modelimiz. Boyalı masif ahşaptan ince işçilikli kafes, pirinç uçlu donanım ve gizli menteşelerle. Bağladığı odaları yükselten bir marangozluk eseri.' },

  { id: 'flink',          name: 'Flink',           material: 'wood',
    audience: 'both', collection: 'Wood',
    folder: 'Flink',
    images: ['qw.png','1234ew.png','rwefs.png','r23we.png','gerd.png','qqwdasc.png','123rqwd.png'],
    tagline: 'A vertical-slat wooden gate, tool-free install.',
    description: 'Flink — Swedish for "quick". A vertical-slat wooden gate with brass-tipped wall mounts and a streamlined installation system. Refined craft, fast install.',
    tagline_tr: 'Hızlı montajlı, dikey slatlı ahşap kapı.',
    description_tr: 'Flink — İsveççe "hızlı" anlamına gelir. Pirinç uçlu duvar montajlarıyla dikey slatlı ahşap kapı. Akıcı bir montaj sistemi: rafine işçilik, hızlı kurulum.' },

  { id: 'laga',           name: 'Laga',            material: 'wood',
    audience: 'both', collection: 'Wood',
    folder: 'Laga',
    images: ['sda.png','adfsvzcx.png','wsdf.png','WEFADS.png','awdsfc.png','asdf.png'],
    tagline: 'A vertical-slat wooden gate, finished in soft white.',
    description: 'Laga — Swedish for "to build". A solid-wood gate with hand-finished vertical slats and brass-tipped hardware. Built for stair landings and the high-traffic family home.',
    tagline_tr: 'Yumuşak beyaz cilalı, dikey slatlı ahşap kapı.',
    description_tr: 'Laga — İsveççe "inşa etmek" anlamına gelir. El cilalı dikey slatlar ve pirinç uçlu donanımla masif ahşap kapı. Merdiven sahanlıkları ve yoğun aile evi için tasarlandı.' },

  { id: 'trygg',          name: 'Trygg',           material: 'wood',
    audience: 'both', collection: 'Wood',
    folder: 'Tyrgg',
    images: ['1.png','124.png','12eqwd.png','13r2qewsa.png','21e.png','waefd.png'],
    tagline: 'A slatted wooden gate, engineered for daily life.',
    description: 'Reinforced corners, a child-resistant double-action latch and graphite-painted vertical slats on solid wood. Trygg is the everyday gate built to outlast routine.',
    tagline_tr: 'Günlük hayata göre tasarlanmış slatlı ahşap kapı.',
    description_tr: 'Güçlendirilmiş köşeler, çocuk dirençli çift hareketli mandal ve masif ahşap üzerine grafit boyalı dikey slatlar. Trygg, rutini aşacak şekilde inşa edilmiş günlük kapıdır.' },

  { id: 'elegant-cat',    name: 'Elegant Cat',     material: 'wood',
    audience: 'cat', collection: 'Wood',
    folder: 'Elegant Cat',
    images: ['t3q4erf.png','qt3awerzfsd.png','12eqw.png','123.png'],
    tagline: 'The Elegant silhouette, cat-edition.',
    description: 'All the architectural restraint of Elegant, scaled for cats. A solid wooden gate with an arched cat passage and diagonal slat reveal, finished in jet black.',
    tagline_tr: 'Elegant siluetinin kedi serisi.',
    description_tr: 'Elegant\'in tüm mimari ölçülülüğü, kediler için ölçeklenmiş. Kemerli kedi geçişi ve çapraz slat detayıyla, jet siyahına bitirilmiş masif ahşap kapı.' },

  { id: 'lux-2',          name: 'Lux II',          material: 'wood',
    audience: 'both', collection: 'Wood',
    folder: 'Lüx 2',
    images: ['12e.png','123.png','135.png'],
    tagline: 'A painted-wood chevron-lattice gate.',
    description: 'The second generation Lux. A solid-wood chevron lattice in deep matte black with brushed-steel hardware. Also available in soft white. Built for grand-room thresholds.',
    tagline_tr: 'Chevron kafesli boyalı ahşap kapı.',
    description_tr: 'İkinci nesil Lux. Fırçalanmış çelik donanımla derin mat siyahta masif ahşap chevron kafes. Yumuşak beyazda da mevcut. Büyük oda eşikleri için tasarlandı.' },

  { id: 'lux-3',          name: 'Lux III',         material: 'wood',
    audience: 'both', collection: 'Wood',
    folder: 'Lüx 3',
    images: ['12eqwd.png','1e2qwd.png','2eqwdas.png','qwda.png','qwdascz.png'],
    tagline: 'A painted-wood gate with diamond lattice.',
    description: 'The third generation Lux. A solid-wood diamond lattice in deep jet black, with brushed-steel hardware. A heritage piece for our most architectural homes.',
    tagline_tr: 'Elmas kafesli boyalı ahşap kapı.',
    description_tr: 'Üçüncü nesil Lux. Fırçalanmış çelik donanımla derin jet siyahta masif ahşap elmas kafes. En mimari evlerimiz için bir miras parçası.' },

  { id: 'lux-3-oak',      name: 'Lux III Oak',     material: 'wood',
    audience: 'both', collection: 'Wood',
    folder: 'Lüx 3 Ahşap',
    images: ['wertbg.png','sbdg.png','2r3e.png','ergf.png'],
    tagline: 'The Lux III silhouette in solid oak.',
    description: 'The Lux III diamond lattice executed in solid European oak, hand-finished with natural wax. The warmest interpretation of our flagship.',
    tagline_tr: 'Lux III siluetinin masif meşe versiyonu.',
    description_tr: 'Masif Avrupa meşesinden, doğal vaks ile el cilalı Lux III elmas kafes. Amiral modelimizin en sıcak yorumu.' },

  { id: 'glide',          name: 'Glide',           material: 'wood',
    audience: 'both', collection: 'Wood',
    folder: 'Sliding Wood',
    images: ['FREADSV.png','sdf.png','123qwrd.png'],
    tagline: 'A sliding solid-wood gate on a steel track.',
    description: 'Horizontal solid-wood slats on a wall-mounted steel track, gliding silently. For homeowners who prize uninterrupted floor space.',
    tagline_tr: 'Çelik ray üzerinde kayan masif ahşap kapı.',
    description_tr: 'Duvara monte çelik ray üzerinde sessizce kayan yatay masif ahşap slatlar. Kesintisiz zemin alanını önemseyen ev sahipleri için.' },

  { id: 'double-barn',    name: 'Double Barn',     material: 'wood',
    audience: 'both', collection: 'Wood',
    folder: 'Double Barn',
    images: ['arefds.png','egrf.jpg','ewfdsc.png','serbt.png','wegtf.png','wgrte.png'],
    tagline: 'Twin painted-wood barn panels.',
    description: 'Two cross-braced solid-wood panels that meet in the middle, finished in soft white with brass hardware. Inspired by traditional barn doors.',
    tagline_tr: 'Çift boyalı ahşap ahır paneli.',
    description_tr: 'Ortada birleşen, çapraz desteklenmiş iki masif ahşap panel; yumuşak beyaza boyalı ve pirinç donanımlı. Geleneksel ahır kapılarından ilham alındı.' },

  { id: 'flat-oak',       name: 'Flat Oak Cat',    material: 'wood',
    audience: 'cat', collection: 'Wood',
    folder: 'Cat Flat Ahşap',
    images: ['FWEA.png','qrweaD.png','qwefa.png'],
    tagline: 'A panelled oak gate with a built-in cat door.',
    description: 'A cat-scaled gate in solid European oak, finished with natural oils. A discreet cat passage cut into the lower panel.',
    tagline_tr: 'Dahili kedi geçişli panelli meşe kapı.',
    description_tr: 'Doğal yağlarla cilalanmış masif Avrupa meşesinden kedi ölçekli kapı. Alt panele gizli bir kedi geçişi açılmış.' },

  { id: 'lux-2-oak',      name: 'Lux II Oak',      material: 'wood',
    audience: 'both', collection: 'Wood',
    folder: 'Lüx 2 Ahşap',
    images: ['frewa.png','sdefg.png','q3werf.png','esrg.png'],
    tagline: 'The Lux II form in solid oak.',
    description: 'The Lux II chevron lattice in solid European oak. Mortise-and-tenon joinery, natural-oil finish, brushed-steel mounts.',
    tagline_tr: 'Lux II formunun masif meşe yorumu.',
    description_tr: 'Masif Avrupa meşesinden Lux II chevron kafes. Zıvana birleştirme, doğal yağ cilası, fırçalanmış çelik montajlar.' },

  { id: 'barnhall-plus',  name: 'Barnhall Plus',   material: 'wood',
    audience: 'cat', collection: 'Wood',
    folder: 'Barnhall +',
    images: ['124.png','ghn.png','sadfd.png','ıo.png'],
    tagline: 'Our barn gate with a built-in cat passage.',
    description: 'A solid-wood barn gate with a reinforced X-brace and an arched cat passage cut into the lower panel. The classic Barnhall silhouette, made for households with cats.',
    tagline_tr: 'Dahili kedi geçişli ahır kapımız.',
    description_tr: 'Güçlendirilmiş X destekli ve alt panele kemerli kedi geçişi açılmış masif ahşap ahır kapı. Klasik Barnhall silueti, kedili evler için.' },

  { id: 'stappa',         name: 'Stappa',          material: 'wood',
    audience: 'both', collection: 'Wood',
    folder: 'Stappa',
    images: ['wqesd.png','ewads.png','qweadszx.png','eaf.png','asdF.png','re.png','wasrefg.png','4q3wer.png'],
    tagline: 'A folding wooden gate with vertical slats.',
    description: 'Stappa — Swedish for "step". A multi-panel folding wooden gate in soft white, with vertical slat reveals and brass hinges. Adapts to wide openings.',
    tagline_tr: 'Dikey slatlı katlanır ahşap kapı.',
    description_tr: 'Stappa — İsveççe "adım" anlamına gelir. Yumuşak beyazda, dikey slat detayları ve pirinç menteşelerle çok panelli katlanır ahşap kapı. Geniş geçişlere uyum sağlar.' },

  { id: 'barnhall',       name: 'Barnhall',        material: 'wood',
    audience: 'both', collection: 'Wood',
    folder: 'Barnhall',
    images: ['124ew.png','12.png','qwdasz.png','wesafz.png','1r3qw.png'],
    tagline: 'The original Lumina barn gate.',
    description: 'A single cross-braced solid-wood panel, painted in jet black with brushed-steel hardware. The gate that started our wood collection.',
    tagline_tr: 'Orijinal Lumina ahır kapısı.',
    description_tr: 'Fırçalanmış çelik donanımla jet siyahına boyanmış, tek çapraz destekli masif ahşap panel. Ahşap koleksiyonumuzun başlangıcı.' }
];

// Build a path to a product image (URL-encoded for safety)
function imagePath(product, index = 0) {
  const file = product.images[Math.min(index, product.images.length - 1)];
  return './assets/products/' + encodeURIComponent(product.folder) + '/' + encodeURIComponent(file);
}

// ───── Pricing engine ─────
function computePrice(material, widthInches, heightInches) {
  const width = Math.max(0, Number(widthInches) || 0);
  const height = Number(heightInches) || DEFAULT_HEIGHT_INCH;

  // Tier price based on capped width (0–54)
  const tiers = PRICE_TIERS[material];
  const cappedW = Math.min(width, OVERSIZE_THRESHOLD);
  let tierPrice = tiers[0].price;
  for (const t of tiers) {
    if (cappedW > t.minW && cappedW <= t.maxW) { tierPrice = t.price; break; }
    if (cappedW === 0) { tierPrice = tiers[0].price; break; }
  }

  // 50% discount on the tier price only
  const discountedTier = tierPrice * GLOBAL_DISCOUNT;

  // Oversize surcharge (not discounted)
  let oversize = 0;
  if (width > OVERSIZE_THRESHOLD) {
    const extra = width - OVERSIZE_THRESHOLD;
    const blocks = Math.ceil(extra / OVERSIZE_BLOCK);
    oversize = blocks * OVERSIZE_FEE;
  }

  // Height pricing (not discounted): $20 flat as soon as height differs from 27.5",
  // plus $100 per 6-inch block of deviation (in either direction).
  let heightFlat = 0;
  let heightOversize = 0;
  const heightDeviation = Math.abs(height - DEFAULT_HEIGHT_INCH);
  if (heightDeviation > 0.05) {
    heightFlat = HEIGHT_DEVIATION_FEE;
    const blocks = Math.ceil(heightDeviation / OVERSIZE_BLOCK);
    heightOversize = blocks * OVERSIZE_FEE;
  }
  const heightFee = heightFlat + heightOversize;

  const original = tierPrice + oversize + heightFee;
  const final    = discountedTier + oversize + heightFee;

  return {
    tierPrice,
    discountedTier,
    oversize,
    heightFlat,
    heightOversize,
    heightFee,
    original,
    final,
    saved: original - final
  };
}

// Expose globally for non-module pages
window.LUMINA = {
  PRODUCTS, COLORS, PRICE_TIERS,
  DEFAULT_HEIGHT_INCH, DEFAULT_HEIGHT_CM,
  HEIGHT_DEVIATION_FEE, OVERSIZE_THRESHOLD, OVERSIZE_BLOCK, OVERSIZE_FEE,
  GLOBAL_DISCOUNT,
  computePrice, imagePath
};
