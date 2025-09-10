// api/cloudinary-list.js
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: 'method_not_allowed' })
  }

  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return res.status(500).json({ error: 'missing_env' })
  }

  const folder = (req.query.folder || 'gallery').toString()
  const max    = Math.min(Number(req.query.max || 100), 500)

  try {
    // Cloudinary Search API — list all resources in folder
    const url  = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/resources/search`
    const auth = Buffer.from(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`).toString('base64')

    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        expression: `folder:${folder}`,
        max_results: max,
        sort_by: [{ created_at: 'desc' }],
      }),
    })

    const j = await r.json()
    if (!r.ok) return res.status(r.status).json({ error: j?.error?.message || 'list_failed' })

    const urls = (j.resources || []).map(x => x.secure_url).filter(Boolean)
    return res.status(200).json({ urls })
  } catch (e) {
    console.error('cloudinary-list error', e)
    return res.status(500).json({ error: 'list_exception' })
  }
}
