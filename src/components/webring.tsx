import { useState, useMemo } from 'react';
import { Search, GitPullRequest } from "lucide-react";
import websiteData from '../data/websites.json';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

// Types for our data
export type Website = {
  name: string;
  year: number;
  website: string;
};

const GITHUB_PR_URL = "https://github.com/michaelfromorg/ubc-webring/edit/main/src/data/websites.json";

const WebRing = () => {
  const [search, setSearch] = useState("");
  const [websites] = useState<Website[]>(websiteData.websites);

  // Shuffle and filter websites based on search
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
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">UBC Webring</h1>
        <p className="text-gray-600">Discover websites by UBC students</p>
      </header>

      {/* Search Section */}
      <div className="max-w-xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search by name, website, or graduation year..."
            className="pl-10 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Websites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-24">
        {filteredWebsites.map((site) => (
          <Card key={site.website} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-1">{site.name}</h3>
              <p className="text-gray-600 text-sm mb-3">Class of {site.year}</p>
              <a
                href={site.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm break-all"
              >
                {site.website}
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Floating Add Button - Now links to GitHub */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
        <Button
          className="rounded-full px-6 py-6"
          onClick={() => window.open(GITHUB_PR_URL, '_blank')}
        >
          <GitPullRequest className="mr-2 h-5 w-5" />
          Add your site via GitHub
        </Button>
      </div>
    </div>
  );
};

export default WebRing;
