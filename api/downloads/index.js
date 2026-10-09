const url = require('url');
const {
  DownloadModel,
  memoryStore,
  connectMongo,
  verifyAuth,
  setCors,
  sendJson
} = require('../_lib/db');

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  const user = verifyAuth(req);
  if (!user) {
    return sendJson(res, 401, { error: 'Unauthorized', message: 'Valid token required' });
  }

  try {
    const parsed = url.parse(req.url, true);
    const { country, platform, source, search, limit = 50, offset = 0 } = parsed.query || {};
    const l = Math.min(Number(limit) || 50, 100);
    const o = Number(offset) || 0;

    try {
      const isConnected = await connectMongo();
      if (isConnected && DownloadModel) {
        const filter = {};
        if (country && country !== 'all') filter.country = country;
        if (platform && platform !== 'all') filter.platform = platform;
        if (source && source !== 'all') filter.source = source;
        if (search) {
          const regex = new RegExp(String(search), 'i');
          filter.$or = [{ ipAddress: regex }, { city: regex }, { country: regex }, { version: regex }];
        }
        const [total, docs] = await Promise.all([
          DownloadModel.countDocuments(filter),
          DownloadModel.find(filter).sort({ timestamp: -1 }).skip(o).limit(l).lean()
        ]);
        return sendJson(res, 200, { items: docs.map((d) => ({ ...d, _id: String(d._id) })), total });
      }
    } catch (dbErr) {
      console.warn('[Downloads List DB warning]:', dbErr.message);
    }

    let items = [...memoryStore.downloads];
    if (country && country !== 'all') items = items.filter((d) => d.country === country);
    if (platform && platform !== 'all') items = items.filter((d) => d.platform === platform);
    if (source && source !== 'all') items = items.filter((d) => d.source === source);
    if (search) {
      const q = String(search).toLowerCase();
      items = items.filter(
        (d) =>
          d.ipAddress.toLowerCase().includes(q) ||
          d.city.toLowerCase().includes(q) ||
          d.country.toLowerCase().includes(q) ||
          d.version.toLowerCase().includes(q)
      );
    }
    return sendJson(res, 200, { items: items.slice(o, o + l), total: items.length });
  } catch (err) {
    console.error('[Downloads List Error]:', err);
    return sendJson(res, 500, { error: 'Internal Error', message: err?.message });
  }
};
