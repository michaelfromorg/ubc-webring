import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { domain, filterWebsites, type Website } from "../lib/websites";

type Props = {
  sites: Website[];
  query: string;
  onQueryChange: (query: string) => void;
  onActiveSiteChange: (site: Website | null) => void;
};

export function SearchCommand({
  sites,
  query,
  onQueryChange,
  onActiveSiteChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasQuery = query.trim().length > 0;
  const results = hasQuery ? filterWebsites(sites, query) : [];

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          className="search-rail"
          aria-label="Search the student network"
        >
          <Search aria-hidden="true" />
          <span>Search</span>
          <kbd>⌘ K</kbd>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="search-overlay" />
        <Dialog.Content
          className="search-dialog"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            inputRef.current?.focus();
          }}
        >
          <Dialog.Title>Search the network</Dialog.Title>
          <Dialog.Description>
            Find a student by name, domain, or graduation year.
          </Dialog.Description>
          <div className="command-input">
            <Search aria-hidden="true" />
            <label className="sr-only" htmlFor="network-search">
              Name, domain, or graduation year
            </label>
            <input
              id="network-search"
              ref={inputRef}
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Type a name, domain, or year"
            />
            <Dialog.Close aria-label="Close search">
              <X aria-hidden="true" />
            </Dialog.Close>
          </div>
          <div className="command-status" role="status">
            {!hasQuery
              ? "Start typing to reorganize the switchboard."
              : results.length
                ? `${results.length} ${results.length === 1 ? "address" : "addresses"} found`
                : "No address matches this search."}
          </div>
          {results.length > 0 && (
            <ul className="command-results">
              {results.map((site, index) => (
                <li key={site.website}>
                  <a
                    href={site.website}
                    target="_blank"
                    rel="noreferrer"
                    onFocus={() => onActiveSiteChange(site)}
                    onBlur={() => onActiveSiteChange(null)}
                  >
                    <b>{String(index + 1).padStart(2, "0")}</b>
                    <span>
                      <strong>{site.name}</strong>
                      <small>{domain(site.website)}</small>
                    </span>
                    <em>{site.year}</em>
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
