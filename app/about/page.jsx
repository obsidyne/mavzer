"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API = process.env.NEXT_PUBLIC_API_URL;

const STOCK = {
  factory1: "image1.jpg",
  factory2: "image2.jpg",
  factory3: "image3.jpg",
  team1:    "image4.webp",
  team2:    "image5.webp",
  team3:    "image6.jpg",
};

export default function CorporatePage() {
  const [c, setC] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/about`)
      .then((r) => r.json())
      .then(setC)
      .catch(() => {});
  }, []);

  const data = c || {
    section1_label: "Kimiz?",
    section1_title: "Mavzer Ambalaj — 1994'ten Bu Yana Güvenilir Tedarikçiniz",
    section1_p1: "Mavzer Pazarlama Matbaacılık Reklam Ambalaj Gıda Kimya Sanayi ve Ticaret Ltd. Şti., 1994 yılından bu yana Ankara'da faaliyet göstermekte olup; gıda, kimya, matbaacılık ve ambalaj sektörlerinde kapsamlı ürün ve hizmet yelpazesiyle öne çıkan köklü bir Türk firmasıdır.",
    section1_p2: "Kurulduğumuz günden itibaren müşteri memnuniyetini her şeyin önünde tutan bir anlayışla hareket ettik. Restoran, kafe, otel, hastane ve sanayi tesisleri başta olmak üzere yüzlerce kurumsal müşteriye kesintisiz hizmet sunmaktayız. Kalite standartlarımızı sürekli yükselterek sektörde güvenilir bir referans noktası haline geldik.",
    section1_p3: "Üretim süreçlerimizde çevreye duyarlı malzemelere öncelik veriyor, geri dönüştürülebilir ve biyobozunur ambalaj çözümleriyle sürdürülebilir bir geleceğe katkı sağlıyoruz. Güçlü tedarik ağımız ve deneyimli ekibimizle her ölçekteki işletmeye özel çözümler üretmeye devam ediyoruz.",
    section1_img1: STOCK.factory1,
    section1_img2: STOCK.factory2,
    section1_img3: STOCK.factory3,
    section2_label: "Vizyonumuz",
    section2_title: "Geleceğe Yönelik Güçlü Bir Vizyon",
    section2_p1: "Mavzer olarak vizyonumuz; sürdürülebilir üretim anlayışını benimseyerek hem ulusal hem de uluslararası pazarlarda tanınan, saygın bir ambalaj markası olmaktır. Teknolojiye yapılan yatırımlar ve ar-ge çalışmalarıyla ürün kalitemizi ve çeşitliliğimizi sürekli geliştiriyoruz.",
    section2_p2: "Ekibimiz; alanında uzman mühendisler, deneyimli satış danışmanları ve müşteri odaklı lojistik personelinden oluşmaktadır. Her bir çalışanımız, kurumsal değerlerimizi benimsemiş ve müşterilerimizin ihtiyaçlarını en iyi şekilde karşılamak için özel olarak yetiştirilmiştir.",
    section2_p3: "30 yılı aşkın sektör deneyimimiz, 500'ü aşkın aktif referansımız ve %100 müşteri memnuniyeti hedefimizle, Türkiye'nin dört bir yanındaki işletmelere kaliteli ambalaj çözümleri sunmaya devam ediyoruz. Güçlü altyapımız ve esnek üretim kapasitemizle büyük ve küçük ölçekli siparişleri aynı özenle karşılıyoruz.",
    section2_img1: STOCK.team1,
    section2_img2: STOCK.team2,
    section2_img3: STOCK.team3,
  };

  return (
    <div className="min-h-screen relative">

      {/* Background image */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />
      {/* Overlay so text stays readable */}
      <div className="fixed inset-0 z-0 bg-white/50" />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />

        {/* Header */}
        <div className="pt-[66px] --bg-white/70 --backdrop-blur-sm --border-b border-[#dde4ef]">
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

          {/* Section 1 */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <span className="block w-8 h-px bg-[#1e88e5]" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1e88e5]">{data.section1_label}</span>
            </div>
            <h2 className="font-condensed text-[26px] font-extrabold uppercase text-[#071e3d] mb-4">{data.section1_title}</h2>
            <div className="text-[14px] text-[#4a5568] leading-[1.9] space-y-4 max-w-3xl">
              {[data.section1_p1, data.section1_p2, data.section1_p3].filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-14">
            {[data.section1_img1, data.section1_img2, data.section1_img3].filter(Boolean).map((src, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-[#dde4ef] aspect-[4/3]">
                <img src={src} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>

          <div className="border-t border-[#dde4ef] mb-14" />

          {/* Section 2 */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <span className="block w-8 h-px bg-[#1e88e5]" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1e88e5]">{data.section2_label}</span>
            </div>
            <h2 className="font-condensed text-[26px] font-extrabold uppercase text-[#071e3d] mb-4">{data.section2_title}</h2>
            <div className="text-[14px] text-[#4a5568] leading-[1.9] space-y-4 max-w-3xl">
              {[data.section2_p1, data.section2_p2, data.section2_p3].filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-14">
            {[data.section2_img1, data.section2_img2, data.section2_img3].filter(Boolean).map((src, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-[#dde4ef] aspect-[4/3]">
                <img src={src} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}