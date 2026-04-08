import Navbar from "../components/Navbar";

const STOCK = {
  factory1: "image1.jpg",
  factory2: "image2.jpg",
  factory3: "image3.jpg",
  team1:    "image4.webp",
  team2:    "image5.webp",
  team3:    "image6.jpg",
};

export default function CorporatePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <div className="pt-[66px] bg-white border-b border-[#dde4ef]">
        <div className="max-w-4xl mx-auto px-8 py-10">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#1e88e5] mb-2">
            <span className="block w-5 h-px bg-[#1e88e5]" />
            Kurumsal
          </div>
          <h1 className="font-condensed text-[36px] font-extrabold uppercase text-[#071e3d] leading-tight tracking-wide">
            Hakkımızda
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-14">

        {/* Paragraph 1 */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <span className="block w-8 h-px bg-[#1e88e5]" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1e88e5]">Kimiz?</span>
          </div>
          <h2 className="font-condensed text-[26px] font-extrabold uppercase text-[#071e3d] mb-4">
            Mavzer Ambalaj — 1994'ten Bu Yana Güvenilir Tedarikçiniz
          </h2>
          <div className="text-[14px] text-[#4a5568] leading-[1.9] space-y-4 max-w-3xl">
            <p>
              Mavzer Pazarlama Matbaacılık Reklam Ambalaj Gıda Kimya Sanayi ve Ticaret Ltd. Şti., 1994 yılından bu yana Ankara'da faaliyet göstermekte olup; gıda, kimya, matbaacılık ve ambalaj sektörlerinde kapsamlı ürün ve hizmet yelpazesiyle öne çıkan köklü bir Türk firmasıdır.
            </p>
            <p>
              Kurulduğumuz günden itibaren müşteri memnuniyetini her şeyin önünde tutan bir anlayışla hareket ettik. Restoran, kafe, otel, hastane ve sanayi tesisleri başta olmak üzere yüzlerce kurumsal müşteriye kesintisiz hizmet sunmaktayız. Kalite standartlarımızı sürekli yükselterek sektörde güvenilir bir referans noktası haline geldik.
            </p>
            <p>
              Üretim süreçlerimizde çevreye duyarlı malzemelere öncelik veriyor, geri dönüştürülebilir ve biyobozunur ambalaj çözümleriyle sürdürülebilir bir geleceğe katkı sağlıyoruz. Güçlü tedarik ağımız ve deneyimli ekibimizle her ölçekteki işletmeye özel çözümler üretmeye devam ediyoruz.
            </p>
          </div>
        </div>

        {/* Images 1 */}
        <div className="grid grid-cols-3 gap-4 mb-14">
          {[STOCK.factory1, STOCK.factory2, STOCK.factory3].map((src, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-[#dde4ef] aspect-[4/3]">
              <img src={src} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-[#dde4ef] mb-14" />

        {/* Paragraph 2 */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <span className="block w-8 h-px bg-[#1e88e5]" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1e88e5]">Vizyonumuz</span>
          </div>
          <h2 className="font-condensed text-[26px] font-extrabold uppercase text-[#071e3d] mb-4">
            Geleceğe Yönelik Güçlü Bir Vizyon
          </h2>
          <div className="text-[14px] text-[#4a5568] leading-[1.9] space-y-4 max-w-3xl">
            <p>
              Mavzer olarak vizyonumuz; sürdürülebilir üretim anlayışını benimseyerek hem ulusal hem de uluslararası pazarlarda tanınan, saygın bir ambalaj markası olmaktır. Teknolojiye yapılan yatırımlar ve ar-ge çalışmalarıyla ürün kalitemizi ve çeşitliliğimizi sürekli geliştiriyoruz.
            </p>
            <p>
              Ekibimiz; alanında uzman mühendisler, deneyimli satış danışmanları ve müşteri odaklı lojistik personelinden oluşmaktadır. Her bir çalışanımız, kurumsal değerlerimizi benimsemiş ve müşterilerimizin ihtiyaçlarını en iyi şekilde karşılamak için özel olarak yetiştirilmiştir.
            </p>
            <p>
              30 yılı aşkın sektör deneyimimiz, 500'ü aşkın aktif referansımız ve %100 müşteri memnuniyeti hedefimizle, Türkiye'nin dört bir yanındaki işletmelere kaliteli ambalaj çözümleri sunmaya devam ediyoruz. Güçlü altyapımız ve esnek üretim kapasitemizle büyük ve küçük ölçekli siparişleri aynı özenle karşılıyoruz.
            </p>
          </div>
        </div>

        {/* Images 2 */}
        <div className="grid grid-cols-3 gap-4 mb-14">
          {[STOCK.team1, STOCK.team2, STOCK.team3].map((src, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-[#dde4ef] aspect-[4/3]">
              <img src={src} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>

        {/* Stats strip */}
        {/* <div className="grid grid-cols-4 gap-px bg-[#dde4ef] border border-[#dde4ef] rounded-xl overflow-hidden mt-4">
          {[
            { num: "30+", label: "Yıllık Deneyim" },
            { num: "500+", label: "Aktif Referans" },
            { num: "6", label: "Hizmet Sektörü" },
            { num: "%100", label: "Müşteri Memnuniyeti" },
          ].map((s) => (
            <div key={s.label} className="bg-white px-6 py-7 text-center">
              <div className="font-condensed text-[36px] font-extrabold text-[#071e3d] leading-none tracking-tight">
                {s.num}
              </div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-[#9aa3af] mt-2">
                {s.label}
              </div>
            </div>
          ))}
        </div> */}

      </div>
    </div>
  );
}