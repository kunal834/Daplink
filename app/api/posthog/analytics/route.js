const POSTHOG_API_KEY = process.env.POSTHOG_API_KEY;
const POSTHOG_PROJECT_ID = process.env.POSTHOG_PROJECT_ID;
const POSTHOG_API_HOST = process.env.POSTHOG_API_HOST || "https://us.posthog.com";

function escapeLiteral(value) {
  if (value === undefined || value === null) return "";
  return String(value).replace(/'/g, "''");
}

async function runQuery(query, name) {
  const res = await fetch(
    `${POSTHOG_API_HOST}/api/projects/${POSTHOG_PROJECT_ID}/query/`,
    {
      method: "POST",
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
}

export async function GET(request) {
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

    const querySpecs = [
      {
        name: "bio_total_views",
        query: `SELECT count() FROM events WHERE event='bio_page_view' AND properties.profile_id='${profileId}'`,
      },
      {
        name: "bio_total_clicks",
        query: `SELECT count() FROM events WHERE event='bio_link_clicked' AND properties.profile_id='${profileId}'`,
      },
      {
        name: "bio_range_totals",
        query: `SELECT event, count() FROM events WHERE event IN ('bio_page_view','bio_link_clicked') AND properties.profile_id='${profileId}' AND timestamp >= ${since} GROUP BY event`,
      },
      {
        name: "bio_unique_visitors",
        query: `SELECT count(DISTINCT distinct_id) FROM events WHERE event='bio_page_view' AND properties.profile_id='${profileId}' AND timestamp >= ${since}`,
      },
      {
        name: "bio_series",
        query: `SELECT toDate(timestamp) as date, countIf(event='bio_page_view') as views, countIf(event='bio_link_clicked') as clicks FROM events WHERE event IN ('bio_page_view','bio_link_clicked') AND properties.profile_id='${profileId}' AND timestamp >= ${since} GROUP BY date ORDER BY date`,
      },
      {
        name: "bio_visitors_series",
        query: `SELECT toDate(timestamp) as date, count(DISTINCT distinct_id) as visitors FROM events WHERE event='bio_page_view' AND properties.profile_id='${profileId}' AND timestamp >= ${since} GROUP BY date ORDER BY date`,
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
        name: "bio_countries",
        query: `SELECT properties.$geoip_country_name, count() FROM events WHERE event='bio_page_view' AND properties.profile_id='${profileId}' AND timestamp >= ${since} AND properties.$geoip_country_name != '' GROUP BY properties.$geoip_country_name ORDER BY count() DESC LIMIT 12`,
      },
      {
        name: "bio_hourly",
        query: `SELECT toHour(timestamp) as hour, count() FROM events WHERE event='bio_page_view' AND properties.profile_id='${profileId}' AND timestamp >= ${since} GROUP BY hour ORDER BY hour`,
      },
      {
        name: "bio_day_hour",
        query: `SELECT toDayOfWeek(timestamp) as day, toHour(timestamp) as hour, count() FROM events WHERE event='bio_page_view' AND properties.profile_id='${profileId}' AND timestamp >= ${since} GROUP BY day, hour ORDER BY day, hour`,
      },
      {
        name: "bio_day_hour_unique",
        query: `SELECT toDayOfWeek(timestamp) as day, toHour(timestamp) as hour, count(DISTINCT distinct_id) FROM events WHERE event='bio_page_view' AND properties.profile_id='${profileId}' AND timestamp >= ${since} GROUP BY day, hour ORDER BY day, hour`,
      },
      {
        name: "bio_avg_time",
        query: `SELECT avg(if(replaceRegexpAll(nullIf(nullIf(JSONExtractRaw(properties,'$duration'),''),'null'),'^\"|\"$','') != '', toFloatOrDefault(replaceRegexpAll(nullIf(nullIf(JSONExtractRaw(properties,'$duration'),''),'null'),'^\"|\"$',''),0.0), toFloatOrDefault(replaceRegexpAll(nullIf(nullIf(JSONExtractRaw(properties,'duration'),''),'null'),'^\"|\"$',''),0.0))) FROM events WHERE event='bio_page_view_duration' AND properties.profile_id='${profileId}' AND timestamp >= ${since}`
      },
      {
        name: "bio_avg_time_all",
        query: `SELECT avg(if(replaceRegexpAll(nullIf(nullIf(JSONExtractRaw(properties,'$duration'),''),'null'),'^\"|\"$','') != '', toFloatOrDefault(replaceRegexpAll(nullIf(nullIf(JSONExtractRaw(properties,'$duration'),''),'null'),'^\"|\"$',''),0.0), toFloatOrDefault(replaceRegexpAll(nullIf(nullIf(JSONExtractRaw(properties,'duration'),''),'null'),'^\"|\"$',''),0.0))) FROM events WHERE event='bio_page_view_duration' AND properties.profile_id='${profileId}'`
      }
    ];

    const results = await Promise.allSettled(
      querySpecs.map((spec) => runQuery(spec.query, spec.name))
    );
    const getResult = (name) => {
      const idx = querySpecs.findIndex((spec) => spec.name === name);
      const entry = results[idx];
      if (entry?.status === "fulfilled") return entry.value;
      if (entry?.status === "rejected") {
        console.error(entry.reason?.message || entry.reason);
      }
      return [];
    };

    const totalViewsResult = getResult("bio_total_views");
    const totalClicksResult = getResult("bio_total_clicks");
    const rangeTotalsResult = getResult("bio_range_totals");
    const uniqueVisitorsResult = getResult("bio_unique_visitors");
    const seriesResult = getResult("bio_series");
    const visitorsSeriesResult = getResult("bio_visitors_series");
    const topLinksResult = getResult("bio_top_links");
    const referrersResult = getResult("bio_referrers");
    const devicesResult = getResult("bio_devices");
    const osResult = getResult("bio_os");
    const browsersResult = getResult("bio_browsers");
    const locationsResult = getResult("bio_locations");
    const countriesResult = getResult("bio_countries");
    const hourlyResult = getResult("bio_hourly");
    const dayHourResult = getResult("bio_day_hour");
    const dayHourUniqueResult = getResult("bio_day_hour_unique");
    const avgTimeResult = getResult("bio_avg_time");
    const avgTimeAllResult = getResult("bio_avg_time_all");

    const safeRangeTotals = Array.isArray(rangeTotalsResult)
      ? rangeTotalsResult
      : [];
    const rangeTotalsMap = Object.fromEntries(
      safeRangeTotals.map(([event, count]) => [event, Number(count || 0)])
    );

    return Response.json({
      totals: {
        views: Number(totalViewsResult?.[0]?.[0] || 0),
        clicks: Number(totalClicksResult?.[0]?.[0] || 0),
      },
      rangeTotals: {
        views: Number(rangeTotalsMap.bio_page_view || 0),
        clicks: Number(rangeTotalsMap.bio_link_clicked || 0),
      },
      uniqueVisitors: Number(uniqueVisitorsResult?.[0]?.[0] || 0),
      series: seriesResult.map(([date, views, clicks]) => ({
        date,
        views: Number(views || 0),
        clicks: Number(clicks || 0),
      })),
      visitorsSeries: visitorsSeriesResult.map(([date, visitors]) => ({
        date,
        visitors: Number(visitors || 0),
      })),
      topLinks: topLinksResult.map(([linkUrl, linkText, clicks]) => ({
        linkUrl,
        linkText: linkText || "",
        count: Number(clicks || 0),
      })),
      referrers: referrersResult.map(([label, count]) => ({
        label,
        count: Number(count || 0),
      })),
      devices: devicesResult.map(([label, count]) => ({
        label,
        count: Number(count || 0),
      })),
      osBreakdown: osResult.map(([label, count]) => ({
        label,
        count: Number(count || 0),
      })),
      browserBreakdown: browsersResult.map(([label, count]) => ({
        label,
        count: Number(count || 0),
      })),
      locations: locationsResult.map(([city, country, lat, lon, count]) => ({
        label: [city, country].filter(Boolean).join(", "),
        count: Number(count || 0),
        lat: Number(lat),
        lon: Number(lon),
      })),
      locationPoints: locationsResult
        .map(([city, country, lat, lon, count]) => ({
          label: [city, country].filter(Boolean).join(", "),
          count: Number(count || 0),
          lat: Number(lat),
          lon: Number(lon),
        }))
        .filter(
          (point) => Number.isFinite(point.lat) && Number.isFinite(point.lon)
        ),
      countries: countriesResult.map(([country, count]) => ({
        label: country || "Unknown",
        count: Number(count || 0),
      })),
      hourly: hourlyResult.map(([hour, count]) => ({
        hour: Number(hour || 0),
        count: Number(count || 0),
      })),
      dayHour: dayHourResult.map(([day, hour, count]) => ({
        day: Number(day || 0),
        hour: Number(hour || 0),
        count: Number(count || 0),
      })),
      dayHourUnique: dayHourUniqueResult.map(([day, hour, count]) => ({
        day: Number(day || 0),
        hour: Number(hour || 0),
        count: Number(count || 0),
      })),
      avgTimeSeconds: Number(avgTimeResult?.[0]?.[0] || 0) || Number(avgTimeAllResult?.[0]?.[0] || 0),
      rangeDays,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
