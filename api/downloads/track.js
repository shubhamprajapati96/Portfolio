const {
  DownloadModel,
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
    const { platform = 'Android', version = '1.0.0', source = 'web_button', referrer = 'Direct' } = body || {};

    const rec = {
      ipAddress: client.ipAddress,
      country: client.country,
      city: client.city,
      region: client.region,
      userAgent: client.userAgent,
      deviceType: client.deviceType,
      platform,
      version,
      source,
      referrer,
      timestamp: new Date().toISOString()
    };

    try {
      const isConnected = await connectMongo();
      if (isConnected && DownloadModel) {
        const doc = await DownloadModel.create(rec);
        return sendJson(res, 200, { success: true, downloadId: String(doc._id) });
      }
    } catch (dbErr) {
      console.warn('[Download Track DB warning]:', dbErr.message);
    }

    const memRec = {
      _id: 'dl_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      ...rec
    };
    memoryStore.downloads.unshift(memRec);
    return sendJson(res, 200, { success: true, downloadId: memRec._id });
  } catch (err) {
    console.error('[Download Track Error]:', err);
    return sendJson(res, 500, { error: 'Internal Error', message: err?.message });
  }
};
