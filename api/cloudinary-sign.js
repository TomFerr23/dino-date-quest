// CommonJS – works in `vercel dev` and on Vercel
const crypto = require('crypto'); // ← no "node:" prefix

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'method_not_allowed' });
    }

    // In Vercel Node functions, JSON body is parsed when content-type is application/json
    const body = req.body || {};
    const password = (body.password || '').trim();
    const folder = (body.folder || 'gallery').trim() || 'gallery';

    const {
      CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET,
      UPLOAD_PASSWORD,
    } = process.env;

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      return res.status(500).json({ error: 'missing_cloudinary_env' });
    }
    if (!UPLOAD_PASSWORD) {
      return res.status(500).json({ error: 'missing_upload_password_env' });
    }
    if (!password) return res.status(400).json({ error: 'missing_password' });
    if (password !== UPLOAD_PASSWORD) return res.status(401).json({ error: 'wrong_password' });

    const timestamp = Math.floor(Date.now() / 1000);

    // Cloudinary requires alpha-ordered params, joined with &.
    const toSign = `folder=${folder}&timestamp=${timestamp}`;
    const signature = crypto.createHash('sha1')
      .update(toSign + CLOUDINARY_API_SECRET)
      .digest('hex');

    return res.status(200).json({
      cloudName: CLOUDINARY_CLOUD_NAME,
      apiKey: CLOUDINARY_API_KEY,
      folder,
      timestamp,
      signature,
    });
  } catch (err) {
    console.error('cloudinary-sign error:', err);
    return res.status(500).json({ error: 'exception', message: String(err && err.message || err) });
  }
};
