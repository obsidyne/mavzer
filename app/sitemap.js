const SITE_URL = "https://www.mavzerambalaj.com.tr";

export default function sitemap() {
  const routes = ["", "/about", "/products", "/products2", "/clients", "/contact", "/catalogue"];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
