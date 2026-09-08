export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin"] },
    ],
    sitemap: "https://www.mavzerambalaj.com.tr/sitemap.xml",
  };
}
