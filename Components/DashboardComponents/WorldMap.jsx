import React from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import worldJson from "@/public/geography/world.json";

const KASHMIR_BOUNDS = {
  minLon: 72,
  maxLon: 80,
  minLat: 31,
  maxLat: 38,
};

const flattenCoordinates = (coords) => {
  if (!Array.isArray(coords)) return [];
  if (coords.length >= 2 && typeof coords[0] === "number" && typeof coords[1] === "number") {
    return [coords];
  }
  return coords.flatMap((entry) => flattenCoordinates(entry));
};

const isUnnamedKashmirFeature = (feature) => {
  const name = String(feature?.properties?.name || "").trim();
  if (name) return false;

  const points = flattenCoordinates(feature?.geometry?.coordinates);
  if (!points.length) return false;

  return points.some(([lon, lat]) => (
    Number.isFinite(lon) &&
    Number.isFinite(lat) &&
    lon >= KASHMIR_BOUNDS.minLon &&
    lon <= KASHMIR_BOUNDS.maxLon &&
    lat >= KASHMIR_BOUNDS.minLat &&
    lat <= KASHMIR_BOUNDS.maxLat
  ));
};

const patchedWorldJson = {
  ...worldJson,
  features: (worldJson?.features || []).map((feature) => {
    if (isUnnamedKashmirFeature(feature)) {
      return {
        ...feature,
        properties: {
          ...(feature.properties || {}),
          name: "India",
        },
      };
    }
    return feature;
  }),
};

if (!echarts.getMap("world")) {
  echarts.registerMap("world", patchedWorldJson);
}

const NAME_LOWER_MAP = new Map();
const NAME_NORMALIZED_MAP = new Map();
const NAME_CORE_MAP = new Map();
const STOP_WORDS = new Set([
  "and",
  "the",
  "of",
  "republic",
  "democratic",
  "people",
  "peoples",
  "state",
  "islamic",
  "federation",
  "kingdom",
  "arab",
  "plurinational",
  "bolivarian",
]);

const normalizeKey = (value) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const coreKey = (value) => {
  const base = normalizeKey(value);
  if (!base) return "";
  return base
    .split(" ")
    .filter((token) => token && !STOP_WORDS.has(token))
    .join(" ");
};

const ALIASES = {
  usa: "United States",
  us: "United States",
  "united states": "United States",
  "united states of america": "United States",
  gb: "United Kingdom",
  uk: "United Kingdom",
  "u.k.": "United Kingdom",
  "great britain": "United Kingdom",
  "britain": "United Kingdom",
  uae: "United Arab Emirates",
  "south korea": "Korea",
  "north korea": "Dem. Rep. Korea",
  "iran": "Iran",
  "russia": "Russia",
  "vietnam": "Vietnam",
  "laos": "Lao PDR",
  "syria": "Syrian Arab Republic",
  "bolivia": "Bolivia",
  "tanzania": "Tanzania",
  "czech republic": "Czech Rep.",
  "north macedonia": "Macedonia",
  "moldova": "Moldova",
  "venezuela": "Venezuela",
  "ivory coast": "Cote d'Ivoire",
  "democratic republic of the congo": "Dem. Rep. Congo",
  "republic of the congo": "Congo",
};

const worldNames =
  patchedWorldJson?.features?.map((feature) => feature?.properties?.name).filter(Boolean) || [];

worldNames.forEach((name) => {
  const lower = String(name).toLowerCase();
  if (!NAME_LOWER_MAP.has(lower)) NAME_LOWER_MAP.set(lower, name);
  const normalized = normalizeKey(name);
  if (normalized && !NAME_NORMALIZED_MAP.has(normalized)) {
    NAME_NORMALIZED_MAP.set(normalized, name);
  }
  const core = coreKey(name);
  if (core && !NAME_CORE_MAP.has(core)) {
    NAME_CORE_MAP.set(core, name);
  }
});

const resolveCountryName = (label) => {
  const raw = String(label || "").trim();
  if (!raw) return null;
  const lower = raw.toLowerCase();

  if (NAME_LOWER_MAP.has(lower)) return NAME_LOWER_MAP.get(lower);

  const normalized = normalizeKey(raw);
  if (normalized && NAME_NORMALIZED_MAP.has(normalized)) {
    return NAME_NORMALIZED_MAP.get(normalized);
  }

  const core = coreKey(raw);
  if (core && NAME_CORE_MAP.has(core)) {
    return NAME_CORE_MAP.get(core);
  }

  const alias = ALIASES[lower];
  if (alias) {
    const aliasLower = alias.toLowerCase();
    if (NAME_LOWER_MAP.has(aliasLower)) return NAME_LOWER_MAP.get(aliasLower);
    const aliasNormalized = normalizeKey(alias);
    if (NAME_NORMALIZED_MAP.has(aliasNormalized)) {
      return NAME_NORMALIZED_MAP.get(aliasNormalized);
    }
    const aliasCore = coreKey(alias);
    if (NAME_CORE_MAP.has(aliasCore)) return NAME_CORE_MAP.get(aliasCore);
  }

  return null;
};

export default function WorldMap({
  highlightCountries = [],
  cityMarkers = [],
  mapMode = "countries",
  isDarkMode = false,
}) {
  const countryList = Array.isArray(highlightCountries)
    ? highlightCountries
    : Array.from(highlightCountries || []);

  const highlightColor = "#2f55ff";
  const baseArea = "#cfd1c9";
  const baseBorder = "#f3f4f0";

  const mappedCountries = countryList
    .map((item) => {
      if (!item) return null;
      if (typeof item === "string") {
        const name = resolveCountryName(item);
        return name ? { name, value: 1 } : null;
      }
      const label =
        item.label ||
        item.name ||
        item.country ||
        item.countryName ||
        item.location ||
        item.value ||
        "";
      const name = resolveCountryName(label);
      if (!name) return null;
      return {
        name,
        value: Number.isFinite(Number(item.count)) ? Number(item.count) : 0,
        rawCount: Number.isFinite(Number(item.count)) ? Number(item.count) : 0,
      };
    })
    .filter(Boolean);

  const coloredCountries = mappedCountries.map((item) => {
    return {
      ...item,
      itemStyle: {
        areaColor: highlightColor,
        color: highlightColor,
        borderColor: "#ffffff",
        borderWidth: 0.6,
      },
    };
  });

  const fallbackCountries =
    coloredCountries.length === 0
      ? countryList
          .map((item) => {
            if (!item) return null;
            if (typeof item === "string") {
              const name = String(item).trim();
              return name ? { name, value: 0, rawCount: 0 } : null;
            }
            const label =
              item.label ||
              item.name ||
              item.country ||
              item.countryName ||
              item.location ||
              item.value ||
              "";
            const name = String(label).trim();
            if (!name) return null;
            const count = Number.isFinite(Number(item.count)) ? Number(item.count) : 0;
            return {
              name,
              value: count,
              rawCount: count,
                itemStyle: {
                areaColor: highlightColor,
                color: highlightColor,
                borderColor: "#ffffff",
                borderWidth: 0.6,
              },
            };
          })
          .filter(Boolean)
      : coloredCountries;

  const baseGeo = {
    map: "world",
    roam: false,
    zoom: 1.25,
    tooltip: {
      show: true,
    },
    label: {
      show: false,
    },
    itemStyle: {
      areaColor: baseArea,
      borderColor: baseBorder,
      borderWidth: 0.6,
    },
    emphasis: {
      disabled: true,
      label: {
        show: false,
      },
      itemStyle: {
        areaColor: baseArea,
      },
    },
  };

  const option = {
    backgroundColor: "#f6f7f3",
    tooltip: {
      trigger: "item",
      formatter: (params) => {
        if (!params) return "";
        const name = params.name || "";
        const dataValue =
          params.data && (params.data.rawCount ?? params.data.value);
        if (Array.isArray(dataValue)) {
          const raw = dataValue[2];
          const safeValue = Number.isFinite(Number(raw)) ? Number(raw) : 0;
          return `${name}: ${safeValue}`;
        }
        if (dataValue === undefined || dataValue === null || dataValue === "") {
          return name;
        }
        const safeValue = Number.isFinite(Number(dataValue))
          ? Number(dataValue)
          : 0;
        return `${name}: ${safeValue}`;
      },
    },
    geo: mapMode === "cities" ? baseGeo : undefined,
    series: [
      // Highlight countries
      mapMode === "countries"
        ? {
            type: "map",
            map: "world",
            nameProperty: "name",
            zoom:1.25,
            roam: false,
            selectedMode: false,
            itemStyle: {
              areaColor: baseArea,
              borderColor: baseBorder,
              borderWidth: 0.6,
            },
            tooltip: {
              show: true,
            },
            label: {
              show: false,
            },
            emphasis: {
              disabled: true,
              label: {
                show: false,
              },
            },
            select: {
              label: {
                show: false,
              },
            },
            data: fallbackCountries,
          }
        : null,

      // City markers
      mapMode === "cities"
        ? {
            type: "scatter",
            coordinateSystem: "geo",
            symbolSize: 8,
            tooltip: {
              show: true,
            },
            itemStyle: {
              color: "#1d4ed8",
            },
            data: cityMarkers.map((p) => ({
              name: p.label,
              value: [p.lon, p.lat, Number.isFinite(Number(p.count)) ? Number(p.count) : 0],
            })),
          }
        : null,
    ].filter(Boolean),
  };

  return (
    <ReactECharts
      option={option}
      notMerge
      lazyUpdate
      style={{ height: "100%", width: "100%", borderRadius: "14px" }}
    />
  );
}
