import assert from "assert";
import { normalizeUrl, normalizeBodyImages } from "./server/utils/imageUrl.js";

// Mock request object
const mockReq = {
  protocol: "http",
  get(headerName) {
    if (headerName === "host") return "localhost:5000";
    return undefined;
  },
  headers: {
    "x-forwarded-proto": "https"
  }
};

const mockReqNoForward = {
  protocol: "http",
  get(headerName) {
    if (headerName === "host") return "api.mavzer.com";
    return undefined;
  },
  headers: {}
};

function runTests() {
  console.log("Running imageUrl utility tests...");

  // 1. Test normalizeUrl
  assert.strictEqual(
    normalizeUrl("http://olddomain.com/uploads/banner1.jpg", mockReq),
    "https://localhost:5000/uploads/banner1.jpg"
  );

  assert.strictEqual(
    normalizeUrl("http://olddomain.com/uploads/banner1.jpg", mockReqNoForward),
    "http://api.mavzer.com/uploads/banner1.jpg"
  );

  assert.strictEqual(
    normalizeUrl("/uploads/banner1.jpg", mockReq),
    "https://localhost:5000/uploads/banner1.jpg"
  );

  assert.strictEqual(
    normalizeUrl("https://otherdomain.com/static/image.jpg", mockReq),
    "https://otherdomain.com/static/image.jpg"
  );

  // 2. Test normalizeBodyImages on different shapes
  const testObj = {
    id: "1",
    name: "Product 1",
    image: "http://olddomain.com/uploads/image1.jpg, http://olddomain.com/uploads/image2.jpg",
    images: [
      "http://olddomain.com/uploads/image1.jpg",
      "http://olddomain.com/uploads/image2.jpg"
    ],
    metadata: {
      nestedImage: "http://olddomain.com/uploads/image3.jpg",
      date: new Date("2026-09-04T00:00:00.000Z"),
      count: 42
    }
  };

  const expectedObj = {
    id: "1",
    name: "Product 1",
    image: "https://localhost:5000/uploads/image1.jpg,https://localhost:5000/uploads/image2.jpg",
    images: [
      "https://localhost:5000/uploads/image1.jpg",
      "https://localhost:5000/uploads/image2.jpg"
    ],
    metadata: {
      nestedImage: "https://localhost:5000/uploads/image3.jpg",
      date: new Date("2026-09-04T00:00:00.000Z"),
      count: 42
    }
  };

  const normalized = normalizeBodyImages(testObj, mockReq);
  assert.deepStrictEqual(normalized, expectedObj);

  // 3. Test SERVER_URL env override
  process.env.SERVER_URL = "https://cdn.mavzerambalaj.com.tr";
  assert.strictEqual(
    normalizeUrl("http://olddomain.com/uploads/banner1.jpg", mockReq),
    "https://cdn.mavzerambalaj.com.tr/uploads/banner1.jpg"
  );
  delete process.env.SERVER_URL;

  console.log("All imageUrl tests passed successfully! ✅");
}

runTests();
