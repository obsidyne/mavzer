import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "./components/WhatsappButton";
import { LanguageProvider } from "./context/LanguageContext";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const SITE_URL = "https://www.mavzerambalaj.com.tr";
const SITE_NAME = "Mavzer Ambalaj";
const TITLE = "Mavzer Ambalaj | 1994'ten Bu Yana Güvenilir Ambalaj Çözümleri";
const DESCRIPTION =
  "Mavzer Ambalaj; 1994'ten bu yana restoran, otel, kurum ve markalara özel ambalaj, matbaa ve reklam çözümleri sunan güvenilir tedarikçinizdir.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: `%s | ${SITE_NAME}` },
  description: DESCRIPTION,
  keywords: [
    "Mavzer Ambalaj",
    "ambalaj çözümleri",
    "kurumsal ambalaj",
    "matbaa",
    "reklam ürünleri",
    "paketleme",
    "restoran ambalajı",
    "otel ambalajı",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "/",
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/logo.png", width: 2035, height: 1080, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/logo.png"],
  },
  // favicon.ico / icon.png / apple-icon.png in app/ are picked up automatically
  // via Next.js file-based icon conventions — no need to declare them here too.
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <LanguageProvider>
          {children}
          <WhatsAppButton />
        </LanguageProvider>
      </body>
    </html>
  );
}