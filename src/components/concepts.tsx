import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import websiteData from "../data/websites.json";
import { filterWebsites, type Website } from "../lib/websites";
import { NetworkGraph } from "./network-graph";
import { SearchCommand } from "./search-command";

const CONTRIBUTE =
  "https://github.com/michaelfromorg/ubc-webring/edit/main/src/data/websites.csv";
const SITES = websiteData as Website[];

export default function ConceptGallery() {
  const [query, setQuery] = useState("");
  const [activeSite, setActiveSite] = useState<Website | null>(null);
  const matches = filterWebsites(SITES, query);
  const hasQuery = query.trim().length > 0;

  return (
    <main className="map-shell">
      <h1 className="sr-only">UBC Web Ring student website network</h1>
      <a className="skip-link" href="#network">
        Skip to network
      </a>
      <header className="map-header">
        <a className="map-brand" href="/" aria-label="UBC Web Ring home">
          <img src="/ubc-coa.svg" alt="" />
          <span>
            UBC
            <br />
            Web Ring
          </span>
        </a>
        <div className="map-title" aria-live="polite">
          {activeSite ? (
            <>
              <span>{activeSite.name}</span>
              <strong>
                {activeSite.website
                  .replace(/^https?:\/\//, "")
                  .replace(/\/$/, "")}
              </strong>
            </>
          ) : (
            <>
              <span>Graph ready</span>
              <strong>Drag the background to pan. Scroll to zoom.</strong>
            </>
          )}
        </div>
        <nav aria-label="Primary navigation">
          <a href={CONTRIBUTE} target="_blank" rel="noreferrer">
            Add your site
            <ArrowUpRight aria-hidden="true" />
          </a>
        </nav>
      </header>
      <div className="map-coordinate map-coordinate--left" aria-hidden="true">
        49.2606 N
      </div>
      <div className="map-coordinate map-coordinate--bottom" aria-hidden="true">
        123.2460 W
      </div>
      <section
        className="map-stage"
        id="network"
        aria-label="Student website network"
        tabIndex={-1}
      >
        <NetworkGraph
          sites={SITES}
          query={query}
          onActiveSiteChange={setActiveSite}
        />
      </section>
      <div className="map-count" aria-live="polite">
        <strong>{String(matches.length).padStart(2, "0")}</strong>
        <span>
          {hasQuery ? "matching" : "online"}
          <br />
          addresses
        </span>
      </div>
      <SearchCommand
        sites={SITES}
        query={query}
        onQueryChange={setQuery}
        onActiveSiteChange={setActiveSite}
      />
    </main>
  );
}
