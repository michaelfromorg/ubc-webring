import { useState, useMemo } from "react";
import { Search, GitPullRequest, ExternalLink } from "lucide-react";
import websiteData from "../data/websites.json";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import ubcCoaUrl from "../assets/ubc-coa.svg";
import { Card, CardContent } from "./ui/card";
import { motion } from "framer-motion";

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

  const filteredWebsites = useMemo(() => {
    const filtered = websites.filter(
      (site) =>
        site.name.toLowerCase().includes(search.toLowerCase()) ||
        site.website.toLowerCase().includes(search.toLowerCase()) ||
        site.year.toString().includes(search)
    );
    return [...filtered].sort(() => Math.random() - 0.5);
  }, [websites, search]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      {/* Background Coat of Arms */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 1 }}
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url(${ubcCoaUrl})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "55vh",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4">
            <a href="/ubc-webring/">
              <img
                src={ubcCoaUrl}
                alt="UBC Coat of Arms"
                className="h-12 w-12 transition-all hover:scale-110"
              />
            </a>
            <h1 className="text-4xl font-bold bg-clip-text py-1 text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
              UBC Web Ring
            </h1>
          </div>
          <p className="text-gray-300 text-lg mt-3">
            A curated collection of current & past UBC computer science student
            websites
          </p>
        </motion.header>

        {/* Search Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-12 sticky top-8 z-40"
        >
          <div className="relative">
            <Search className="absolute left-4 top-4 text-gray-400 h-6 w-6" />
            <Input
              type="text"
              placeholder="Search by name, website, or graduation year..."
              className="pl-4 py-6 text-lg bg-gray-800/90 backdrop-blur border-none ring-1 ring-gray-700 shadow-2xl shadow-black/100 rounded-xl transition-all duration-200 text-gray-200 placeholder:text-gray-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Websites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-32">
          {filteredWebsites.map((site, index) => (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              key={site.website}
            >
              <Card className="hover:shadow-xl transition-all duration-300 bg-gray-800/90 backdrop-blur border-none ring-1 ring-gray-700 z-20">
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg text-gray-200">
                        {site.name}
                      </h3>
                      <span className="text-sm bg-gray-700 px-3 py-1 rounded-full text-gray-300">
                        {site.year}
                      </span>
                    </div>
                    <a
                      href={site.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-mono flex items-center text-blue-400 hover:text-blue-300 transition-colors truncate group"
                    >
                      {site.website}
                      <ExternalLink className="ml-1 h-3 w-3 inline transition-transform group-hover:translate-x-0.5" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating Add Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="fixed bottom-8 inset-x-0 mx-auto z-20 w-fit"
      >
        <Button
          className="rounded-full px-8 py-6 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => window.open(GITHUB_PR_URL, "_blank")}
        >
          <GitPullRequest className="mr-2 h-5 w-5" />
          Add your site via GitHub
        </Button>
      </motion.div>
    </div>
  );
};

export default WebRing;
