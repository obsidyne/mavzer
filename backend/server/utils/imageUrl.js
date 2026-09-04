/**
 * Normalizes an image URL to use the current host/SERVER_URL.
 * If the URL belongs to /uploads/, we rewrite the domain portion.
 */
export function normalizeUrl(url, req) {
  if (typeof url !== "string") return url;
  
  const uploadsIndex = url.indexOf("/uploads/");
  if (uploadsIndex === -1) {
    return url;
  }

  const relativePath = url.slice(uploadsIndex); // e.g., "/uploads/filename.jpg"
  
  // Determine base URL (priority: SERVER_URL, then request protocol & host)
  const baseUrl = process.env.SERVER_URL || `${req.headers["x-forwarded-proto"] || req.protocol}://${req.get("host")}`;
  
  return `${baseUrl.replace(/\/$/, "")}${relativePath}`;
}

/**
 * Recursively traverses a JSON object and normalizes any string value containing "/uploads/".
 */
export function normalizeBodyImages(obj, req) {
  if (!obj || !req) return obj;

  if (typeof obj === "string") {
    if (obj.includes("/uploads/")) {
      if (obj.includes(",")) {
        return obj
          .split(",")
          .map((item) => normalizeUrl(item.trim(), req))
          .join(",");
      }
      return normalizeUrl(obj, req);
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => normalizeBodyImages(item, req));
  }

  if (typeof obj === "object") {
    if (obj instanceof Date) return obj;
    
    const newObj = {};
    for (const key of Object.keys(obj)) {
      newObj[key] = normalizeBodyImages(obj[key], req);
    }
    return newObj;
  }

  return obj;
}
