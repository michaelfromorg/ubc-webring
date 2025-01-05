import { useState, useMemo } from 'react';
import { Search, GitPullRequest, ExternalLink } from "lucide-react";
import websiteData from '../data/websites.json';
import { Input } from './ui/input';
import { Button } from './ui/button';
import ubcCoaUrl from '../assets/ubc-coa.svg';
import { Card, CardContent } from './ui/card';

export type Website = {
  name: string;
  year: number;
  website: string;
};

const GITHUB_PR_URL = "https://github.com/michaelfromorg/ubc-webring/edit/main/src/data/websites.json";

const WebRing = () => {
  const [search, setSearch] = useState("");
  const [websites] = useState<Website[]>(websiteData.websites);

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
    <div className="relative min-h-screen bg-gray-50 p-8">
      {/* Background Coat of Arms */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.15] z-0"
        style={{
          backgroundImage: `url(${ubcCoaUrl})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '55vh',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">UBC Web Ring</h1>
          <p className="text-gray-600">A hub of UBC computer science student websites. Both current students and alumni are featured.</p>
        </header>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-4 text-gray-400 h-6 w-6" />
            <Input
              type="text"
              placeholder="Search by name, website, or graduation year..."
              className="pl-4 py-6 text-lg bg-white/80 backdrop-blur border-2 shadow-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Websites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-24">
          {filteredWebsites.map((site) => (
            <Card key={site.website} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{site.name}</h3>
                    <span className="text-sm">class of {site.year}</span>
                  </div>
                  <a
                    href={site.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-mono flex items-center group-hover:underline truncate"
                  >
                    {site.website}
                    <ExternalLink className="ml-1 h-3 w-3 inline" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
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
