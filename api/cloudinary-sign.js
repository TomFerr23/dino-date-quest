import { createHash } from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { folder = "gallery", timestamp, pass } = req.body || {};
  const ts = timestamp || Math.floor(Date.now() / 1000);

  if (!pass || pass !== process.env.UPLOAD_PASSWORD) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    res.status(500).json({ error: "Missing Cloudinary env vars" });
    return;
  }

  // Cloudinary signature: sha1 of sorted params + api_secret
  const stringToSign = `folder=${folder}&timestamp=${ts}`;
  const signature = createHash("sha1").update(stringToSign + apiSecret).digest("hex");

  res.status(200).json({ cloudName, apiKey, timestamp: ts, folder, signature });
}
