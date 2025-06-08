"use client";

import { useState } from "react";
import { decodeHtmlEntities } from "@/lib/utils";

/**
 * A modern, single-page UI for "YouTube Sort By Likes",
 * created by Tim (https://github.com/timf34).
 *
 * Monospace-inspired design with blocky elements and fun interactions.
 */

interface Video {
  title: string;
  videoId: string;
  views: number;
  likes: number;
  duration: number;
}

export default function HomePage() {
  const [channelUrl, setChannelUrl] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [maxVideos, setMaxVideos] = useState(50);
  const [filterShorts, setFilterShorts] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
  };

  const getSliderBackground = (value: number) => {
    const percentage = ((value - 50) / (350 - 50)) * 100;
    return `linear-gradient(to right, #ef4444  ${percentage}%, #FAFAFA ${percentage}%)`;
  };

  async function fetchVideos(sortMode: "likes" | "ratio") {
    try {
      setLoading(true);
      setError(null);
      setVideos([]);

      const queryParams = new URLSearchParams({
        channelUrl: channelUrl.trim(),
        sortMode: sortMode === "ratio" ? "ratio" : "likes",
        maxVideos: maxVideos.toString(),
        filterShorts: filterShorts.toString(),
      });

      const res = await fetch(`/api/videos?${queryParams}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      setVideos(data.data);
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : "Something went wrong";
      setError(error);
    } finally {
      setLoading(false);
    }
  }

      return (
      <div className={`relative min-h-screen flex flex-col font-mono transition-colors ${
        darkMode ? 'bg-black text-white' : 'bg-white text-gray-900'
      }`}>
      {/* Header with Title and GitHub Link */}
              <header className={`w-full border-b-[3px] transition-colors ${
          darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-100 border-gray-900'
        }`}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className={`text-2xl md:text-3xl font-bold tracking-tight ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            YouTube Sort By Likes
          </h1>
          <div className="flex items-center space-x-4">
            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
                             className={`relative group p-2 rounded border-[3px] transition-all ${
                 darkMode 
                   ? 'bg-gray-800 border-gray-700 text-white hover:-translate-y-px' 
                   : 'bg-white border-gray-900 text-gray-900 hover:-translate-y-px'
               }`}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            <a
              href="https://github.com/timf34/YouTubeSortByLikes"
              target="_blank"
              rel="noreferrer"
              className={`flex items-center space-x-2 hover:-translate-y-px transition-transform ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="font-medium hidden sm:inline">View on GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main content container */}
      <main className="flex-1 z-10 container mx-auto px-6 py-12 flex flex-col items-center">
        {/* Search Section */}
        <div className="w-full max-w-3xl relative mb-16">
                      <div className={`w-full h-full absolute inset-0 rounded-xl translate-y-2 translate-x-2 ${
              darkMode ? 'bg-gray-800' : 'bg-gray-900'
            }`}></div>
            <div className={`rounded-xl border-[3px] p-8 relative z-20 transition-colors ${
              darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-900'
            }`}>
            <p className={`text-center mb-6 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Find the best quality videos from any channel! 
              Paste a YouTube channel URL below to get started!
            </p>
            
            <div className="space-y-6">
                              <div className="relative">
                  <div className={`w-full h-full rounded translate-y-1 translate-x-1 absolute inset-0 ${
                    darkMode ? 'bg-gray-800' : 'bg-gray-900'
                  }`}></div>
                  <input
                  type="text"
                  placeholder="e.g. https://www.youtube.com/@veritasium"
                  value={channelUrl}
                  onChange={(e) => setChannelUrl(e.target.value)}
                                      className={`block w-full rounded border-[3px] px-6 py-4 relative z-10 focus:outline-none focus:translate-x-0 focus:translate-y-0
                             transition-transform text-xs md:text-lg ${
                               darkMode 
                                 ? 'border-gray-700 bg-gray-800 text-white placeholder-gray-400' 
                                 : 'border-gray-900 bg-white text-gray-900 placeholder-gray-400'
                             }`}
                />
              </div>

              {/* Add slider for max videos */}
              <div className="w-full mt-3">
                <label htmlFor="max_videos" className={`block mb-1 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Number of videos to fetch: <span className="font-bold">{maxVideos}</span>
                </label>
                <div className="relative">
                  <input
                    type="range"
                    id="max_videos"
                    name="max_videos"
                    min="50"
                    max="350"
                    step="50"
                    value={maxVideos}
                    onChange={(e) => setMaxVideos(Number(e.target.value))}
                    style={{ background: getSliderBackground(maxVideos) }}
                                         className={`w-full h-3 appearance-none border-[3px] rounded-sm focus:outline-none
                              [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-7 
                              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-red-500 
                              [&::-webkit-slider-thumb]:rounded-sm [&::-webkit-slider-thumb]:cursor-pointer 
                              [&::-webkit-slider-thumb]:border-solid [&::-webkit-slider-thumb]:border-[3px] 
                              ${darkMode 
                                ? 'border-gray-700 [&::-webkit-slider-thumb]:border-gray-700 [&::-webkit-slider-thumb]:shadow-[2px_2px_0_#374151]' 
                                : 'border-gray-900 [&::-webkit-slider-thumb]:border-gray-900 [&::-webkit-slider-thumb]:shadow-[2px_2px_0_#000]'
                              }`}
                  />
                </div>
              </div>

              {/* Filter shorts toggle */}
              <div className="w-full mt-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <div className="relative">
                                          <div className={`w-6 h-6 border-[3px] rounded-sm relative ${
                        darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-900 bg-white'
                      }`}>
                      <div className={`w-full h-full absolute inset-0 rounded-sm transition-opacity ${
                        filterShorts ? 'opacity-100' : 'opacity-0'
                      } ${darkMode ? 'bg-gray-400' : 'bg-gray-900'}`}></div>
                      {filterShorts && (
                        <svg className={`w-4 h-4 absolute inset-0 m-auto ${
                          darkMode ? 'text-gray-800' : 'text-white'
                        }`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={filterShorts}
                      onChange={(e) => setFilterShorts(e.target.checked)}
                      className="sr-only"
                    />
                  </div>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Filter out short videos (3 minutes or less)
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                                  <div className="relative group h-full">
                    <div className={`w-full h-full rounded translate-y-1 translate-x-1 absolute inset-0 ${
                      darkMode ? 'bg-gray-800' : 'bg-gray-900'
                    }`}></div>
                    <button
                      onClick={() => fetchVideos("likes")}
                      className={`w-full h-full font-medium px-4 py-4 rounded border-[3px] relative z-10 group-hover:-translate-y-px
                               group-hover:-translate-x-px transition-transform text-sm md:text-lg flex items-center justify-center ${
                                 darkMode 
                                   ? 'bg-gray-800 text-white border-gray-700' 
                                   : 'bg-gray-100 text-gray-900 border-gray-900'
                               }`}
                  >
                    Sort by Likes
                  </button>
                </div>
                                  <div className="relative group h-full">
                    <div className={`w-full h-full rounded translate-y-1 translate-x-1 absolute inset-0 ${
                      darkMode ? 'bg-gray-800' : 'bg-gray-900'
                    }`}></div>
                    <button
                      onClick={() => fetchVideos("ratio")}
                      className={`w-full h-full bg-red-600 text-white font-medium px-4 py-4 rounded
                               border-[3px] relative z-10 group-hover:-translate-y-px
                               group-hover:-translate-x-px transition-transform text-sm md:text-lg flex items-center justify-center ${
                                 darkMode ? 'border-gray-700' : 'border-gray-900'
                               }`}
                  >
                    Sort by Like:View Ratio
                  </button>
                </div>
              </div>
            </div>


            {/* Loading or Error */}
            {loading && (
              <div className="mt-6 text-center animate-pulse">
                <div className="inline-block w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-red-600">Loading...</span>
              </div>
            )}
            {error && (
                              <div className={`mt-6 p-4 border-[3px] border-red-600 rounded text-red-600 ${
                  darkMode ? 'bg-gray-900' : 'bg-gray-900'
                }`}>
                Error: {error}
              </div>
            )}
          </div>
        </div>

        {/* Results Table */}
        {videos.length > 0 && (
          <div className="w-full max-w-4xl relative">
                          <div className={`w-full h-full absolute inset-0 rounded-xl translate-y-2 translate-x-2 ${
                darkMode ? 'bg-gray-800' : 'bg-gray-900'
              }`}></div>
              <div className={`rounded-xl border-[3px] p-4 relative z-20 transition-colors ${
                darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-900'
              }`}>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-[3px] border-red-600">
                      <th className={`px-2 sm:px-4 py-3 text-left font-bold text-xs sm:text-base ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>Video Title</th>
                      <th className={`px-2 sm:px-4 py-3 text-left font-bold text-xs sm:text-base ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>Duration</th>
                      <th className={`px-2 sm:px-4 py-3 text-left font-bold text-xs sm:text-base ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>Likes</th>
                      <th className={`px-2 sm:px-4 py-3 text-left font-bold text-xs sm:text-base ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>Views</th>
                      <th className={`px-2 sm:px-4 py-3 text-left font-bold text-xs sm:text-base ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>Ratio (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {videos.map((v, idx) => {
                      const ratio = v.views === 0 ? 0 : ((v.likes / v.views) * 100).toFixed(2);
                      return (
                        <tr
                          key={idx}
                          className={`border-b last:border-b-0 transition-colors ${
                            darkMode 
                              ? 'border-gray-700 hover:bg-gray-700' 
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <td className="px-2 sm:px-4 py-3">
                            <a
                              href={`https://www.youtube.com/watch?v=${v.videoId}`}
                              target="_blank"
                              rel="noreferrer"
                              className={`hover:text-red-500 underline underline-offset-2 text-xs sm:text-base ${
                                darkMode ? 'text-gray-300' : 'text-gray-900'
                              }`}
                            >
                              {decodeHtmlEntities(v.title)}
                            </a>
                          </td>
                          <td className={`px-2 sm:px-4 py-3 text-xs sm:text-base ${
                            darkMode ? 'text-gray-300' : 'text-gray-900'
                          }`}>{formatDuration(v.duration)}</td>
                          <td className={`px-2 sm:px-4 py-3 font-medium text-xs sm:text-base ${
                            darkMode ? 'text-gray-300' : 'text-gray-900'
                          }`}>{v.likes.toLocaleString()}</td>
                          <td className={`px-2 sm:px-4 py-3 text-xs sm:text-base ${
                            darkMode ? 'text-gray-300' : 'text-gray-900'
                          }`}>{v.views.toLocaleString()}</td>
                          <td className={`px-2 sm:px-4 py-3 font-medium text-xs sm:text-base ${
                            darkMode ? 'text-gray-300' : 'text-gray-900'
                          }`}>{ratio}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
              <footer className={`relative z-10 border-t-[3px] mt-12 ${
          darkMode ? 'border-gray-700' : 'border-gray-900'
        }`}>
        <div className="container mx-auto px-6 py-4 flex flex-col items-center justify-center">
          <p className={darkMode ? 'text-gray-400' : 'text-gray-400'}>
            Created by{" "}
            <a
              className={`text-[#ef4444] font-medium underline underline-offset-2 ${
                darkMode ? 'hover:text-gray-300' : 'hover:text-gray-900'
              }`}
              href="https://github.com/timf34"
              target="_blank"
              rel="noreferrer"
            >
              Tim
            </a>
            . © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}