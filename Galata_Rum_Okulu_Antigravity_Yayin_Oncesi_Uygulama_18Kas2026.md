# ANTIGRAVITY — GALATA RUM OKULU | YAYIN ÖNCESİ SON UYGULAMA VE GATE

**Tarih:** 17 Kasım 2026 — Planlanan canlıya geçiş: **18 Kasım 2026**, yalnızca proje sahibi onayıyla.

## ROL VE AMAÇ

Senior Full-Stack Engineer + Technical SEO Migration Lead + QA Lead + Release Manager olarak çalış. Daha önce üretilen `reports/seo-final-audit/` dosyalarını, `02-claims-vs-evidence.csv`, `04-full-url-inventory.csv`, `05-legacy-redirect-map.csv` ve `evidence/` bulgularını kaynak al. `d27ed60` commit'inden sonra oluşan regresyonları gerçekten düzelt, bütün doğrulamaları yap, yeni siteyi **yarın yapılabilecek kontrollü domain geçişi için hazır** hale getir. Audit-only döngüsüne girme: çöz, test et ve kanıtla.

## KESİN KURALLAR — PROJE SAHİBİ KARARI

1. **YALNIZCA ADMIN SAYFALARINA `noindex` uygula**: `/admin`, `/admin/*` ve var olan diğer gerçek yönetim/giriş rotaları. Admin adreslerini sitemap'ten çıkar. Admin erişimini mevcut authentication/authorization ile koru. `X-Robots-Tag: noindex, nofollow` veya uygun sayfa seviyesinde robots meta uygulamasını HTTP response ve render edilen DOM'da kontrol et. Sadece `robots.txt Disallow` kullanıp noindex'in tarayıcılarca görüleceğini varsayma. Admin dışındaki tüm gerçek public TR/EN/EL sayfalara topluca `noindex` **uygulama**.
2. **261 placeholder iddiası doğrulanmış kabul edilmeyecek.** Yüklenen `04-full-url-inventory.csv` içeriğiyle rapordaki sayılar çelişiyor. Tekil kayıt bazında kanıt göster, ancak hiçbir public arşiv/eser/etkinlik URL'sini otomatik `noindex` yapma, sitemap'ten kaldırma veya silme. Gerçekten eksik/tekrarlı kayıtları yalnızca `NEEDS CONTENT REVIEW` olarak listele; uydurma metin/metadata üretme.
3. `main-one-fawn.vercel.app` staging ortamındaki **host bazlı** `X-Robots-Tag: noindex, nofollow` koruması **aynen kalacak**. Bu, “yalnız admin noindex” kuralının istisnasıdır: staging Google tarafından indekslenmemeli; gerçek domain için hazırlanan public sayfalar ise yayına geçildiğinde indexable olmalıdır. Staging noindex'i `galatarumokulu.org` üzerine sızmayacak şekilde **host bazlı** doğrula.
4. **BUGÜN domain geçişi yok.** `galatarumokulu.org` mevcut WordPress production olarak kalacak. DNS, domain-binding, nameserver, Cloudflare, Vercel production alias, production environment variable ve production veritabanını değiştirme. Eski siteyi kapatma/silme/redirect'e alma. Yarın 18 Kasım 2026'da da **ayrı açık kullanıcı onayı olmadan** cutover yapma.
5. Kod değişiklikleri ve yerel testler serbest. Staging'e deploy **yalnızca deployment mapping ile production'ı kesinlikle etkilemediği doğrulanırsa** yapılabilir; emin değilsen push/deploy yapma ve READY FOR STAGING DEPLOY olarak bildir. Önce temiz git durumunu kaydet, değişiklikleri gözden geçir, geri alma planı hazırla. Gerçek verilere müdahale etme.
6. `claude-seo` puanını artırmak uğruna sahte DOM, gizli görsel, anlamsız meta, kullanılamayan WebMCP veya yanlış Markdown alternate ekleme. Kanıtlanan gerçek çalışma zamanı kalitesine odaklan.

## UYGULAMA — SIRAYLA TAMAMLA

### A. URL yönlendirmeleri ve migration
- `05-legacy-redirect-map.csv` ve gerçek eski WordPress sitemap URL'lerini referans al. 165 eski URL'nin doğru dilde, aynı konu ve doğru yeni sayfaya gittiğini doğrula. Alias'ları (`/tr/hakkimizda/`, `/hakkimizda`, `/tr/iletisim/` vb.) ayrıca test et.
- `/tr/hakkimizda/` 404 sorununu gider; hedef `/tarihce` olacak. İletişim alias'larını `/bize-ulasin` sayfasına yönlendir. İngilizce ve Yunanca içerikleri çapraz dillere yönlendirme.
- `308 → 308 → 200` çift yönlendirme zincirlerini Vercel davranışıyla uyumlu biçimde mümkün olduğunca doğrudan tek hop'a indir. Bunu yapmak için diğer public rotaları kıracak global `trailingSlash` değişikliği yapma. 1-hop teknik olarak mümkün değilse nedenini, çözüm alternatiflerini ve Google açısından gerçek etkisini belgeleyerek kısa zinciri kabul testleriyle değerlendir; **0 broken target** kesin koşuldur.
- Testleri staging hostname üzerinde yap; gerçek domain WordPress hâlâ çalıştığı için staging üzerinde canonical'in üretim domainini göstermesini otomatik hata sayma.

### B. Prerender / Hydration / SEO
- `prerender.mjs`, `SEO.tsx`, `translations.ts` ve ilgili sayfa bileşenlerini tek ortak, locale-aware SEO veri kaynağıyla uyumlu hale getir. Static HTML ve hydration sonrası `title`, description, canonical, hreflang, görünür H1 ve kritik structured data içerikleri beklenmedik şekilde değişmemeli.
- Title için mekanik 30–60 karakteri koşulsuz hedef alma; eşsiz, doğru, arama niyetini karşılayan başlık üret. TR/EN/EL karşılıklılığını koru.
- Sahte `<img width="1" height="1" fetchpriority="high">` OG çağrısını kaldır; gerçek sayfa hero görsellerinin LCP önceliğini doğru yönet. `/arsiv` üzerindeki kırık 2 resmi düzelt veya hatalı referansları temizle. Sosyal paylaşım OG görseli gerekiyorsa dosyanın `HTTP 200`, `image/*` MIME ve gerçek varlık olduğundan emin ol; OG meta ile LCP img'yi karıştırma.
- `index.html` içerisindeki CSP tarafından bloklanan `Speculation Rules` özelliğini SPA mimarisinde fayda kanıtlanmıyorsa kaldır. CSP'yi `unsafe-inline` ekleyerek gevşetme. Tüm kritik rotalarda CSP ihlali sıfır olmalı.
- Tüm sayfalara `/index.md`'yi Markdown karşılığı olarak ilan etmeyi durdur; alternatif sadece gerçekten eşdeğer içerik mevcutsa doğru sayfada kalsın. WebMCP deneysel; yalnız desteklenen tarayıcıda çalışıyorsa ve gerçek formuna bağlıysa sakla, SEO başarısı diye raporlama; gerekiyorsa zararsız biçimde devre dışı bırak.

### C. Kurumsal gerçeklik ve içerik
- MICE kapasite/elektrik değerleri `dbSync.ts`, kat planı, sayfa tablosu, JSON-LD, `llms.txt` ve diğer alanlarda çelişiyor: `400/180, 3×125A` ile `300/150, 2×63A+32A` arasında **kendi başına seçim yapma**. Projede kurumca onaylı birincil veri varsa onu belgele ve tüm yüzeylere aynı kaynaktan bağla. Yoksa `FACT APPROVAL REQUIRED` olarak blokla; doğrulanmamış bilgileri yeni yerlere yayma. Gerekirse nihai onaya dek çelişkili unsurları güvenli biçimde göstermeme önerisini raporla; ancak kurum onayı yerine karar verme.
- Kültür merkezi **Salı–Cumartesi açık, Pazar/Pazartesi kapalıdır**. Günlük saatler bilinmiyor; uydurma. Simone Restaurant saatleri ile merkez saatlerini karıştırma. Diğer kurumsal bilgiler doğrulanmış kaynakla eşleşmeli.
- TR/EN/EL menü, formlar, CTA ve navigasyon testlerini gerçekleştir; eskiden indekslenmiş etkinlik ve sergi sayfalarını koru.

### D. End-to-end doğrulama
- Temiz build, TS/lint/unit testleri, mümkünse Playwright/Puppeteer testleri çalıştır. Tüm 552 sitemap URL'si + 3 admin URL'sini HTTP, canonical, hreflang, robots, içerik, linkler, görseller, dil, status ve redirect yönünden denetle; fakat içerik/kapsam hatası tespit edilirse public URL'lere otomatik noindex verme.
- Özellikle `/`, `/tarihce`, `/arsiv`, `/gecmis-etkinlikler`, `/mekan-kiralama`, `/bize-ulasin` ve `en/el` varyantlarını 390px ve 1440px gerçek tarayıcıda test et. Forms: validasyon ve ön yüz akışı; gerçek e-posta/DB yazma veya canlı form submit yok. Console CSP=0, ORB=0, kritik asset 404=0, hydration mismatches=0 hedefle.
- Staging tüm public sayfalarda host bazlı noindex korunsun; domain yeni sisteme taşındığında public sayfalarda yanlışlıkla noindex olmayacağını host header testleriyle ispatla (gerekiyorsa local preview/host koşulu simülasyonu; production'ı değiştirmeden).
- `admin` rotalarının sitemap dışında ve route bazında noindex olduğunu kanıtla. URL erişimi authentication olmadan hassas içerik göstermemeli.
- 165 eski URL için status + yönlendirme hop sayısı + hedef path + içerik eşleşmesini CSV olarak üret; `/tr/hakkimizda/` dahil legacy alias ayrı test edilsin.

### E. Yarın için release paketi — bugün cutover yok
`reports/seo-go-live-readiness/` altına:
- `01-executive-status.md`: bugün düzeltilenler, kalan blocker'lar, GO / CONDITIONAL GO / NO-GO; kanıtlı sonuç
- `02-fix-diff-and-commit.md`: değiştirilen dosyalar, diff özeti, commit hash (varsa), staging deployment ID (varsa)
- `03-redirect-acceptance.csv`: eski URL ve alias testleri
- `04-indexing-matrix.csv`: public ve admin rotalar + staging vs gelecekteki production robots doğrulaması; **admin dışında public noindex=0** (staging host istisnası açık)
- `05-runtime-evidence.md`: CSP, ORB, LCP, browser, kırık görsel, hydration ve üç dil sonuçları
- `06-content-truth-gates.md`: kurumsal bilgi/kapasite ve eksik içerik onay gereksinimleri; 261 placeholder iddiası ile CSV çelişkisinin çözümü
- `07-tomorrow-cutover-runbook.md`: DNS/domain kontrol listesi, önceki WordPress backup/rollback, deploy sequence, host bazlı noindex kaldırılmasının sadece primary domainde test edilmesi, GSC/GA4 erişim eksikleri, yeni sitemap, 165 redirect smoke testleri, T+0/T+1/T+7 monitoring, geri alma tetikleyicileri
- `evidence/`: komut çıktıları, tarayıcı logları, URL sonuçları, ekran görüntüleri

## SON KARAR VE DURDURMA KOŞULU
Bütün güvenli düzeltmeleri tamamla; yetersiz kanıt varsa NOT VERIFIED olarak yaz. Eksik kurumsal kapasite verisi gibi kullanıcı onayı gerektiren konuda sayı uydurma. Bugün `galatarumokulu.org` domainini yeni siteye geçirme. Çıktının sonunda **“18 Kasım 2026 için hazır mı?”** sorusuna gerçek test kanıtlarına dayalı GO / CONDITIONAL GO / NO-GO cevabı ver ve varsa benim yapmam gereken tekil onayları açıkça belirt. Kullanıcı onayı olmadan production cutover yapma.
