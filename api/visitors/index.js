const url = require('url');
const {
  VisitorModel,
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
    const { country, deviceType, source, search, limit = 50, offset = 0 } = parsed.query || {};
    const l = Math.min(Number(limit) || 50, 100);
    const o = Number(offset) || 0;

    try {
      const isConnected = await connectMongo();
      if (isConnected && VisitorModel) {
        const filter = {};
        if (country && country !== 'all') filter.country = country;
        if (deviceType && deviceType !== 'all') filter.deviceType = deviceType;
        if (source && source !== 'all') filter.source = source;
        if (search) {
          const regex = new RegExp(String(search), 'i');
          filter.$or = [{ ipAddress: regex }, { city: regex }, { country: regex }, { browser: regex }, { os: regex }];
        }
        const [total, docs] = await Promise.all([
          VisitorModel.countDocuments(filter),
          VisitorModel.find(filter).sort({ lastVisitedAt: -1 }).skip(o).limit(l).lean()
        ]);
        return sendJson(res, 200, { items: docs.map((d) => ({ ...d, _id: String(d._id) })), total });
      }
    } catch (dbErr) {
      console.warn('[Visitors List DB warning]:', dbErr.message);
    }

    let items = [...memoryStore.visitors];
    if (country && country !== 'all') items = items.filter((v) => v.country === country);
    if (deviceType && deviceType !== 'all') items = items.filter((v) => v.deviceType === deviceType);
    if (source && source !== 'all') items = items.filter((v) => v.source === source);
    if (search) {
      const q = String(search).toLowerCase();
      items = items.filter(
        (v) =>
          v.ipAddress.toLowerCase().includes(q) ||
          v.city.toLowerCase().includes(q) ||
          v.country.toLowerCase().includes(q) ||
          v.browser.toLowerCase().includes(q) ||
          v.os.toLowerCase().includes(q)
      );
    }
    return sendJson(res, 200, { items: items.slice(o, o + l), total: items.length });
  } catch (err) {
    console.error('[Visitors List Error]:', err);
    return sendJson(res, 500, { error: 'Internal Error', message: err?.message });
  }
};
