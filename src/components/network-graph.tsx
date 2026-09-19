import { Maximize2, Minus, Plus } from "lucide-react";
import {
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent,
} from "react";
import { domain, filterWebsites, type Website } from "../lib/websites";

type Props = {
  sites: Website[];
  query: string;
  onActiveSiteChange: (site: Website | null) => void;
};

type Point = { x: number; y: number };
type View = Point & { scale: number };
type PlacedSite = { site: Website; point: Point; hub: Point };
type Group = { year: string; hub: Point; sites: PlacedSite[] };

const HUBS: Record<string, Point> = {
  "2027": { x: 235, y: 210 },
  "2026": { x: 445, y: 430 },
  "2025": { x: 670, y: 235 },
  "2024": { x: 880, y: 455 },
  "2023": { x: 1060, y: 245 },
};

const OFFSETS: Record<string, Point[]> = {
  "2027": [{ x: -125, y: -70 }],
  "2026": [
    { x: -120, y: -70 },
    { x: -20, y: -110 },
    { x: -150, y: 20 },
    { x: 105, y: 25 },
    { x: -115, y: 105 },
    { x: 95, y: 115 },
  ],
  "2025": [
    { x: -125, y: -70 },
    { x: 95, y: -85 },
    { x: -145, y: 20 },
    { x: 105, y: 25 },
    { x: -115, y: 105 },
    { x: 95, y: 115 },
    { x: 5, y: 155 },
  ],
  "2024": [{ x: 90, y: 70 }, { x: -80, y: 100 }],
  "2023": [{ x: 110, y: -60 }],
};

const INITIAL_VIEW: View = { x: 0, y: 0, scale: 1 };

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function fallbackHub(index: number, total: number): Point {
  const columns = Math.min(3, total);
  const rows = Math.ceil(total / columns);
  const column = index % columns;
  const row = Math.floor(index / columns);

  return {
    x: columns === 1 ? 620 : 150 + column * (940 / (columns - 1)),
    y: rows === 1 ? 360 : 140 + row * (440 / (rows - 1)),
  };
}

function fallbackOffset(index: number): Point {
  const angle = (index * Math.PI * 2) / 8 - Math.PI / 2;
  const ring = Math.floor(index / 8);
  const radius = 125 + ring * 45;

  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius * 0.72,
  };
}

export function NetworkGraph({
  sites,
  query,
  onActiveSiteChange,
}: Props) {
  const [view, setView] = useState<View>(INITIAL_VIEW);
  const dragRef = useRef<{
    pointerId: number;
    start: Point;
    origin: Point;
  } | null>(null);

  const groups = useMemo<Group[]>(() => {
    const sitesByYear = new Map<string, Website[]>();

    for (const site of sites) {
      const yearSites = sitesByYear.get(site.year) ?? [];
      yearSites.push(site);
      sitesByYear.set(site.year, yearSites);
    }

    const years = [...sitesByYear.entries()].sort(
      ([a], [b]) => Number(b) - Number(a),
    );

    return years.map(([year, yearSites], groupIndex) => {
      const hub = HUBS[year] ?? fallbackHub(groupIndex, years.length);

      return {
        year,
        hub,
        sites: yearSites.map((site, index): PlacedSite => {
          const offset = OFFSETS[year]?.[index] ?? fallbackOffset(index);

          return {
            site,
            hub,
            point: { x: hub.x + offset.x, y: hub.y + offset.y },
          };
        }),
      };
    });
  }, [sites]);

  const placed = groups.flatMap((group) => group.sites);
  const matchingSites = useMemo(
    () => new Set(filterWebsites(sites, query).map((site) => site.website)),
    [query, sites],
  );

  const zoomBy = (factor: number, anchor = { x: 620, y: 360 }) => {
    setView((current) => {
      const scale = clamp(current.scale * factor, 0.55, 1.8);
      const worldX = (anchor.x - current.x) / current.scale;
      const worldY = (anchor.y - current.y) / current.scale;

      return {
        scale,
        x: anchor.x - worldX * scale,
        y: anchor.y - worldY * scale,
      };
    });
  };

  const onWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();

    zoomBy(Math.exp(-event.deltaY * 0.0012), {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || (event.target as Element).closest("a, button")) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      start: { x: event.clientX, y: event.clientY },
      origin: { x: view.x, y: view.y },
    };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) return;

    setView((current) => ({
      ...current,
      x: drag.origin.x + event.clientX - drag.start.x,
      y: drag.origin.y + event.clientY - drag.start.y,
    }));
  };

  const endPan = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
    }
  };

  return (
    <div className="network-map">
      <div className="network-toolbar" role="group" aria-label="Graph view controls">
        <button onClick={() => zoomBy(1.2)} aria-label="Zoom in">
          <Plus aria-hidden="true" />
        </button>
        <button onClick={() => zoomBy(1 / 1.2)} aria-label="Zoom out">
          <Minus aria-hidden="true" />
        </button>
        <button onClick={() => setView(INITIAL_VIEW)} aria-label="Reset graph view">
          <Maximize2 aria-hidden="true" />
        </button>
        <output aria-live="polite">{Math.round(view.scale * 100)}%</output>
      </div>
      <div
        className="network-pan"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPan}
        onPointerCancel={endPan}
      >
        <div
          className="graph-world"
          style={{
            transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})`,
          }}
        >
          <div className="graph-canvas">
            <svg
              className="graph-edges"
              viewBox="0 0 1240 720"
              aria-hidden="true"
            >
              {placed.map((item) => (
                <path
                  className={
                    matchingSites.has(item.site.website)
                      ? "site-edge"
                      : "site-edge is-muted"
                  }
                  key={item.site.website}
                  d={`M ${item.hub.x} ${item.hub.y} L ${item.point.x} ${item.point.y}`}
                />
              ))}
            </svg>
            {groups.map((group) => (
              <div
                className="year-hub"
                key={group.year}
                style={{ left: group.hub.x, top: group.hub.y }}
              >
                {group.year}
              </div>
            ))}
            {placed.map((item) => {
              const isMatch = matchingSites.has(item.site.website);
              const siteDomain = domain(item.site.website);

              return (
                <a
                  key={item.site.website}
                  href={item.site.website}
                  target="_blank"
                  rel="noreferrer"
                  className={`graph-node ${isMatch ? "is-match" : "is-muted"}`}
                  style={{ left: item.point.x, top: item.point.y }}
                  title={siteDomain}
                  onMouseEnter={() => onActiveSiteChange(item.site)}
                  onMouseLeave={() => onActiveSiteChange(null)}
                  onFocus={() => onActiveSiteChange(item.site)}
                  onBlur={() => onActiveSiteChange(null)}
                  aria-label={`${item.site.name}, class of ${item.site.year}, ${siteDomain}`}
                >
                  {siteDomain}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
