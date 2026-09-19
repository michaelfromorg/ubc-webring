export type Website = {
  name: string;
  year: string;
  website: string;
};

export function domain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function filterWebsites(sites: Website[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return sites;

  return sites.filter((site) =>
    [site.name, site.website, site.year].some((value) =>
      value.toLowerCase().includes(normalizedQuery),
    ),
  );
}
