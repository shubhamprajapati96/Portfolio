const {
  VisitorModel,
  memoryStore,
  connectMongo,
  extractClientInfo,
  setCors,
  sendJson,
  getRequestBody
} = require('../_lib/db');

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method Not Allowed' });
  }

  try {
    const client = extractClientInfo(req);
    const body = await getRequestBody(req);
    const { pageUrl, referrer, source } = body || {};
    const src = source === 'apk' ? 'apk' : 'web';
    const now = new Date().toISOString();

    try {
      const isConnected = await connectMongo();
      if (isConnected && VisitorModel) {
        const existing = await VisitorModel.findOne({ ipAddress: client.ipAddress, source: src });
        if (existing) {
          existing.visitCount += 1;
          existing.lastVisitedAt = new Date();
          if (pageUrl) existing.pageUrl = pageUrl;
          await existing.save();
          return sendJson(res, 200, { success: true, visitorId: String(existing._id), visitCount: existing.visitCount });
        } else {
          const doc = await VisitorModel.create({
            ...client,
            pageUrl: pageUrl || '/',
            referrer: referrer || 'Direct',
            source: src,
            visitCount: 1
          });
          return sendJson(res, 200, { success: true, visitorId: String(doc._id), visitCount: 1 });
        }
      }
    } catch (dbErr) {
      console.warn('[Visitor Track DB warning]:', dbErr.message);
    }

    // In-Memory store
    const mem = memoryStore.visitors.find((v) => v.ipAddress === client.ipAddress && v.source === src);
    if (mem) {
      mem.visitCount += 1;
      mem.lastVisitedAt = now;
      if (pageUrl) mem.pageUrl = pageUrl;
      return sendJson(res, 200, { success: true, visitorId: mem._id, visitCount: mem.visitCount });
    }

    const newVis = {
      _id: 'vis_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      ...client,
      pageUrl: pageUrl || '/',
      referrer: referrer || 'Direct',
      source: src,
      visitCount: 1,
      firstVisitedAt: now,
      lastVisitedAt: now
    };
    memoryStore.visitors.unshift(newVis);
    return sendJson(res, 200, { success: true, visitorId: newVis._id, visitCount: 1 });
  } catch (err) {
    console.error('[Visitor Track Error]:', err);
    return sendJson(res, 500, { error: 'Internal Error', message: err?.message || 'Server error' });
  }
};
