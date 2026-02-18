const POSTHOG_API_KEY = process.env.POSTHOG_API_KEY;
const POSTHOG_PROJECT_ID = process.env.POSTHOG_PROJECT_ID;
const POSTHOG_API_HOST = process.env.POSTHOG_API_HOST || "https://us.posthog.com";
const CACHE_TTL_MS = 30_000;
const STALE_TTL_MS = 5 * 60_000;
const POSTHOG_TIMEOUT_MS = 10_000;

const analyticsCache =
  globalThis.__analyticsCachePosthog ||
  (globalThis.__analyticsCachePosthog = new Map());

function pruneExpiredCache(now) {
  for (const [key, value] of analyticsCache.entries()) {
    if (!value?.expiresAt || value.expiresAt <= now) {
      analyticsCache.delete(key);
    }
  }
}

function escapeLiteral(value) {
  if (value === undefined || value === null) return "";
  return String(value).replace(/'/g, "''");
}

async function runQuery(query, name) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), POSTHOG_TIMEOUT_MS);

  try {
    const res = await fetch(
      `${POSTHOG_API_HOST}/api/projects/${POSTHOG_PROJECT_ID}/query/`,
      {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${POSTHOG_API_KEY}`,
        },
        body: JSON.stringify({
          query: {
            kind: "HogQLQuery",
            query,
          },
          name,
        }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error(`[${name}] PostHog query failed: ${res.status} ${text}`);
      return [];
    }

    const data = await res.json();
    return Array.isArray(data?.results) ? data.results : [];
  } catch (error) {
    if (error?.name === "AbortError") {
      console.error(`[${name}] PostHog query timed out after ${POSTHOG_TIMEOUT_MS}ms`);
    } else {
      console.error(`[${name}] PostHog query error: ${error?.message || error}`);
    }
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
}

function buildPayload(results, rangeDays) {
  const summaryResult = results.bio_summary;
  const seriesResult = results.bio_series;
  const topLinksResult = results.bio_top_links;
  const referrersResult = results.bio_referrers;
  const devicesResult = results.bio_devices;
  const osResult = results.bio_os;
  const browsersResult = results.bio_browsers;
  const locationsResult = results.bio_locations;
  const dayHourResult = results.bio_day_hour;
  const avgTimeResult = results.bio_avg_time;

  const hourlyMap = new Map();
  for (const [, hour, count] of dayHourResult) {
    const hourNum = Number(hour || 0);
    const countNum = Number(count || 0);
    hourlyMap.set(hourNum, (hourlyMap.get(hourNum) || 0) + countNum);
  }

  const countriesMap = new Map();
  for (const [, country, , , count] of locationsResult) {
    const countNum = Number(count || 0);
    const countryLabel = country || "Unknown";
    countriesMap.set(countryLabel, (countriesMap.get(countryLabel) || 0) + countNum);
  }

  const countries = [...countriesMap.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  const topLinks = topLinksResult
    .map(([linkUrl, linkText, clicks]) => ({
      linkUrl,
      linkText: linkText || "",
      count: Number(clicks || 0),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const referrers = referrersResult
    .map(([label, count]) => ({
      label,
      count: Number(count || 0),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const osBreakdown = osResult
    .map(([label, count]) => ({
      label,
      count: Number(count || 0),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const browserBreakdown = browsersResult
    .map(([label, count]) => ({
      label,
      count: Number(count || 0),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const locations = locationsResult
    .map(([city, country, lat, lon, count]) => ({
      label: [city, country].filter(Boolean).join(", "),
      count: Number(count || 0),
      lat: Number(lat),
      lon: Number(lon),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  return {
    totals: {
      views: Number(summaryResult?.[0]?.[0] || 0),
      clicks: Number(summaryResult?.[0]?.[1] || 0),
    },
    rangeTotals: {
      views: Number(summaryResult?.[0]?.[2] || 0),
      clicks: Number(summaryResult?.[0]?.[3] || 0),
    },
    uniqueVisitors: Number(summaryResult?.[0]?.[4] || 0),
    series: seriesResult.map(([date, views, clicks]) => ({
      date,
      views: Number(views || 0),
      clicks: Number(clicks || 0),
    })),
    visitorsSeries: seriesResult.map(([date, , , visitors]) => ({
      date,
      visitors: Number(visitors || 0),
    })),
    topLinks,
    referrers,
    devices: devicesResult.map(([label, count]) => ({
      label,
      count: Number(count || 0),
    })),
    osBreakdown,
    browserBreakdown,
    locations,
    locationPoints: locations
      .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lon)),
    countries,
    hourly: [...hourlyMap.entries()]
      .map(([hour, count]) => ({
        hour: Number(hour || 0),
        count: Number(count || 0),
      }))
      .sort((a, b) => a.hour - b.hour),
    dayHour: dayHourResult.map(([day, hour, count]) => ({
      day: Number(day || 0),
      hour: Number(hour || 0),
      count: Number(count || 0),
    })),
    dayHourUnique: dayHourResult.map(([day, hour, , unique]) => ({
      day: Number(day || 0),
      hour: Number(hour || 0),
      count: Number(unique || 0),
    })),
    avgTimeSeconds:
      Number(avgTimeResult?.[0]?.[0] || 0) || Number(avgTimeResult?.[0]?.[1] || 0),
    rangeDays,
  };
}

function getCombinedAnalyticsQuery(profileId, since) {
  return `
SELECT section, v1, v2, v3, v4, v5
FROM (
  SELECT
    'summary' as section,
    toString(countIf(event='bio_page_view')) as v1,
    toString(countIf(event='bio_link_clicked')) as v2,
    toString(countIf(event='bio_page_view' AND timestamp >= ${since})) as v3,
    toString(countIf(event='bio_link_clicked' AND timestamp >= ${since})) as v4,
    toString(uniqExactIf(distinct_id, event='bio_page_view' AND timestamp >= ${since})) as v5
  FROM events
  WHERE event IN ('bio_page_view','bio_link_clicked') AND properties.profile_id='${profileId}'

  UNION ALL

  SELECT
    'series' as section,
    toString(toDate(timestamp)) as v1,
    toString(countIf(event='bio_page_view')) as v2,
    toString(countIf(event='bio_link_clicked')) as v3,
    toString(uniqExactIf(distinct_id, event='bio_page_view')) as v4,
    '' as v5
  FROM events
  WHERE event IN ('bio_page_view','bio_link_clicked') AND properties.profile_id='${profileId}' AND timestamp >= ${since}
  GROUP BY toDate(timestamp)

  UNION ALL

  SELECT
    'top_links' as section,
    toString(properties.link_url) as v1,
    toString(any(properties.link_text)) as v2,
    toString(count()) as v3,
    '' as v4,
    '' as v5
  FROM events
  WHERE event='bio_link_clicked' AND properties.profile_id='${profileId}' AND timestamp >= ${since} AND properties.link_url != ''
  GROUP BY properties.link_url
  ORDER BY count() DESC
  LIMIT 5

  UNION ALL

  SELECT
    'referrers' as section,
    toString(properties.$referrer) as v1,
    toString(count()) as v2,
    '' as v3,
    '' as v4,
    '' as v5
  FROM events
  WHERE event='bio_page_view' AND properties.profile_id='${profileId}' AND timestamp >= ${since} AND properties.$referrer != ''
  GROUP BY properties.$referrer
  ORDER BY count() DESC
  LIMIT 6

  UNION ALL

  SELECT
    'devices' as section,
    toString(properties.$device_type) as v1,
    toString(count()) as v2,
    '' as v3,
    '' as v4,
    '' as v5
  FROM events
  WHERE event='bio_page_view' AND properties.profile_id='${profileId}' AND timestamp >= ${since} AND properties.$device_type != ''
  GROUP BY properties.$device_type
  ORDER BY count() DESC

  UNION ALL

  SELECT
    'os' as section,
    toString(properties.$os) as v1,
    toString(count()) as v2,
    '' as v3,
    '' as v4,
    '' as v5
  FROM events
  WHERE event='bio_page_view' AND properties.profile_id='${profileId}' AND timestamp >= ${since} AND properties.$os != ''
  GROUP BY properties.$os
  ORDER BY count() DESC
  LIMIT 6

  UNION ALL

  SELECT
    'browsers' as section,
    toString(properties.$browser) as v1,
    toString(count()) as v2,
    '' as v3,
    '' as v4,
    '' as v5
  FROM events
  WHERE event='bio_page_view' AND properties.profile_id='${profileId}' AND timestamp >= ${since} AND properties.$browser != ''
  GROUP BY properties.$browser
  ORDER BY count() DESC
  LIMIT 6

  UNION ALL

  SELECT
    'locations' as section,
    toString(properties.$geoip_city_name) as v1,
    toString(properties.$geoip_country_name) as v2,
    toString(properties.$geoip_latitude) as v3,
    toString(properties.$geoip_longitude) as v4,
    toString(count()) as v5
  FROM events
  WHERE event='bio_page_view' AND properties.profile_id='${profileId}' AND timestamp >= ${since} AND properties.$geoip_country_name != ''
  GROUP BY properties.$geoip_city_name, properties.$geoip_country_name, properties.$geoip_latitude, properties.$geoip_longitude
  ORDER BY count() DESC
  LIMIT 12

  UNION ALL

  SELECT
    'day_hour' as section,
    toString(toDayOfWeek(timestamp)) as v1,
    toString(toHour(timestamp)) as v2,
    toString(count()) as v3,
    toString(uniqExact(distinct_id)) as v4,
    '' as v5
  FROM events
  WHERE event='bio_page_view' AND properties.profile_id='${profileId}' AND timestamp >= ${since}
  GROUP BY toDayOfWeek(timestamp), toHour(timestamp)

  UNION ALL

  SELECT
    'avg_time' as section,
    toString(avgIf(if(replaceRegexpAll(nullIf(nullIf(JSONExtractRaw(properties,'$duration'),''),'null'),'^"|"$','') != '', toFloatOrDefault(replaceRegexpAll(nullIf(nullIf(JSONExtractRaw(properties,'$duration'),''),'null'),'^"|"$',''),0.0), toFloatOrDefault(replaceRegexpAll(nullIf(nullIf(JSONExtractRaw(properties,'duration'),''),'null'),'^"|"$',''),0.0)), timestamp >= ${since})) as v1,
    toString(avg(if(replaceRegexpAll(nullIf(nullIf(JSONExtractRaw(properties,'$duration'),''),'null'),'^"|"$','') != '', toFloatOrDefault(replaceRegexpAll(nullIf(nullIf(JSONExtractRaw(properties,'$duration'),''),'null'),'^"|"$',''),0.0), toFloatOrDefault(replaceRegexpAll(nullIf(nullIf(JSONExtractRaw(properties,'duration'),''),'null'),'^"|"$',''),0.0)))) as v2,
    '' as v3,
    '' as v4,
    '' as v5
  FROM events
  WHERE event='bio_page_view_duration' AND properties.profile_id='${profileId}'
)
`;
}

function mapCombinedRows(results) {
  const mapped = {
    bio_summary: [],
    bio_series: [],
    bio_top_links: [],
    bio_referrers: [],
    bio_devices: [],
    bio_os: [],
    bio_browsers: [],
    bio_locations: [],
    bio_day_hour: [],
    bio_avg_time: [],
  };

  for (const row of results) {
    const [section, v1, v2, v3, v4, v5] = row;
    if (section === "summary") {
      mapped.bio_summary.push([v1, v2, v3, v4, v5]);
    } else if (section === "series") {
      mapped.bio_series.push([v1, v2, v3, v4]);
    } else if (section === "top_links") {
      mapped.bio_top_links.push([v1, v2, v3]);
    } else if (section === "referrers") {
      mapped.bio_referrers.push([v1, v2]);
    } else if (section === "devices") {
      mapped.bio_devices.push([v1, v2]);
    } else if (section === "os") {
      mapped.bio_os.push([v1, v2]);
    } else if (section === "browsers") {
      mapped.bio_browsers.push([v1, v2]);
    } else if (section === "locations") {
      mapped.bio_locations.push([v1, v2, v3, v4, v5]);
    } else if (section === "day_hour") {
      mapped.bio_day_hour.push([v1, v2, v3, v4]);
    } else if (section === "avg_time") {
      mapped.bio_avg_time.push([v1, v2]);
    }
  }

  return mapped;
}

async function fetchAnalyticsPayload(profileId, rangeDays, since) {
  const query = getCombinedAnalyticsQuery(profileId, since);
  const rows = await runQuery(query, "bio_combined");
  if (!rows.length) {
    console.error("[bio_combined] Empty result, falling back to segmented queries");
    const fallback = await fetchAnalyticsPayloadFallback(profileId, rangeDays, since);
    return fallback;
  }
  const mappedResults = mapCombinedRows(rows);
  return buildPayload(mappedResults, rangeDays);
}

function getFallbackQuerySpecs(profileId, since) {
  return [
    {
      name: "bio_summary",
      query: `SELECT countIf(event='bio_page_view') as total_views, countIf(event='bio_link_clicked') as total_clicks, countIf(event='bio_page_view' AND timestamp >= ${since}) as range_views, countIf(event='bio_link_clicked' AND timestamp >= ${since}) as range_clicks, uniqExactIf(distinct_id, event='bio_page_view' AND timestamp >= ${since}) as unique_visitors FROM events WHERE event IN ('bio_page_view','bio_link_clicked') AND properties.profile_id='${profileId}'`,
    },
    {
      name: "bio_series",
      query: `SELECT toDate(timestamp) as date, countIf(event='bio_page_view') as views, countIf(event='bio_link_clicked') as clicks, uniqExactIf(distinct_id, event='bio_page_view') as visitors FROM events WHERE event IN ('bio_page_view','bio_link_clicked') AND properties.profile_id='${profileId}' AND timestamp >= ${since} GROUP BY date ORDER BY date`,
    },
    {
      name: "bio_top_links",
      query: `SELECT properties.link_url, any(properties.link_text) as link_text, count() as clicks FROM events WHERE event='bio_link_clicked' AND properties.profile_id='${profileId}' AND timestamp >= ${since} AND properties.link_url != '' GROUP BY properties.link_url ORDER BY clicks DESC LIMIT 5`,
    },
    {
      name: "bio_referrers",
      query: `SELECT properties.$referrer, count() FROM events WHERE event='bio_page_view' AND properties.profile_id='${profileId}' AND timestamp >= ${since} AND properties.$referrer != '' GROUP BY properties.$referrer ORDER BY count() DESC LIMIT 6`,
    },
    {
      name: "bio_devices",
      query: `SELECT properties.$device_type, count() FROM events WHERE event='bio_page_view' AND properties.profile_id='${profileId}' AND timestamp >= ${since} AND properties.$device_type != '' GROUP BY properties.$device_type ORDER BY count() DESC`,
    },
    {
      name: "bio_os",
      query: `SELECT properties.$os, count() FROM events WHERE event='bio_page_view' AND properties.profile_id='${profileId}' AND timestamp >= ${since} AND properties.$os != '' GROUP BY properties.$os ORDER BY count() DESC LIMIT 6`,
    },
    {
      name: "bio_browsers",
      query: `SELECT properties.$browser, count() FROM events WHERE event='bio_page_view' AND properties.profile_id='${profileId}' AND timestamp >= ${since} AND properties.$browser != '' GROUP BY properties.$browser ORDER BY count() DESC LIMIT 6`,
    },
    {
      name: "bio_locations",
      query: `SELECT properties.$geoip_city_name, properties.$geoip_country_name, properties.$geoip_latitude, properties.$geoip_longitude, count() FROM events WHERE event='bio_page_view' AND properties.profile_id='${profileId}' AND timestamp >= ${since} AND properties.$geoip_country_name != '' GROUP BY properties.$geoip_city_name, properties.$geoip_country_name, properties.$geoip_latitude, properties.$geoip_longitude ORDER BY count() DESC LIMIT 12`,
    },
    {
      name: "bio_day_hour",
      query: `SELECT toDayOfWeek(timestamp) as day, toHour(timestamp) as hour, count() as views, uniqExact(distinct_id) as unique_visitors FROM events WHERE event='bio_page_view' AND properties.profile_id='${profileId}' AND timestamp >= ${since} GROUP BY day, hour ORDER BY day, hour`,
    },
    {
      name: "bio_avg_time",
      query: `SELECT avgIf(if(replaceRegexpAll(nullIf(nullIf(JSONExtractRaw(properties,'$duration'),''),'null'),'^\"|\"$','') != '', toFloatOrDefault(replaceRegexpAll(nullIf(nullIf(JSONExtractRaw(properties,'$duration'),''),'null'),'^\"|\"$',''),0.0), toFloatOrDefault(replaceRegexpAll(nullIf(nullIf(JSONExtractRaw(properties,'duration'),''),'null'),'^\"|\"$',''),0.0)), timestamp >= ${since}) as range_avg, avg(if(replaceRegexpAll(nullIf(nullIf(JSONExtractRaw(properties,'$duration'),''),'null'),'^\"|\"$','') != '', toFloatOrDefault(replaceRegexpAll(nullIf(nullIf(JSONExtractRaw(properties,'$duration'),''),'null'),'^\"|\"$',''),0.0), toFloatOrDefault(replaceRegexpAll(nullIf(nullIf(JSONExtractRaw(properties,'duration'),''),'null'),'^\"|\"$',''),0.0))) as all_avg FROM events WHERE event='bio_page_view_duration' AND properties.profile_id='${profileId}'`,
    },
  ];
}

async function fetchAnalyticsPayloadFallback(profileId, rangeDays, since) {
  const querySpecs = getFallbackQuerySpecs(profileId, since);
  const settled = await Promise.allSettled(
    querySpecs.map((spec) => runQuery(spec.query, spec.name))
  );
  const mappedResults = {};
  for (let i = 0; i < querySpecs.length; i += 1) {
    mappedResults[querySpecs[i].name] =
      settled[i]?.status === "fulfilled" ? settled[i].value : [];
  }
  return buildPayload(mappedResults, rangeDays);
}

export async function GET(request) {
  let cacheKey = null;
  try {
    if (!POSTHOG_API_KEY || !POSTHOG_PROJECT_ID) {
      return Response.json(
        { error: "Missing PostHog API configuration." },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const profileIdRaw = searchParams.get("profileId") || "";
    const rangeRaw = parseInt(searchParams.get("range") || "7", 10);
    const rangeDays = Number.isFinite(rangeRaw)
      ? Math.min(Math.max(rangeRaw, 1), 90)
      : 7;

    if (!profileIdRaw) {
      return Response.json({ error: "Missing profileId" }, { status: 400 });
    }

    const profileId = escapeLiteral(profileIdRaw);
    const since = `now() - INTERVAL ${rangeDays} DAY`;
    cacheKey = `${profileId}:${rangeDays}`;
    const now = Date.now();
    if (analyticsCache.size > 200) {
      pruneExpiredCache(now);
    }
    const cacheEntry = analyticsCache.get(cacheKey);

    if (cacheEntry?.data && cacheEntry.expiresAt > now) {
      return Response.json(cacheEntry.data);
    }

    if (cacheEntry?.data && cacheEntry.staleUntil > now) {
      if (!cacheEntry.promise) {
        const refreshPromise = fetchAnalyticsPayload(profileId, rangeDays, since).then(
          (payload) => {
            analyticsCache.set(cacheKey, {
              data: payload,
              expiresAt: Date.now() + CACHE_TTL_MS,
              staleUntil: Date.now() + STALE_TTL_MS,
            });
            return payload;
          },
          (err) => {
            console.error(err?.message || err);
            analyticsCache.set(cacheKey, {
              data: cacheEntry.data,
              expiresAt: Date.now() + CACHE_TTL_MS,
              staleUntil: Date.now() + STALE_TTL_MS,
            });
            return cacheEntry.data;
          }
        );

        analyticsCache.set(cacheKey, {
          ...cacheEntry,
          promise: refreshPromise,
        });
      }
      return Response.json(cacheEntry.data);
    }

    if (cacheEntry?.promise) {
      const payload = await cacheEntry.promise;
      return Response.json(payload);
    }

    const inFlightPromise = fetchAnalyticsPayload(profileId, rangeDays, since);

    analyticsCache.set(cacheKey, {
      promise: inFlightPromise,
      expiresAt: now + CACHE_TTL_MS,
      staleUntil: now + STALE_TTL_MS,
    });

    const payload = await inFlightPromise;
    analyticsCache.set(cacheKey, {
      data: payload,
      expiresAt: Date.now() + CACHE_TTL_MS,
      staleUntil: Date.now() + STALE_TTL_MS,
    });

    return Response.json(payload);
  } catch (error) {
    if (cacheKey) {
      analyticsCache.delete(cacheKey);
    }
    return Response.json({ error: error.message }, { status: 500 });
  }
}
