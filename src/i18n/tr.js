// Lumina Gates — Türkçe metinler
// en.js ile aynı anahtar yapısı. Eksik anahtar varsa derleme sırasında İngilizceye düşer ve uyarı verir.

module.exports = {
  code: 'tr',
  dir: 'ltr',
  name: 'Türkçe',
  short: 'TR',
  switchLabel: 'English',
  switchAria: 'View this page in English',

  meta: {
    siteName: 'Lumina Gates',
    home: {
      title: 'Özel Çocuk ve Evcil Hayvan Kapıları | Lumina Gates',
      description: 'Pleksiglas ve masif meşeden siparişe özel çocuk ve evcil hayvan kapıları. Genişlik, yükseklik ve rengi siz belirleyin. Bursa\'da el yapımı, dünyaya gönderim.'
    }
  },

  announcement: 'Siparişe özel üretim · Bursa\'da el yapımı · Dünyaya gönderim',

  nav: {
    shop: 'Mağaza', collection: 'Koleksiyon', story: 'Hikayemiz', faq: 'SSS',
    measure: 'Ölçü Alma', contact: 'İletişim', menu: 'Menü', close: 'Kapat',
    skip: 'İçeriğe geç', home: 'Ana sayfa', language: 'Dil'
  },

  hero: {
    eyebrow: 'Siparişe özel · Bursa\'da el yapımı',
    titleA: 'Kapıyı', titleB: 'yeniden tanımladık.',
    lead: 'Optik kalite pleksiglas ve masif Avrupa meşesinden, çocuklar ve evcil hayvanlar için el işçiliği kapılar. Boşluğunuza tam oturan genişlik, yükseklik ve rengi siz belirleyin.',
    ctaShop: 'Koleksiyonu Keşfet', ctaStory: 'Hikayemiz',
    imageAlt: 'Aydınlık bir koridora monte edilmiş Lumina Gates Lux boyalı ahşap kafes kapı'
  },

  values: [
    { eyebrow: '01 · Malzeme', title: 'Optik kalite pleksiglas', body: 'Çizilmeye dayanıklı, kenarları cilalı; evinizin mimarisinde kaybolacak şekilde şekillendirilmiş.' },
    { eyebrow: '02 · İşçilik', title: 'Masif Avrupa meşesi',    body: 'Sürdürülebilir kaynaktan, doğal yağlarla elle cilalanmış. Zıvana birleştirme.' },
    { eyebrow: '03 · Ölçü',    title: 'Santimi santimine',      body: 'Her kapı sizin boşluğunuza göre yapılır. Genişlik ve yüksekliği söyleyin — gerisini biz hallederiz.' },
    { eyebrow: '04 · Güvenlik', title: 'Gerçek hayat için',     body: 'Çift hareketli mandallar, yuvarlatılmış köşeler ve yıllarca günlük kullanıma göre test edilmiş duvar montajı. Yürümeye yeni başlayanlar ve tekir kediler tarafından test edildi.' }
  ],

  shop: {
    eyebrow: 'Koleksiyon',
    title: '{total} kapı: {plexi} pleksiglas, {wood} ahşap.',
    viewAll: 'Tüm kapıları gör',
    filterLabel: 'Koleksiyonu filtrele'
  },

  filters: { all: 'Tümü', plexi: 'Pleksiglas', wood: 'Ahşap', cat: 'Kedi Serisi' },

  card: {
    from: 'Başlangıç', cat: 'Kedi Serisi', both: 'Çocuk & Evcil',
    plexi: 'Pleksiglas', wood: 'Masif Ahşap', sale: '%50 indirim',
    configure: 'Yapılandır'
  },

  howItWorks: {
    eyebrow: 'Nasıl çalışır',
    title: 'Tam oturan bir kapıya üç adım.',
    steps: [
      { h: 'Boşluğu ölçün', p: 'Üç yükseklikten genişlik — en küçük sayı kazanır. Mezurayla iki dakika.', link: 'Ölçü rehberi' },
      { h: 'Online yapılandırın', p: 'Model seçin, genişlik ve yüksekliği girin, rengi belirleyin. Fiyat anında güncellenir; ödeme bir dakika sürer.' },
      { h: 'Biz üretip gönderelim', p: 'Kapınız {leadMin}–{leadMax} iş gününde elle üretilir ve donanımıyla birlikte takipli ekspres kuryeyle dünyanın her yerine gönderilir.' }
    ]
  },

  story: {
    eyebrow: 'Hikayemiz',
    titleA: 'Bir kapı, içinde bulunduğu', titleB: 'odaya ait olmalı.',
    body: 'Lumina Gates basit bir hayal kırıklığıyla başladı: piyasadaki her güvenlik kapısı sanki bir depoya aitmiş gibi duruyordu. Biz, ebeveyn ya da evcil hayvan sahibi olmasaydınız eviniz için seçeceğiniz kapıyı yapıyoruz — sonra onu evinizin en küçük üyelerini güvende tutacak şekilde tasarlıyoruz. Her parça, atölyemizde, sizin tam ölçünüze göre elle üretilir.',
    readMore: 'Hikayemizi okuyun'
  },

  footer: {
    shop: 'Mağaza', atelier: 'Atölye', help: 'Yardım', contact: 'İletişim',
    all: 'Tüm Kapılar', plexi: 'Pleksiglas', wood: 'Ahşap', cat: 'Kedi Serisi',
    story: 'Hikayemiz', faq: 'SSS', measure: 'Ölçü Alma', shipping: 'Kargo',
    returns: 'İade & Garanti', terms: 'Satış Koşulları', privacy: 'Gizlilik Politikası',
    tagline: 'Kapı atölyesi. Siparişe özel üretim. Bursa\'daki atölyemizden dünyaya gönderim.',
    operatedBy: 'Lumina Gates bir {legalName} markasıdır',
    copy: '© {year} Lumina Gates · Tüm hakları saklıdır',
    byline: 'Türkiye\'de el yapımı · Dünyaya gönderim',
    email: 'E-posta', workshop: 'Atölye'
  },

  collections: {
    all: {
      title: 'Tüm Kapılar — Özel çocuk ve evcil hayvan kapıları | Lumina Gates',
      description: 'Pleksiglas ve masif ahşaptan {total} siparişe özel kapının tamamına göz atın. Her kapı tam genişlik ve yüksekliğinize, seçtiğiniz renkte üretilir.',
      h1: 'Koleksiyon',
      intro: 'Her kapı atölyemizde siparişe özel üretilir ve boşluğunuza göre yapılandırılır — genişlik, yükseklik ve renk sizin seçiminiz.'
    },
    plexi: {
      title: 'Pleksiglas Çocuk ve Evcil Hayvan Kapıları | Lumina Gates',
      description: 'İnce ahşap çerçeveli şeffaf pleksiglas çocuk ve evcil hayvan kapıları. Optik kalite akrilik, kenarları cilalı, tam ölçünüze göre üretim.',
      h1: 'Pleksiglas Kapılar',
      intro: 'İnce boyalı veya meşe çerçeveler içinde optik kalite akrilik paneller. Odada kaybolan, ama çocukları ve evcil hayvanları tam olmaları gereken yerde tutan kapı.'
    },
    wood: {
      title: 'Ahşap Çocuk ve Evcil Hayvan Kapıları | Lumina Gates',
      description: 'Masif Avrupa meşesi ve boyalı ahşap çocuk ve evcil hayvan kapıları: kafes, slat, ahır ve sürgülü tasarımlar, tamamı ölçüye özel.',
      h1: 'Ahşap Kapılar',
      intro: 'Masif Avrupa meşesi veya elle boyanmış ahşaptan kafes, slat, ahır ve sürgülü tasarımlar. Evle birlikte yapılmış gibi duran marangozluk.'
    },
    cat: {
      title: 'Kedi Serisi — Dahili kedi geçişli kapılar | Lumina Gates',
      description: 'Kapı kapalıyken kedilerin gelip geçebildiği gizli kedi geçişli çocuk ve köpek kapıları. Ahşap veya meşeden, ölçüye özel.',
      h1: 'Kedi Serisi',
      intro: 'Çocukları ve köpekleri bir tarafta tutarken kedinin rahatça geçtiği kapı. Her Kedi Serisi modelinin alt paneline gizli bir geçiş açılmıştır.'
    },
    countLabel: '{count} kapı',
    breadcrumbHome: 'Ana sayfa', breadcrumbAll: 'Tüm Kapılar'
  },

  product: {
    titleSuffix: ' — Özel {material} kapı | Lumina Gates',
    materialNoun: { plexi: 'pleksiglas', wood: 'ahşap' },
    descriptionTemplate: '{tagline} Ölçünüze ve seçtiğiniz renge göre siparişe özel üretilir. Bursa\'da el yapımı, dünyaya gönderim.',
    imageAlt: 'Lumina Gates {name} {material} çocuk ve evcil hayvan kapısı — fotoğraf {n}',
    galleryLabel: 'Ürün fotoğrafları', thumbLabel: 'Fotoğraf {n}\'i göster',

    priceOff: '%50 indirim', priceTier: 'Kademe fiyatı', priceDiscount: 'Lansman indirimi',
    priceOversizeW: 'Genişlik ek ücreti (54" üzeri)',
    priceHeightFlat: 'Özel yükseklik ücreti',
    priceHeightOver: 'Yükseklik ek ücreti (her 6" için $100)',
    priceNote: 'Fiyat, siz yapılandırdıkça güncellenir. Kargo dahildir.',

    cfgWidth: 'Genişlik', cfgChooseWidth: 'Genişlik (inç)', cfgOrCm: 'veya santimetre',
    cfgStandard: 'standart', cfgHeight: 'Yükseklik',
    cfgHeightSub: 'standart 27.5 in / 70 cm · değişirse +$20, her 6 in için +$100',
    cfgChooseHeight: 'Yükseklik (inç)', cfgFinish: 'Renk',
    cfgOtherPlaceholder: 'İstediğiniz rengi tanımlayın — örn. RAL 7016, adaçayı yeşili mat',
    cfgEngraving: 'Kazıma', cfgEngravingPlaceholder: 'Kazınacak isim, kelime veya tarih',
    cfgEngravingHelp: 'En fazla 40 karakter. Düz panel için boş bırakın.',
    cfgMeasureHelp: 'Boşluğun kendi genişliğini girin — menteşe ve payı biz hesaplarız.',
    cfgMeasureLink: 'Nasıl ölçülür',

    colors: { white: 'Saf Beyaz', black: 'Jet Siyah', anthracite: 'Antrasit', natural: 'Doğal Meşe', unfinished: 'Cilasız', other: 'Diğer', otherPick: 'Diğer (lütfen belirtin)' },

    sumModel: 'Model', sumMaterial: 'Malzeme', sumMaterialPlexi: 'Optik kalite pleksiglas',
    sumMaterialWood: 'Masif Avrupa meşesi', sumWidth: 'Genişlik', sumHeight: 'Yükseklik',
    sumFinish: 'Renk', sumEngraving: 'Kazıma', sumTotal: 'Toplam', sumSummary: 'Yapılandırmanız',

    btnCheckout: 'Güvenli ödeme', btnCustom: 'Özel tasarım talep et',
    btnCustomBody: 'Standart koleksiyonumuzdan farklı bir kapı mı arıyorsunuz? Aklınızdakini anlatın — renk, desen, donanım — sizin için üretelim.',
    paymentMethods: 'Kart · Apple Pay · Google Pay · PayPal',
    secureNote: 'Ödemeler Stripe tarafından işlenir. Kart bilgilerinizi hiçbir zaman görmeyiz.',

    featMade: 'Siparişe özel', featMadeBody: 'Atölyemizde tam ölçünüze göre üretilir.',
    featLead: 'Üretim süresi', featLeadBody: 'Sipariş onayından itibaren {leadMin}–{leadMax} iş günü.',
    featShip: 'Kargo', featShipBody: 'Dünya çapında, takipli ekspres kurye, fiyata dahil.',
    featWarr: 'Garanti', featWarrBody: 'Çerçeve ve donanımda {years} yıl.',

    payRedirect: 'Ödeme sayfasına yönlendiriliyorsunuz…',
    payError: 'Ödeme başlatılamadı. Lütfen tekrar deneyin veya {email} adresine yazın.',
    payOtherEmpty: 'Lütfen "Diğer" alanında istediğiniz rengi tanımlayın.',

    mailSubject: 'Özel tasarım kapı talebi',
    mailBody: 'Merhaba Lumina,\n\nStandart koleksiyonunuzda olmayan özel bir kapı istiyorum. Aklımdakiler:\n\nStil / ilham:\n  (görünümü tanımlayın — slat deseni, kafes, ahır, cam vb.)\n\nMalzeme:\n  (ahşap / pleksiglas / karma)\n\nYaklaşık ölçüler:\n  Genişlik: ___ in / ___ cm\n  Yükseklik: ___ in / ___ cm\n\nRenk / cila:\n  (örn. mat siyah, doğal meşe, RAL 7016, fırçalanmış pirinç donanım)\n\nKimler için (çocuk / kedi / köpek):\n\nBilmemiz gereken başka bir şey:\n\n\nTeşekkürler,',

    detailsHeading: 'Detaylar',
    specs: {
      material: 'Malzeme',
      materialPlexi: 'Kenarları cilalı, çizilmeye dayanıklı optik kalite pleksiglas panel; masif ahşap çerçeve (fotoğraftaki gibi boyalı veya doğal meşe)',
      materialWood: 'Masif Avrupa meşesi veya elle boyanmış masif ahşap, fotoğraftaki gibi',
      finish: 'Renk', finishValue: 'Saf Beyaz, Jet Siyah, Antrasit, Doğal Meşe, Cilasız — veya talep üzerine herhangi bir RAL rengi',
      height: 'Yükseklik', heightValue: '27.5 in / 70 cm standart · 20–48 in arası mevcut',
      width: 'Genişlik', widthValue: '6–96 in / 15–244 cm · boşluğunuza göre üretilir',
      hardware: 'Donanım', hardwareValue: 'Duvar montaj aparatları ve çift hareketli mandal dahil',
      engraving: 'Kişiselleştirme', engravingValue: 'El kazıma isim, kelime veya tarih (en fazla 40 karakter)',
      catDoor: 'Kedi geçişi', catDoorValue: 'Alt panelde dahili geçiş — kediler geçer, çocuklar ve köpekler geçemez',
      lead: 'Üretim süresi', leadValue: '{leadMin}–{leadMax} iş günü üretim, ardından {transitMin}–{transitMax} iş günü kargo',
      warranty: 'Garanti', warrantyValue: 'Çerçeve ve donanımda {years} yıl',
      madeIn: 'Üretim yeri', madeInValue: 'Bursa, Türkiye'
    },
    faqHeading: 'Bilmeniz iyi olur',
    faq: [
      { q: 'Boşluğumu nasıl ölçerim?', a: 'Kapının oturacağı yükseklikte, en dar noktadan boşluğun genişliğini ölçün. O sayıyı girin — menteşe, mandal ve payı biz hesaplarız. Fotoğraflı anlatım ve özel durumlar için ölçü alma rehberimize bakın.' },
      { q: 'Kapı duvara mı vidalanıyor, sıkıştırmalı mı?', a: 'Her Lumina kapısı güvenli ve sallanmayan bir montaj için duvara veya kapı kasasına vidalanır. Montaj donanımı dahildir.' },
      { q: 'Listede olmayan bir renk alabilir miyim?', a: 'Evet. Renk seçiminde "Diğer"i seçip rengi tanımlayın (RAL kodu idealdir). Üretime başlamadan önce e-posta ile teyit ederiz.' }
    ],
    relatedHeading: 'Bunlar da ilginizi çekebilir',
    backToCollection: 'Koleksiyona dön'
  },

  pages: {
    story: {
      title: 'Hikayemiz — Lumina Gates',
      description: 'Güzel evlere yakışan çocuk ve evcil hayvan kapıları yapmaya neden başladık ve her biri Bursa\'daki atölyemizde nasıl elle üretiliyor.',
      h1A: 'Bir kapı, içinde bulunduğu', h1B: 'odaya ait olmalı.',
      sections: [
        { h: 'Hayal kırıklığı', p: 'Lumina Gates basit bir hayal kırıklığıyla başladı: piyasadaki her güvenlik kapısı sanki bir depoya aitmiş gibi duruyordu. Plastik, sıkıştırmalı, bej. Yıllarını koridorunu güzelleştirmeye harcamış hiçbir ebeveynin ya da evcil hayvan sahibinin seçeceği bir şey yoktu.' },
        { h: 'Atölye', p: 'Biz de kendimizinkini yapmaya başladık. Bursa\'daki atölyemiz iki malzemeyle çalışır — optik kalite pleksiglas ve masif Avrupa meşesi — ve genellikle mobilyaya ayrılan türden işçilikle: zıvana birleştirmeli çerçeveler, kenarları cilalı paneller, elle uygulanan yağlar ve boyalar.' },
        { h: 'Boşluğunuza göre', p: 'İki evin kapı boşluğu aynı değildir; bu yüzden iki Lumina kapısı da aynı değildir. Her biri bize verdiğiniz genişlik ve yüksekliğe, seçtiğiniz renkte üretilir ve güvenli montaj için donanımıyla birlikte gönderilir. Sonra da önemli olan tek şekilde test edilir: yürümeye yeni başlayanlar ve tekir kediler tarafından.' },
        { h: 'Sözümüz', p: 'Her kapıyı evinizin en küçük üyelerini güvende tutacak şekilde tasarlıyor, çerçeve ve donanımda beş yıl garanti veriyor ve dünyanın her yerine gönderiyoruz.' }
      ],
      cta: 'Koleksiyonu Keşfet'
    },

    measure: {
      title: 'Özel Kapı için Ölçü Nasıl Alınır — Lumina Gates',
      description: 'Ölçüye özel çocuk veya evcil hayvan kapısı için kapı boşluğunuzu iki dakikada ölçme rehberi: neyi, nereden ölçeceksiniz, bize ne söyleyeceksiniz.',
      h1: 'Ölçü alma',
      intro: 'Bir mezura ve iki dakika yeter. Siz boşluğu verin — menteşe, mandal ve payı biz hallederiz.',
      diagramAlt: 'Üç yükseklikten ölçülen genişliği ve zeminden ölçülen kapı yüksekliğini gösteren kapı boşluğu şeması',
      steps: [
        { h: '1. Kapının nereye oturacağına karar verin', p: 'Tam yeri belirleyin: kapı kasasının içi, koridorun iki duvarı arası ya da merdivenin üstü veya altı. İki tarafta da vidalanacak sağlam bir yüzey olmalı — duvar, kapı kasası veya merdiven babası. Süpürgelikler sorun değil; sipariş notunda belirtin.' },
        { h: '2. Genişliği üç yükseklikten ölçün', p: 'Boşluğu yüzeyden yüzeye, zeminden yaklaşık 10 cm, 35 cm ve 60 cm yükseklikte ölçün. Duvarlar nadiren tam paraleldir. Üç sayının en küçüğünü kullanın.' },
        { h: '3. Boşluk genişliğini girin — kapı genişliğini değil', p: 'En küçük ölçüyü yapılandırıcıya inç veya santimetre olarak yazın. Hiçbir şey çıkarmayın: kapıyı menteşe ve mandala yer kalacak şekilde boşluktan dar üretiriz ve üretimden önce son ölçüleri e-posta ile teyit ederiz.' },
        { h: '4. Yüksekliği seçin', p: 'Standart yüksekliğimiz 27.5 in (70 cm); çoğu küçük çocuk ve küçük-orta boy köpek için uygundur. Büyük köpekler, tırmanmayı sevenler veya merdiven üstü için 30–36 in düşünün. 20 ile 48 in arası yükseklikler mevcuttur.' },
        { h: '5. Engelleri kontrol edin', p: 'Radyatörler, kapı kolları, prizler ve çıkıntılı süpürgelikler kapının açılma yönünü etkileyebilir. Boşluğun 10 cm yakınındaki her şeyi sipariş notunda belirtin veya bize fotoğraf gönderin — birlikte kontrol etmekten memnuniyet duyarız.' }
      ],
      tipsHeading: 'Özel durumlar',
      tips: [
        { h: 'Merdiven üstü', p: 'Merdiven üstündeki kapılar mutlaka vidalı montajlı olmalı (bizimkiler her zaman öyledir) ve merdivenden uzağa açılmalıdır. Merdivenin hangi tarafta olduğunu bize söyleyin.' },
        { h: 'Çok geniş boşluklar', p: '54 in (137 cm) üzeri boşluklar daha geniş tek kapı ya da Stappa ve Bifold Glass gibi katlanır / çok panelli tasarımlar olarak üretilir. 96 in (244 cm) genişliğe kadar yapılandırılabilir; daha geniş açıklıklar talep üzerine.' },
        { h: 'Eğimli zeminler', p: 'Zemin eğimliyse yüksekliği iki taraftan da ölçüp farkı bize bildirin. Kapının serbestçe açılması için yeterli zemin payı bırakırız.' },
        { h: 'Emin değil misiniz?', p: 'Boşluğun üzerine ölçüleri yazılmış bir fotoğrafını {email} adresine gönderin. Bir iş günü içinde yanıtlarız.' }
      ],
      cta: 'Kapınızı seçin'
    },

    faq: {
      title: 'SSS — Özel çocuk ve evcil hayvan kapıları | Lumina Gates',
      description: 'Lumina Gates ürünlerinde ölçü alma, malzeme, renk, üretim süresi, kargo, gümrük, iade ve beş yıl garanti hakkında yanıtlar.',
      h1: 'Sık sorulan sorular',
      intro: 'Ölçüye özel kapı sipariş etmeden önce sorulan her şey. Eksik bir şey mi var? {email} adresine yazın.',
      groups: [
        { h: 'Sipariş ve ölçü', items: [
          { q: 'Hangi genişliği sipariş edeceğimi nasıl bilirim?', a: 'Boşluğun kendisini üç yükseklikten ölçün ve en küçük sayıyı bize verin. Kapıyı menteşe ve mandala yer kalacak şekilde boşluktan dar üretiriz — hiçbir şey çıkarmanız gerekmez. Tam rehber Ölçü Alma sayfamızda.' },
          { q: 'Yanlış ölçersem ne olur?', a: 'Üretime başlamadan önce son ölçüleri e-posta ile teyit ederiz; bu çoğu hatayı yakalar. Yine de kapı gelip uymazsa bize ulaşın: çoğu durumda ayarlayabilir ya da indirimli fiyatla yeniden üretebiliriz.' },
          { q: 'Listede olmayan bir renk sipariş edebilir miyim?', a: 'Evet. Renk seçiminde "Diğer"i seçip rengi tanımlayın. RAL veya NCS kodu idealdir; fotoğraf da olur. Tam tonu üretimden önce e-posta ile teyit ederiz.' },
          { q: 'Tamamen özel bir tasarım yaptırabilir miyim?', a: 'Çoğunlukla evet. Herhangi bir ürün sayfasındaki "Özel tasarım talep et" düğmesini kullanın ya da eskiz veya ilham fotoğrafıyla bize yazın. İki iş günü içinde teklif veririz.' },
          { q: 'Mimar ve tasarımcılar için özel fiyat var mı?', a: 'Evet — konut mimarları, iç mimarlar ve müteahhitlerle çalışıyoruz. Proje detaylarıyla {email} adresine yazın; ticari koşulları ve PDF kataloğu paylaşalım.' }
        ] },
        { h: 'Malzeme ve güvenlik', items: [
          { q: '"Optik kalite pleksiglas" nedir?', a: 'Camın berraklığına, ağırlığının çok azına ve çok daha yüksek darbe dayanımına sahip döküm akrilik levha. Kenarları cilalıdır, yüzeyi çizilmeye dayanıklıdır. Normal iç mekân kullanımında sararmaz.' },
          { q: 'Ahşap masif mi?', a: 'Evet. Meşe modeller zıvana birleştirmeli masif Avrupa meşesidir; boyalı modeller elle uygulanmış cilaya sahip masif ahşaptır. Çerçevelerde MDF veya kaplama kullanmayız.' },
          { q: 'Kapılar çocuklar için güvenli mi?', a: 'Lumina kapıları vidalı montajlıdır, çift hareketli mandal kullanır ve parmak sıkışmayacak yuvarlatılmış kenarlara sahiptir. Her güvenlik kapısı gibi bir yardımcıdır — yetişkin gözetiminin yerini tutmaz. Montaj talimatlarına uyun ve donanımı düzenli kontrol edin.' },
          { q: 'Büyük bir köpeği tutar mı?', a: '30–36 in yüksekliğinde vidalı montajlı masif ahşap kapılar çoğu büyük köpek için uygundur. Çok güçlü veya kararlı köpekler için daha yüksek bir ahşap model seçin; cinsinize göre öneri isterseniz bize yazın.' },
          { q: 'Kedi geçişi nasıl çalışır?', a: 'Kedi Serisi kapılarda alt panele, kediye göre boyutlandırılmış ve çocuklar ya da çoğu köpek için fazla küçük bir açıklık kesilir. Kapının geri kalanı standart versiyonla tamamen aynı çalışır.' }
        ] },
        { h: 'Üretim, kargo ve gümrük', items: [
          { q: 'Ne kadar sürer?', a: 'Üretim, sipariş onayından itibaren {leadMin}–{leadMax} iş günü sürer. Takipli ekspres kurye ile kargo ABD, Kanada, İngiltere ve Avrupa\'nın çoğuna {transitMin}–{transitMax} iş günü sürer.' },
          { q: 'Nereye gönderiyorsunuz?', a: 'Dünyanın her yerine. Ödeme adımında ABD, Kanada, İngiltere, AB, İsviçre, Norveç, Avustralya, Yeni Zelanda, BAE ve Türkiye seçilebilir. Diğer ülkeler için önce bize yazın.' },
          { q: 'Kargo ne kadar?', a: 'Kargo, gördüğünüz fiyata dahildir. Ödeme adımında ayrı bir kargo satırı yoktur.' },
          { q: 'Gümrük vergisi öder miyim?', a: 'Siparişler Türkiye\'den çıktığı için varış ülkesi teslimatta ithalat vergisi, gümrük ücreti veya KDV uygulayabilir. Bu ücretler ülkenizin devleti tarafından belirlenir, fiyatlarımıza dahil değildir ve alıcı tarafından kuryeye ödenir. Ayrıntılar Kargo Politikamızda.' },
          { q: 'Kapı nasıl paketlenir?', a: 'Düz olarak, köşe korumalı güçlendirilmiş çift katlı kolide; donanım ayrı etiketli bir torbada. Montaj talimatı dahildir.' }
        ] },
        { h: 'İade ve garanti', items: [
          { q: 'Kapıyı iade edebilir miyim?', a: 'Her kapı sizin ölçünüze üretildiği için fikir değişikliği iadesi kabul edemiyoruz. Kapı hasarlı, kusurlu veya yapılandırdığınızdan farklı gelirse teslimattan itibaren {returnDays} gün içinde bize bildirin; onarır, yeniden üretir veya iade ederiz — iade kargosu dahil.' },
          { q: 'Siparişi iptal edebilir miyim?', a: 'Evet, siparişten itibaren {cancelHours} saat içinde ücretsiz. Sonrasında kapınız üretime girer ve sipariş artık iptal edilemez.' },
          { q: 'Garanti neyi kapsar?', a: 'Çerçeve ve donanımda üretim hatalarına karşı beş yıl. Yanlış kullanım, değişiklik, hatalı montaj veya cilanın normal aşınmasından kaynaklanan hasarı kapsamaz.' }
        ] }
      ]
    },

    contact: {
      title: 'İletişim — Lumina Gates',
      description: 'Kapılar, siparişiniz, özel tasarım veya ticari fiyat hakkında sorunuz mu var? E-posta gönderin veya formu kullanın; bir iş günü içinde yanıtlarız.',
      h1: 'Bize ulaşın',
      intro: 'Ölçü, özel renk, devam eden sipariş veya ticari proje — bize yazın; atölyeden biri bir iş günü içinde yanıtlasın.',
      emailLabel: 'E-posta', workshopLabel: 'Atölye', hoursLabel: 'Çalışma saatleri',
      hoursValue: 'Pazartesi–Cuma, 09:00–18:00 (GMT+3)',
      tradeHeading: 'Mimarlar, tasarımcılar ve müteahhitler',
      tradeBody: 'Konut projeleri için ölçüye özel kapılar tedarik ediyor; ticari koşullar, PDF katalog ve renk numuneleri sunuyoruz. Mesajınızda projeden bahsedin.',
      form: {
        heading: 'Mesaj gönderin',
        name: 'Adınız', email: 'E-posta adresi', topic: 'Konu',
        topics: { general: 'Genel soru', order: 'Mevcut sipariş', custom: 'Özel tasarım', trade: 'Ticari / proje talebi' },
        message: 'Mesaj', submit: 'Gönder', sending: 'Gönderiliyor…',
        success: 'Teşekkürler — mesajınız yolda. Bir iş günü içinde yanıtlarız.',
        error: 'Mesaj gönderilemedi. Lütfen doğrudan {email} adresine yazın.',
        privacy: 'Bilgilerinizi yalnızca mesajınızı yanıtlamak için kullanırız. Gizlilik Politikamıza bakın.'
      }
    },

    shipping: {
      title: 'Kargo Politikası — Lumina Gates',
      description: 'Üretim süreleri, dünya çapında ekspres kargo, takip, paketleme, gümrük vergileri ve kapı hasarlı gelirse ne olur.',
      h1: 'Kargo Politikası',
      updated: 'Son güncelleme: {date}',
      sections: [
        { h: 'Siparişe özel üretim', p: 'Her kapı siz sipariş verdikten sonra üretilir. Üretim, ölçü ve rengi e-posta ile teyit ettiğimiz andan itibaren {leadMin}–{leadMax} iş günü sürer. Özel renkler ve büyük boy kapılar birkaç gün daha uzun sürebilir; öyleyse size bildiririz.' },
        { h: 'Nereye gönderiyoruz', p: 'Bursa\'daki atölyemizden dünyanın her yerine gönderiyoruz. Ödeme adımında seçilebilen ülkeler: ABD, Kanada, İngiltere, İrlanda, Almanya, Fransa, Hollanda, Belçika, Avusturya, İsviçre, İsveç, Norveç, Danimarka, Finlandiya, İtalya, İspanya, Portekiz, Avustralya, Yeni Zelanda, Birleşik Arap Emirlikleri ve Türkiye. Diğer ülkeler için sipariş vermeden önce {email} adresine yazın.' },
        { h: 'Ücret ve süre', p: 'Kargo ürün fiyatına dahildir. Kapılar takipli ekspres kuryeyle (varış yerine göre DHL, UPS veya FedEx) gönderilir ve genellikle çıkıştan {transitMin}–{transitMax} iş günü sonra teslim edilir. Kapı atölyeden çıktığı gün takip numarasını e-posta ile alırsınız.' },
        { h: 'Gümrük vergileri', p: 'Kapınız Türkiye\'den çıktığı için varış ülkesi teslimatta ithalat vergisi, gümrük işlem ücreti veya KDV / satış vergisi uygulayabilir. Bu ücretler ülkenizin devleti tarafından belirlenir, fiyatlarımıza dahil değildir ve alıcı tarafından, genellikle teslimat öncesi veya sırasında kuryeye ödenir. Her gönderinin gerçek değerini beyan ederiz; paketleri hediye olarak işaretleyemez veya beyan değerini düşüremeyiz.' },
        { h: 'Paketleme', p: 'Kapılar köşe korumalı, güçlendirilmiş çift katlı kolide düz olarak paketlenir. Donanım, montaj talimatıyla birlikte kolinin içinde ayrı etiketli bir torbada gönderilir.' },
        { h: 'Taşıma hasarı', p: 'Lütfen teslimatta koliyi ve kapıyı kontrol edin. Hasar varsa ambalajı ve hasarı fotoğraflayıp 48 saat içinde bize e-posta gönderin. Kapıyı onarır, yeniden üretir veya ücretini iade ederiz — size maliyeti yoktur ve kuryeyle muhatap olmanız gerekmez.' },
        { h: 'Adres doğruluğu ve başarısız teslimat', p: 'Ödeme adımında teslimat adresinizi ve telefon numaranızı lütfen iki kez kontrol edin; kuryeler teslimatı telefonla ayarlar. Yanlış adres veya teslim alınmama nedeniyle bize geri dönen paketler için yeniden gönderim konusunda sizinle iletişime geçeriz; ikinci gönderimin ücreti maliyetine yansıtılır.' }
      ]
    },

    refund: {
      title: 'İade, Geri Ödeme ve Garanti — Lumina Gates',
      description: 'İptal süremiz, ölçüye özel kapı hasarlı veya yanlış gelirse ne yaptığımız, geri ödemelerin nasıl yapıldığı ve beş yıl garanti.',
      h1: 'İade, Geri Ödeme ve Garanti',
      updated: 'Son güncelleme: {date}',
      sections: [
        { h: 'İptal', p: 'Siparişi verdikten sonraki {cancelHours} saat içinde ücretsiz iptal edebilirsiniz — sipariş numaranızla {email} adresine yazın. {cancelHours} saatten sonra kapınız üretime girer ve sipariş artık iptal edilemez.' },
        { h: 'Ölçüye özel ürünler', p: 'Her Lumina kapısı seçtiğiniz ölçü ve renkte üretilir; bu yüzden yeniden satılamaz. Bu nedenle fikir değişikliği veya ölçü hatası iadesi kabul etmiyoruz. Üretime başlamadan önce son ölçüleri her zaman e-posta ile teyit ederiz; lütfen o e-postayı dikkatle kontrol edin.' },
        { h: 'Hasarlı, kusurlu veya siparişten farklı', p: 'Kapınız hasarlı gelirse, üretim kusuru varsa veya sipariş ettiğiniz yapılandırmadan farklıysa teslimattan itibaren {returnDays} gün içinde fotoğraflarla bize ulaşın. Tercihinize göre ve mümkün olduğunda onarır, yeniden üretir veya tamamını iade ederiz. Gerekirse iade kargosunu biz ayarlar ve öderiz.' },
        { h: 'Uymazsa', p: 'Boşluk yanlış ölçüldüğü için kapı uymazsa bu iade politikasının kapsamında değildir — ama yardım ederiz. Birçok kapı ayarlanabilir ve müşterilerimiz için kapıları indirimli fiyatla yeniden üretiriz. Fotoğraflar ve gerçek ölçülerle bize yazın.' },
        { h: 'Geri ödemeler', p: 'Geri ödemeler, onayımızdan itibaren 5–10 iş günü içinde orijinal ödeme yöntemine yapılır. Kart kuruluşları ve PayPal\'ın alacağı göstermesi birkaç gün daha sürebilir.' },
        { h: 'Garanti', p: 'Her kapı, teslimat tarihinden itibaren çerçeve ve donanımda malzeme ve işçilik kusurlarına karşı {years} yıl garantilidir. Garanti; yanlış kullanım, değişiklik, hatalı montaj, dış etkenlere maruz kalma veya boyalı ve yağlı cilaların normal aşınmasından kaynaklanan hasarı kapsamaz. Talep için sipariş numaranız ve fotoğraflarla {email} adresine yazın; ilgili parçayı onarır veya değiştiririz.' },
        { h: 'Yasal haklarınız', p: 'Bu politikadaki hiçbir madde ülkenizin tüketici koruma yasalarından doğan haklarınızı sınırlamaz.' }
      ]
    },

    terms: {
      title: 'Satış Koşulları — Lumina Gates',
      description: 'Doggo LLC markası Lumina Gates\'ten ölçüye özel kapı sipariş ettiğinizde geçerli olan koşullar.',
      h1: 'Satış Koşulları',
      updated: 'Son güncelleme: {date}',
      sections: [
        { h: '1. Biz kimiz', p: 'Bu web sitesi ve Lumina Gates markası, ABD\'nin Wyoming eyaletinde kayıtlı limited şirket {legalName} ("Lumina", "biz") tarafından işletilmektedir. Ürünler Bursa\'daki atölyemizde üretilir. Bize {email} adresinden ulaşabilirsiniz.' },
        { h: '2. Ürünler', p: 'Tüm kapılar seçtiğiniz ölçü, renk ve seçeneklere göre siparişe özel üretilir. Fotoğraflar temsili örnekleri gösterir; ahşap deseni, elle uygulanan cilalar ve kazıma parçadan parçaya küçük farklılıklar gösterir. Ekrandaki renkler fiziksel cilaya göre farklı görünebilir.' },
        { h: '3. Ölçüleriniz', p: 'Boşluğunuzu ölçmekten ve yapılandırıcıya ve ödeme adımına girdiğiniz bilgilerden siz sorumlusunuz. Üretimden önce son ölçüleri e-posta ile teyit ederiz; üretim bu teyit gönderildiğinde veya siparişten 24 saat sonra, hangisi daha geçse, başlar. Kapı uymazsa ne olacağı İade politikamızda açıklanmıştır.' },
        { h: '4. Sipariş ve kabul', p: 'Siparişiniz bir satın alma teklifidir. Üretim onayını gönderdiğimizde kabul etmiş oluruz. Bir siparişi reddedebilir veya iptal edebiliriz — örneğin ürün mevcut değilse, adresinize gönderim yapamıyorsak ya da fiyat veya yapılandırma hatası varsa — bu durumda ücretin tamamını iade ederiz.' },
        { h: '5. Fiyatlar ve ödeme', p: 'Fiyatlar ABD doları cinsindendir ve ödeme adımında sunulan ülkelere kargoyu içerir. Varış ülkesinin uyguladığı ithalat vergileri, gümrük ücretleri veya vergiler dahil değildir (bkz. Kargo Politikası). Ödeme, ödeme adımında tamamen alınır ve Stripe tarafından işlenir; başlıca kartları, Apple Pay, Google Pay ve sunulduğu yerlerde PayPal\'ı kabul ederiz. Kart bilgilerini saklamayız.' },
        { h: '6. Teslimat', p: 'Üretim ve kargo süreleri tahminidir ve Kargo Politikamızda belirtilmiştir. Ürünlere ilişkin risk teslimatta size geçer. Lütfen ürünleri teslimatta kontrol edin ve hasarı 48 saat içinde bildirin.' },
        { h: '7. İptal, iade ve garanti', p: 'İade, Geri Ödeme ve Garanti politikamız bu koşulların bir parçasıdır.' },
        { h: '8. Güvenli kullanım', p: 'Güvenlik kapıları küçük çocukların ve evcil hayvanların hareketini sınırlamaya yardımcı olur; yetişkin gözetiminin yerini tutmaz. Kapıyı verilen talimatlara göre, verilen donanımla, sağlam bir duvara veya kasaya monte edin. Bağlantıları ve mandalı düzenli kontrol edin. Kapıyı tırmanma aracı olarak veya yapılandırılmadığı bir yükseklik ya da yerde kullanmayın.' },
        { h: '9. Fikri mülkiyet', p: 'Lumina Gates adı, tasarımları, fotoğrafları ve web sitesi içeriği {legalName} veya lisans verenlerine aittir; yazılı izin olmadan kopyalanamaz veya ticari olarak kullanılamaz.' },
        { h: '10. Sorumluluk', p: 'Yasaların izin verdiği en geniş ölçüde, bir siparişe ilişkin her türlü talepte sorumluluğumuz o sipariş için ödediğiniz tutarla sınırlıdır. Bu koşullardaki hiçbir madde, ihmalden kaynaklanan ölüm veya yaralanma dahil yasal olarak hariç tutulamayan sorumluluğu veya yasal tüketici haklarınızı hariç tutmaz.' },
        { h: '11. Geçerli hukuk', p: 'Bu koşullar, yaşadığınız ülkenin zorunlu tüketici koruma kurallarını etkilemeksizin, ABD Wyoming Eyaleti yasalarına tabidir.' },
        { h: '12. Değişiklikler', p: 'Bu koşulları zaman zaman güncelleyebiliriz. Sipariş verdiğiniz anda yürürlükte olan sürüm o sipariş için geçerlidir.' }
      ]
    },

    privacy: {
      title: 'Gizlilik Politikası — Lumina Gates',
      description: 'Lumina Gates\'in sipariş ve ziyaretlerde hangi kişisel verileri topladığı, nasıl kullandığı, kimlerin işlediği (Stripe, kurye, e-posta) ve haklarınız.',
      h1: 'Gizlilik Politikası',
      updated: 'Son güncelleme: {date}',
      sections: [
        { h: 'Sorumlu', p: 'Bu web sitesinin veri sorumlusu, Lumina Gates olarak faaliyet gösteren {legalName}\'dir. Bu politikayla ilgili sorular için {email}.' },
        { h: 'Ne topluyoruz ve neden', p: 'Sipariş verdiğinizde: adınız, e-posta adresiniz, telefon numaranız, teslimat ve fatura adresiniz, seçtiğiniz kapı yapılandırması ve ödeme durumunuz. Bunları kapınızı üretip teslim etmek, sipariş ve kargo e-postaları göndermek, garanti taleplerini yönetmek ve muhasebe kayıtlarını tutmak için kullanırız. Bize ulaştığınızda: yalnızca yanıt vermek için adınız, e-posta adresiniz ve mesajınızın içeriği. Gezinirken: güvenlik için kısa süre tutulan standart sunucu kayıtları (IP adresi, tarayıcı, istenen sayfalar) ve — yalnızca bu sitede analitik etkinse — anonimleştirilmiş kullanım istatistikleri.' },
        { h: 'Ödemeler', p: 'Ödemeler Stripe, Inc. tarafından işlenir. Kart veya cüzdan bilgileriniz Stripe\'ın güvenli ödeme sayfasına girilir ve sunucularımıza hiçbir zaman ulaşmaz. Bu işleme için Stripe\'ın gizlilik politikası geçerlidir.' },
        { h: 'Verileri kiminle paylaşıyoruz', p: 'Yalnızca siparişinizi yerine getirmek için gereken hizmetlerle: Stripe (ödeme), kuryemiz (teslimat için ad, adres ve telefon), e-posta sağlayıcımız (sipariş ve kargo bildirimleri) ve barındırma sağlayıcımız. Kişisel verileri satmayız veya kiralamayız.' },
        { h: 'Çerezler ve analitik', p: 'Bu site takip çerezleri olmadan çalışır. Stripe, dolandırıcılık önleme için kendi ödeme sayfasında çerez kullanır. Google Analytics etkinse ziyaretleri toplu olarak ölçmek için çerez kullanır; bunları tarayıcınızda engelleyebilirsiniz, siparişinizi etkilemez.' },
        { h: 'Uluslararası aktarım', p: 'Türkiye\'de atölyesi olan bir ABD şirketiyiz; sipariş verileri her iki ülkede ve yukarıda adı geçen sağlayıcılar tarafından işlenir. Yalnızca kapınızı teslim etmek için gerekeni paylaşırız.' },
        { h: 'Saklama', p: 'Sipariş kayıtları garanti talepleri ve vergi mevzuatının gerektirdiği süre boyunca (genellikle yedi yıl) saklanır. İletişim formu mesajları çözüldükten sonra silinir.' },
        { h: 'Haklarınız', p: '{email} adresine yazarak kişisel verilerinize erişmemizi, düzeltmemizi veya silmemizi ya da işlemeye itiraz etmeyi talep edebilirsiniz. AB, İngiltere ve Kaliforniya\'da yaşayanlar yerel yasalarına göre ek haklara sahiptir; bunlara uyarız.' },
        { h: 'Çocuklar', p: 'Bu site yetişkinler içindir. 16 yaş altından bilerek kişisel veri toplamayız.' },
        { h: 'Değişiklikler', p: 'Bu politikadaki değişiklikleri yeni bir "son güncelleme" tarihiyle bu sayfada yayımlarız.' }
      ]
    },

    thankYou: {
      title: 'Sipariş alındı — Lumina Gates',
      announce: 'Teşekkürler · Özel kapınız üretime alındı',
      eyebrow: 'Sipariş onaylandı',
      h1A: 'Lumina\'yı seçtiğiniz', h1B: 'için teşekkürler.',
      body: 'Özel kapınız atölyemizde hazırlanıyor. Birkaç dakika içinde onay e-postası, 48 saat içinde üretim güncellemesi alacaksınız. Üretim süresi onaydan itibaren {leadMin}–{leadMax} iş günüdür.',
      summaryHeading: 'Sipariş özeti', orderRef: 'Sipariş referansı', loading: 'Siparişiniz yükleniyor…',
      back: 'Koleksiyona Dön', help: 'Sorunuz mu var? Onay e-postasını yanıtlayın veya {email} adresine yazın.'
    },

    notFound: {
      title: 'Sayfa bulunamadı — Lumina Gates',
      eyebrow: '404', h1A: 'Bu kapının arkasında', h1B: 'bir şey yok.',
      body: 'Aradığınız sayfa taşınmış ya da hiç var olmamış.',
      cta: 'Koleksiyona göz atın'
    }
  },

  units: { in: 'in', cm: 'cm' },
  misc: { and: 've', more: 'Daha fazla', business_days: 'iş günü' }
};
