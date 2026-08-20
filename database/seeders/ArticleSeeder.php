<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\ArticleStatus;
use App\Models\Article;
use App\Models\User;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::whereHas('roles', function ($query) {
            $query->whereIn('name', ['admin', 'super-admin']);
        })->first() ?? User::first();

        $articles = [
            [
                'title' => 'Ronica, International Istanbul Furniture Fair 2026’da (IFF) Yerini Alıyor',
                'slug' => 'ronica-international-istanbul-furniture-fair-2026da-iff-yerini-aliyor',
                'excerpt' => 'Ronica, 27–31 Ocak 2026 tarihlerinde düzenlenecek International Istanbul Furniture Fair (IFF) kapsamında İstanbul’da sektör profesyonelleriyle buluşuyor. Salon 1 – Stand 131E.',
                'content' => "# Ronica, International Istanbul Furniture Fair 2026’da (IFF) Yerini Alıyor\n\n**Ronica, 27–31 Ocak 2026 tarihleri arasında düzenlenecek International Istanbul Furniture Fair (IFF) kapsamında İstanbul’da sektör profesyonelleriyle buluşuyor.** Dış mekân yaşamına odaklanan koleksiyonlarımızı; **A sınıfı tik ağacı (grade-A teak)**, el işçiliği detayları ve konfor odaklı tasarım yaklaşımıyla fuar ziyaretçilerine yakından sunacağız.\n\nIFF 2026 boyunca Ronica standında, markamızın malzeme seçimi ve işçilik standartlarını yerinde inceleyebilir; koleksiyonlarımızın dokusunu, oturum konforunu ve detay kalitesini birebir deneyimleyebilirsiniz. Proje bazlı ihtiyaçlar, toptan satın alma süreçleri ve iş ortaklığı görüşmeleri için ekibimiz fuar süresince standımızda hazır olacaktır.\n\n## Ziyaret Bilgileri\n\n- **Etkinlik:** International Istanbul Furniture Fair (IFF) 2026 / İstanbul Uluslararası Mobilya Fuarı\n- **Tarih:** **27–31 Ocak 2026**\n- **Yer:** İstanbul Fuar Merkezi\n- **Ronica:** **Salon 1 – Stand 131E**\n\nFuar süresince görüşme planlamak veya ürün gruplarımız hakkında detaylı bilgi almak için bizimle iletişime geçebilirsiniz.",
                'featured_image' => 'https://www.ronica.com.tr/yukleme/blog/7-ronica-international-istanbul-furniture-fair-2026da-iff-yerini-aliyor-.png',
                'author' => $admin->name ?? 'Admin Ronica',
                'author_id' => $admin->id ?? null,
                'status' => ArticleStatus::PUBLISHED,
                'tags' => ['IFF 2026', 'Fuar', 'Dış Mekan Mobilyası', 'Tik Ağacı', 'Ronica'],
                'meta_title' => 'Ronica, International Istanbul Furniture Fair 2026’da (IFF) Yerini Alıyor',
                'meta_description' => 'Ronica, 27–31 Ocak 2026’da International Istanbul Furniture Fair (IFF)’da. Grade-A teak ve el işçiliği dış mekân koleksiyonlarını keşfedin.',
                'meta_keywords' => 'Ronica, IFF 2026, International Istanbul Furniture Fair, İstanbul Uluslararası Mobilya Fuarı, dış mekân mobilyası, bahçe mobilyası, teak, tik ağacı, grade-A teak, el işçiliği, rattan mobilya',
                'published_at' => '2025-12-22 00:00:00',
            ],
            [
                'title' => 'Ronica Furniture Erbil Mağazamız Açıldı!',
                'slug' => 'ronica-furniture-erbil-magazamiz-acildi',
                'excerpt' => 'Yıllardır dış mekân mobilya sektöründe kalite, konfor ve estetikten ödün vermeden ürettiğimiz ürünlerimizi Erbil’deki yeni mağazamızda müşterilerimizle buluşturuyoruz.',
                'content' => "# Ronica Furniture Erbil Mağazamız Açıldı!\n\nYıllardır dış mekân mobilya sektöründe kalite, konfor ve estetikten ödün vermeden ürettiğimiz ürünlerimizi, dünyanın farklı noktalarındaki müşterilerimizle buluşturmanın mutluluğunu yaşıyoruz. Şimdi ise Ronica Furniture ailesi olarak yepyeni bir adım atarak **Erbil’deki mağazamızın açılışını** sizlerle paylaşıyoruz. Bu yeni mağaza, sadece mobilya satış noktası değil; aynı zamanda misafirlerimizin Ronica Furniture kalitesini ve **lüks bahçe mobilyası** koleksiyonlarını birebir deneyimleyebileceği bir yaşam alanı olacak.\n\n## Ronica Furniture’ın Yolculuğu\n\n2016 yılında Endonezya’nın Cirebon şehrinde başlayan yolculuğumuz, bugün global bir marka olma yolunda hızla ilerliyor. Alüminyum, sentetik rattan, ip ve özellikle A sınıfı **Perhutani Blora teak ağacından** üretilen ürünlerimizle dış mekânlarda lüks, dayanıklılık ve estetiği bir arada sunuyoruz. Modern tasarım çizgilerimiz, fonksiyonelliğe verdiğimiz önem ve kaliteli üretim anlayışımızla, müşterilerimize yalnızca mobilya değil, aynı zamanda uzun yıllar kullanılacak bir yaşam tarzı sunuyoruz.\n\nTürkiye’deki çalışmalarımızla birlikte, Orta Doğu bölgesinde de varlığımızı güçlendiriyoruz. **Ronica Furniture Erbil mağazamız**, bu stratejik adımların en yenisi ve en heyecan verici olanı.\n\n## Neden Erbil?\n\nErbil, son yıllarda hızlı gelişimi, yükselen yaşam standartları ve artan dış mekân kültürü ile dikkat çekiyor. İnsanlar bahçelerinde, teraslarında ve balkonlarında daha fazla vakit geçiriyor; konforu ve şıklığı dış mekâna da taşımak istiyor. İşte tam bu noktada Ronica Furniture olarak devreye giriyoruz.\n\n## Mağazamızda Sizi Neler Bekliyor?\n\n- **Teak Koleksiyonu**: Dayanıklılığı, doğal dokusu ve zamansız görünümüyle öne çıkan teak mobilyalar.\n- **Alüminyum & İp Tasarımlar**: Hafif, modern ve uzun ömürlü seçenekler.\n- **Sentetik Rattan Ürünler**: Hem klasik hem modern çizgileri sevenler için şık alternatifler.\n- **Lüks Bahçe Mobilyaları**: Estetik tasarımın ve konforun birleştiği özel koleksiyonlar.\n- **Projeye Özel Çözümler**: Villa, restoran, otel ve kafe projeleri için özel tasarımlar ve toplu çözümler.\n\n## Ronica Furniture Olarak Hedefimiz\n\nErbil mağazamızla birlikte hedefimiz, yalnızca ürün satmak değil; dış mekânlarda geçirilen zamanın kalitesini artırmak. Ayrıca, sürdürülebilirlik anlayışımız doğrultusunda doğal malzeme kullanımına, uzun ömürlü ürünler geliştirmeye ve çevreye duyarlı üretim yöntemlerine önem veriyoruz.",
                'featured_image' => 'https://www.ronica.com.tr/yukleme/blog/1-ronica-furniture-erbil-magazamiz-acildi-.jpg',
                'author' => $admin->name ?? 'Admin Ronica',
                'author_id' => $admin->id ?? null,
                'status' => ArticleStatus::PUBLISHED,
                'tags' => ['Mağaza Açılışı', 'Erbil', 'Lüks Bahçe Mobilyası', 'Teak', 'Ronica'],
                'meta_title' => 'Ronica Furniture Erbil Mağazamız Açıldı! » Ronica Outdoor Furniture',
                'meta_description' => 'Ronica Outdoor Furniture, Endonezya`nın Cirebon şehrinden yedi yıllık uzmanlıkla üretilen birinci sınıf dış mekan mobilyaları sunar.',
                'meta_keywords' => 'dış mekan mobilyaları, outdoor furniture, rattan mobilya, sentetik rattan, doğal rattan, tik ağacı mobilya, Erbil mağaza, Ronica Outdoor Furniture',
                'published_at' => '2025-11-15 00:00:00',
            ],
            [
                'title' => "Ronica Furniture Artık Türkiye'de!",
                'slug' => 'ronica-furniture-artik-turkiyede',
                'excerpt' => 'Kalite, tasarım ve dayanıklılığı bir arada sunan Ronica Furniture, beymen.com ve hipicon.com üzerinden Türkiye\'deki müşterileriyle buluşuyor.',
                'content' => "# Ronica Furniture Artık Türkiye'de!\n\nKalite, tasarım ve dayanıklılığı bir arada sunan **Ronica Furniture**, artık Türkiye’de! Yıllardır Endonezya’daki modern fabrikamızda ürettiğimiz **lüks bahçe mobilyaları** şimdi Türkiye’deki seçkin müşterilerimizle buluşuyor. Bu büyük adımı, Türkiye’nin önde gelen online alışveriş platformlarından **beymen.com** ve **hipicon.com** üzerinden satışa başlayarak atmış bulunuyoruz.\n\n## Globalden Türkiye’ye Uzanan Yolculuk\n\n2016 yılında Endonezya’nın Cirebon şehrinde kurulan Ronica Furniture, kısa sürede uluslararası pazarda kendine güçlü bir yer edindi. Alüminyum, sentetik rattan, ip ve özellikle A sınıfı **Perhutani Blora teak ağacı** ile üretilen mobilyalarımız, dış mekân yaşamında kaliteyi öncelik haline getiren müşteriler için özel olarak tasarlanıyor. Bugün markamız; Avrupa, Orta Doğu ve Asya’nın birçok ülkesinde tercih edilen güvenilir bir isim haline geldi.\n\n## Lüks Bahçe Mobilyası Artık Bir Tık Uzağınızda\n\nArtık Ronica Furniture ürünlerine ulaşmak için yurt dışından sipariş vermenize gerek yok. **beymen.com** ve **hipicon.com** üzerinden kolayca sipariş verebilir, bahçenizi, terasınızı veya yazlığınızı Ronica’nın zarif ve dayanıklı mobilyalarıyla buluşturabilirsiniz.\n\n- **beymen.com**: Türkiye’nin lüks alışveriş adresi Beymen, Ronica Furniture koleksiyonlarını online mağazasına ekledi.\n- **hipicon.com**: Tasarım ve sanat odaklı ürünleriyle öne çıkan Hipicon, Ronica Furniture’ın modern çizgilerini Türkiye’deki müşterilere sunuyor.\n\n## Türkiye’de Hangi Koleksiyonlarla Varız?\n\n- **Teak Koleksiyonu**: Zamansız şıklık ve dayanıklılığın simgesi.\n- **Alüminyum & İp Tasarımlar**: Modern yaşam alanlarına uygun, hafif ve kullanışlı modeller.\n- **Sentetik Rattan Serisi**: Hem klasik hem çağdaş tarzı sevenler için ideal.\n- **Lüks Bahçe Mobilyaları**: Villalar, yazlıklar, restoranlar ve oteller için tasarlanmış özel parçalar.\n\n## Neden Ronica Furniture?\n\nTürkiye’de Ronica Furniture’ı tercih eden müşterilerimiz, sadece bir mobilya değil; uzun yıllar kullanabilecekleri bir yaşam tarzı satın alıyorlar. Bizim için mobilya; sağlamlık, tasarım ve sürdürülebilirliği bir araya getiren bir bütünlük anlamına geliyor.",
                'featured_image' => 'https://www.ronica.com.tr/yukleme/blog/2-ronica-furniture-artik-turkiyede-.webp',
                'author' => $admin->name ?? 'Admin Ronica',
                'author_id' => $admin->id ?? null,
                'status' => ArticleStatus::PUBLISHED,
                'tags' => ['Türkiye', 'Beymen', 'Hipicon', 'Lüks Furniture', 'Bahçe Mobilyası'],
                'meta_title' => "Ronica Furniture Artık Türkiye'de! » Ronica Outdoor Furniture",
                'meta_description' => 'Ronica Outdoor Furniture, Endonezya`nın Cirebon şehrinden yedi yıllık uzmanlıkla üretilen birinci sınıf dış mekan mobilyaları sunar.',
                'meta_keywords' => 'dış mekan mobilyaları, outdoor furniture, rattan mobilya, beymen, hipicon, Türkiye lansmanı, Ronica Outdoor Furniture',
                'published_at' => '2025-10-10 00:00:00',
            ],
            [
                'title' => 'Bahçe Mobilyalarında Tik Ağacı: Dayanıklılık ve Zarafetin Buluşması',
                'slug' => 'bahce-mobilyalarinda-tik-agaci',
                'excerpt' => 'Bahçe mobilyalarında tik ağacı (teak) tercih etmenin nedenleri, doğal yağ içeriği, suya dayanıklılığı ve bakım ipuçları.',
                'content' => "# Bahçe Mobilyalarında Tik Ağacı: Dayanıklılık ve Zarafetin Buluşması\n\nBahçe mobilyaları seçerken en çok dikkat edilmesi gereken özelliklerden biri, kullanılan malzemenin **dış mekân koşullarına dayanıklılığıdır**. Yazın kavurucu sıcağına, kışın yağmurlarına ve mevsimsel değişimlere maruz kalan bahçe mobilyaları, doğru malzemeden üretilmediğinde kısa sürede yıpranır. İşte tam da bu noktada devreye **tik ağacı (teak)** giriyor.\n\nTik ağacı, yıllardır **lüks bahçe mobilyası** denildiğinde akla gelen ilk malzeme olmuştur. Ronica Furniture olarak biz de koleksiyonlarımızda **A sınıfı Perhutani Blora teak ağacı** kullanıyor, uzun ömürlü ve zarif mobilyaları müşterilerimizle buluşturuyoruz.\n\n## Tik Ağacının Benzersiz Özellikleri\n\n1. **Doğal Yağ İçeriği**: Tik ağacı, yapısında doğal yağlar barındırır. Bu yağlar sayesinde ahşap, dış etkenlere karşı adeta kendi koruma kalkanını oluşturur.\n2. **Suya Dayanıklılık**: Havuz kenarında, deniz kıyısında veya yağışlı bölgelerde bile güvenle kullanılabilir.\n3. **Uzun Ömür**: Doğru bakımla tik ağacından yapılan bir mobilya **onlarca yıl kullanılabilir**.\n4. **Estetik ve Doğal Görünüm**: Kendine özgü sıcak kahverengi tonlarıyla göz alıcı bir görünüme sahiptir. Zamanla oluşan gümüşi gri patinası ise ona ayrı bir karakter katar.\n5. **Sürdürülebilirlik**: Perhutani Blora ormanlarından sertifikalı kaynaklardan temin edilmektedir.\n\n## Tik Mobilyaların Bakımı\n\nTik ağacı mobilyalar, bakımı en kolay doğal ahşaplardandır. Yılda bir kez tik yağı uygulayarak rengini koruyabilir veya nemli bir bezle düzenli temizleyebilirsiniz.\n\n## Sonuç: Dayanıklılık + Estetik = Tik Ağacı\n\nBahçe mobilyalarında kaliteyi, uzun ömürlülüğü ve zarafeti bir arada istiyorsanız, tik ağacı doğru tercihtir. Ronica Furniture’ın **A sınıfı tik ağacı** ile ürettiği koleksiyonlar, dış mekân yaşamına lüks ve konfor katıyor.",
                'featured_image' => 'https://www.ronica.com.tr/yukleme/blog/3-bahce-mobilyalarinda-tik-agaci-teak-wood-.webp',
                'author' => $admin->name ?? 'Admin Ronica',
                'author_id' => $admin->id ?? null,
                'status' => ArticleStatus::PUBLISHED,
                'tags' => ['Tik Ağacı', 'Teak Wood', 'Bahçe Mobilyası', 'Bakım Rehberi', 'Material'],
                'meta_title' => 'Bahçe Mobilyalarında Tik Ağacı » Ronica Outdoor Furniture',
                'meta_description' => 'Ronica Outdoor Furniture, Endonezya`nın Cirebon şehrinden yedi yıllık uzmanlıkla üretilen birinci sınıf dış mekan mobilyaları sunar.',
                'meta_keywords' => 'tik ağacı mobilya, teak wood, bahçe mobilyası, bakımı, Perhutani Blora teak',
                'published_at' => '2025-09-01 00:00:00',
            ],
        ];

        foreach ($articles as $articleData) {
            $wordCount = str_word_count(strip_tags($articleData['content']));
            $articleData['read_time'] = (int) ceil($wordCount / 200);

            Article::updateOrCreate(
                ['slug' => $articleData['slug']],
                $articleData
            );
        }
    }
}

