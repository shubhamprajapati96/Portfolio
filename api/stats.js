const {
  VisitorModel,
  DownloadModel,
  EnquiryModel,
  memoryStore,
  connectMongo,
  verifyAuth,
  setCors,
  sendJson
} = require('./_lib/db');

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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let isConnected = false;
    try {
      isConnected = await connectMongo();
    } catch (e) {}

    let visitors = memoryStore.visitors;
    let downloads = memoryStore.downloads;
    let enquiries = memoryStore.enquiries;

    if (isConnected && VisitorModel && DownloadModel && EnquiryModel) {
      try {
        const [vDocs, dDocs, eDocs] = await Promise.all([
          VisitorModel.find({}).sort({ lastVisitedAt: -1 }).limit(100).lean(),
          DownloadModel.find({}).sort({ timestamp: -1 }).limit(100).lean(),
          EnquiryModel.find({}).sort({ createdAt: -1 }).limit(100).lean()
        ]);
        visitors = vDocs;
        downloads = dDocs;
        enquiries = eDocs;
      } catch (dbErr) {
        console.warn('[Stats DB warning]:', dbErr.message);
      }
    }

    const totalVisitors = visitors.length;
    const totalVisits = visitors.reduce((acc, v) => acc + (v.visitCount || 1), 0);
    const todayVisitors = visitors.filter((v) => new Date(v.lastVisitedAt || v.createdAt || 0) >= today).length;

    const totalEnquiries = enquiries.length;
    const newEnquiries = enquiries.filter((e) => e.status === 'new').length;
    const todayEnquiries = enquiries.filter((e) => new Date(e.createdAt || 0) >= today).length;

    const totalDownloads = downloads.length;
    const todayDownloads = downloads.filter((d) => new Date(d.timestamp || d.createdAt || 0) >= today).length;

    const webVisitors = visitors.filter((v) => (v.source || 'web') === 'web').length;
    const apkVisitors = visitors.filter((v) => v.source === 'apk').length;

    const desktopCount = visitors.filter((v) => (v.deviceType || 'desktop') === 'desktop').length;
    const mobileCount = visitors.filter((v) => v.deviceType === 'mobile').length;
    const tabletCount = visitors.filter((v) => v.deviceType === 'tablet').length;

    // Top Countries
    const countryMap = {};
    for (const v of visitors) {
      const c = v.country || 'Unknown';
      countryMap[c] = (countryMap[c] || 0) + 1;
    }
    const topCountries = Object.entries(countryMap)
      .map(([country, count]) => ({
        country,
        count,
        percentage: totalVisitors > 0 ? Math.round((count / totalVisitors) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Recent activity stream
    const recentActivity = [
      ...enquiries.slice(0, 4).map((e) => ({
        type: 'enquiry',
        title: `Enquiry from ${e.name}`,
        subtitle: e.subject || e.email,
        meta: e.status ? e.status.toUpperCase() : 'NEW',
        timestamp: e.createdAt
      })),
      ...downloads.slice(0, 4).map((d) => ({
        type: 'download',
        title: `APK Downloaded (v${d.version || '1.0.0'})`,
        subtitle: `${d.city || 'City'}, ${d.country || 'Country'}`,
        meta: (d.platform || 'Android').toUpperCase(),
        timestamp: d.timestamp
      })),
      ...visitors.slice(0, 4).map((v) => ({
        type: 'visitor',
        title: `Visitor from ${v.city || 'City'}, ${v.country || 'Country'}`,
        subtitle: `${v.browser || 'Browser'} on ${v.os || 'OS'}`,
        meta: `${v.pageUrl || '/'} · ${(v.source || 'web').toUpperCase()}`,
        timestamp: v.lastVisitedAt || v.firstVisitedAt
      }))
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 8);

    return sendJson(res, 200, {
      databaseStatus: isConnected ? 'Connected (MongoDB Atlas)' : 'Resilient Mode (In-Memory)',
      kpis: {
        totalVisitors,
        totalVisits,
        todayVisitors,
        totalEnquiries,
        newEnquiries,
        todayEnquiries,
        totalDownloads,
        todayDownloads
      },
      sourceBreakdown: { web: webVisitors, apk: apkVisitors },
      deviceBreakdown: { desktop: desktopCount, mobile: mobileCount, tablet: tabletCount },
      topCountries,
      recentActivity
    });
  } catch (err) {
    console.error('[Stats Error]:', err);
    return sendJson(res, 500, { error: 'Internal Error', message: err?.message });
  }
};

