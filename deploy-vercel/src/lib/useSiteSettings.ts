"use client";

import { useEffect, useState } from "react";

/**
 * Fetches all site settings as a flat key/value map.
 * Components read individual keys via `get(key, fallback)`.
 *
 * Settings are cached in localStorage for 5 minutes to avoid
 * repeated calls on every page navigation.
 */
export function useSiteSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Try cache first
    try {
      const cached = localStorage.getItem("siteSettingsCache");
      if (cached) {
        const { data, ts } = JSON.parse(cached);
        if (Date.now() - ts < 5 * 60 * 1000) {
          setSettings(data);
          setLoaded(true);
          return;
        }
      }
    } catch {}

    fetch("/api/public/site-settings")
      .then((r) => r.json())
      .then((d) => {
        const map = d.settings || {};
        setSettings(map);
        setLoaded(true);
        try {
          localStorage.setItem("siteSettingsCache", JSON.stringify({ data: map, ts: Date.now() }));
        } catch {}
      })
      .catch(() => setLoaded(true));
  }, []);

  const get = (key: string, fallback = ""): string => settings[key] ?? fallback;

  return { settings, get, loaded };
}
