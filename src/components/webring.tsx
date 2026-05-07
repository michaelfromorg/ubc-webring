import { useState, useMemo } from "react";
import { GitPullRequest, ExternalLink, Moon, Sun } from "lucide-react";
import websiteData from "../data/websites.json";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import ubcCoaUrl from "../assets/ubc-coa.svg";
import { motion } from "framer-motion";
import { DottedSurface } from "./ui/dotted-surface";
import { useTheme } from "next-themes";

export type Website = {
  name: string;
  year: string;
  website: string;
};

const GITHUB_PR_URL =
  "https://github.com/michaelfromorg/ubc-webring/edit/main/src/data/websites.csv";

const WebRing = () => {
  const [search, setSearch] = useState("");
  const [websites] = useState<Website[]>(() => websiteData);
  const { theme, setTheme } = useTheme();

  const filteredWebsites = useMemo(() => {
    const filtered = websites.filter(
      (site) =>
        site.name.toLowerCase().includes(search.toLowerCase()) ||
        site.website.toLowerCase().includes(search.toLowerCase()) ||
        site.year.toString().includes(search)
    );
    return [...filtered].sort((a, b) => {
      const yearDiff = Number(b.year) - Number(a.year);
      if (yearDiff !== 0) return yearDiff;
      return a.name.localeCompare(b.name);
    });
  }, [websites, search]);

  const groupedByYear = useMemo(() => {
    const groups: Record<string, Website[]> = {};
    for (const site of filteredWebsites) {
      if (!groups[site.year]) groups[site.year] = [];
      groups[site.year].push(site);
    }
    return Object.entries(groups).sort(([a], [b]) => Number(b) - Number(a));
  }, [filteredWebsites]);

  function displayUrl(url: string): string {
    return url.replace(/^https?:\/\/(www\.)?/, "");
  }

  return (
    <div className="relative min-h-screen">
      {/* Animated dotted background */}
      <DottedSurface />

      {/* Content */}
      <div className="relative z-10 px-6 py-10">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.4 }}
          className="flex items-center justify-between max-w-3xl mx-auto mb-8"
        >
          <a href="/ubc-webring/" className="flex items-center gap-3 group">
            <img
              src={ubcCoaUrl}
              alt="UBC Coat of Arms"
              className="h-12 w-12 transition-transform duration-200 group-hover:scale-110"
            />
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground leading-none">
                UBC Web Ring
              </h1>
              <p className="text-sm text-muted-foreground mt-1.5">
                {filteredWebsites.length} CS student
                {filteredWebsites.length !== 1 ? "s" : ""}
              </p>
            </div>
          </a>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg text-xs font-medium gap-1.5"
              onClick={() => window.open(GITHUB_PR_URL, "_blank")}
            >
              <GitPullRequest className="h-3.5 w-3.5" />
              Add your site here
            </Button>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors duration-150"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          </div>
        </motion.header>

        {/* Search */}
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.25 }}
          className="max-w-3xl mx-auto mb-8 sticky top-0 z-40 bg-background pt-6 pb-1"
        >
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by name, website, or grad year..."
              className="pl-4 py-5 bg-background border border-foreground/10 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-foreground/20 transition-all duration-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Websites grouped by year */}
        <div className="max-w-3xl mx-auto mb-32 space-y-10">
          {groupedByYear.map(([year, sites]) => (
            <motion.div
              key={year}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0 }}
            >
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 pl-1 bg-background/40 backdrop-blur-md">
                {year}
              </div>
              <div className="rounded-xl overflow-hidden bg-background/40 ">
                {sites.map((site, index) => (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: index * 0.04 }}
                    key={site.website}
                    className="flex items-center justify-between px-5 py-3.5 transition-colors"
                  >
                    <span className="font-medium text-sm text-foreground">
                      {site.name}
                    </span>
                    <a
                      href={site.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono flex items-center gap-1 text-muted-foreground transition-colors group/link"
                    >
                      {displayUrl(site.website)}
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                    </a>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default WebRing;
