'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Cloud } from 'lucide-react';

type CursorType = 'none' | 'trail' | 'smoke';

export function CursorSettings() {
  const [activeCursor, setActiveCursor] = useState<CursorType>('none');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check initial state
    const trailEnabled = localStorage.getItem('customCursorEnabled') === 'true';
    const smokeEnabled = localStorage.getItem('smokeCursorEnabled') === 'true';
    
    if (trailEnabled) {
      setActiveCursor('trail');
    } else if (smokeEnabled) {
      setActiveCursor('smoke');
    } else {
      setActiveCursor('none');
    }
  }, []);

  const handleCursorChange = (type: CursorType) => {
    // Turn off all cursors first
    localStorage.setItem('customCursorEnabled', 'false');
    localStorage.setItem('smokeCursorEnabled', 'false');
    
    // Trigger storage event for components
    window.dispatchEvent(new Event('storage'));
    
    // Enable selected cursor
    if (type === 'trail') {
      localStorage.setItem('customCursorEnabled', 'true');
    } else if (type === 'smoke') {
      localStorage.setItem('smokeCursorEnabled', 'true');
    }
    
    // Trigger storage event again
    window.dispatchEvent(new Event('storage'));
    
    setActiveCursor(type);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[10000]">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full p-3 sm:p-4 shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Cursor Settings"
      >
        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 sm:right-0 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 sm:p-6 w-[calc(100vw-3rem)] sm:w-80 max-w-sm animate-in slide-in-from-bottom-5 duration-300">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Cursor Effects
          </h3>
          
          <div className="space-y-2 sm:space-y-3">
            {/* No Effect */}
            <button
              onClick={() => handleCursorChange('none')}
              className={`w-full flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl transition-all duration-200 ${
                activeCursor === 'none'
                  ? 'bg-blue-500 text-white shadow-lg scale-105'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center flex-shrink-0">
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-current"></div>
              </div>
              <div className="text-left flex-1 min-w-0">
                <div className="font-semibold text-sm sm:text-base">No Effect</div>
                <div className="text-xs sm:text-sm opacity-75">Default cursor</div>
              </div>
              {activeCursor === 'none' && (
                <div className="w-2 h-2 bg-white rounded-full animate-pulse flex-shrink-0"></div>
              )}
            </button>

            {/* Trail Effect */}
            <button
              onClick={() => handleCursorChange('trail')}
              className={`w-full flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl transition-all duration-200 ${
                activeCursor === 'trail'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
              <div className="text-left flex-1 min-w-0">
                <div className="font-semibold text-sm sm:text-base">Trail Effect</div>
                <div className="text-xs sm:text-sm opacity-75 truncate">Flowing blue trail</div>
              </div>
              {activeCursor === 'trail' && (
                <div className="w-2 h-2 bg-white rounded-full animate-pulse flex-shrink-0"></div>
              )}
            </button>

            {/* Smoke Effect */}
            <button
              onClick={() => handleCursorChange('smoke')}
              className={`w-full flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl transition-all duration-200 ${
                activeCursor === 'smoke'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Cloud className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
              <div className="text-left flex-1 min-w-0">
                <div className="font-semibold text-sm sm:text-base">Smoke Effect</div>
                <div className="text-xs sm:text-sm opacity-75 truncate">Colorful particles</div>
              </div>
              {activeCursor === 'smoke' && (
                <div className="w-2 h-2 bg-white rounded-full animate-pulse flex-shrink-0"></div>
              )}
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Only one effect can be active at a time
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
