/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Laugh, Share2, Download } from 'lucide-react';

interface Meme {
  postLink: string;
  subreddit: string;
  title: string;
  url: string;
  nsfw: boolean;
  spoiler: boolean;
  author: string;
  ups: number;
}

export default function App() {
  const [meme, setMeme] = useState<Meme | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMeme = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Using meme-api.com, a popular redirector for Reddit memes
      const response = await fetch('https://meme-api.com/gimme');
      if (!response.ok) throw new Error('Failed to fetch meme');
      const data = await response.json();
      
      // Filter out NSFW if necessary, though the API usually handles this well
      if (data.nsfw) {
        fetchMeme(); // Try again
        return;
      }
      
      setMeme(data);
      setHasStarted(true);
    } catch (err) {
      console.error('Error fetching meme:', err);
      setError('Failed to fetch a meme. Try again!');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInitialClick = () => {
    fetchMeme();
  };

  return (
    <div className="min-h-screen bg-[#FFD700] flex flex-col items-center justify-center p-4 font-sans selection:bg-black selection:text-white">
      <AnimatePresence mode="wait">
        {!hasStarted ? (
          <motion.div
            key="initial"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
            className="text-center"
          >
            <motion.button
              id="haha-button"
              onClick={handleInitialClick}
              whileHover={{ scale: 1.1, rotate: [-1, 1, -1, 1, 0] }}
              whileTap={{ scale: 0.9 }}
              className="bg-black text-white text-7xl md:text-9xl font-black px-12 py-6 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.4)] transition-all flex items-center gap-4 group"
            >
              HAHA
              <Laugh className="w-16 h-16 md:w-24 md:h-24 group-hover:rotate-12 transition-transform" />
            </motion.button>
            <p className="mt-8 text-black/60 font-medium tracking-tight uppercase">Click to generate instant dopamine</p>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl flex flex-col items-center gap-6"
          >
            {/* Meme Card */}
            <div className="w-full bg-white border-4 border-black rounded-3xl overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative group">
              {isLoading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                  <RefreshCw className="w-12 h-12 text-black animate-spin" />
                </div>
              )}
              
              <div className="p-4 border-b-4 border-black flex items-center justify-between bg-white">
                <h2 className="font-bold text-xl truncate pr-4">{meme?.title || 'Loading...'}</h2>
                <div className="flex gap-2">
                  <span className="text-xs font-bold uppercase py-1 px-3 bg-black text-white rounded-full">
                    r/{meme?.subreddit || 'memes'}
                  </span>
                </div>
              </div>

              <div className="w-full bg-neutral-100 flex items-center justify-center relative overflow-hidden min-h-[300px] max-h-[65vh] p-2">
                {/* Checkered pattern background for transparent memes or gaps */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'conic-gradient(#000 90deg, #fff 90deg 180deg, #000 180deg 270deg, #fff 270deg)', backgroundSize: '20px 20px' }}></div>
                
                {meme?.url && (
                  <motion.img
                    key={meme.url}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={meme.url}
                    alt={meme.title}
                    className="max-w-full max-h-full w-auto h-auto object-contain relative z-0 shadow-sm"
                    onLoad={() => setIsLoading(false)}
                  />
                )}
              </div>

              <div className="p-4 bg-black text-white flex justify-between items-center">
                <span className="text-sm font-medium">u/{meme?.author || 'someone'}</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold">🔥 {meme?.ups || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <motion.button
                id="next-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchMeme}
                disabled={isLoading}
                className="bg-black text-white px-8 py-4 rounded-xl font-bold text-xl flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] disabled:opacity-50"
              >
                {isLoading ? 'FINDING LOLS...' : 'NEW MEME'}
                <RefreshCw className={`w-6 h-6 ${isLoading ? 'animate-spin' : ''}`} />
              </motion.button>
              
              {meme && (
                <>
                  <button
                    onClick={() => window.open(meme.postLink, '_blank')}
                    className="p-4 bg-white border-2 border-black rounded-xl hover:bg-neutral-100 transition-colors"
                    title="View on Reddit"
                  >
                    <Share2 className="w-6 h-6" />
                  </button>
                  <a
                    href={meme.url}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 bg-white border-2 border-black rounded-xl hover:bg-neutral-100 transition-colors"
                    title="Download Meme"
                  >
                    <Download className="w-6 h-6" />
                  </a>
                </>
              )}
            </div>

            {error && (
              <p className="text-red-600 font-bold bg-white px-4 py-2 border-2 border-black rounded-lg">{error}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="fixed bottom-4 text-black/40 text-xs font-bold uppercase tracking-[0.2em]">
        Made for maximum lulz
      </footer>
    </div>
  );
}

