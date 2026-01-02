import React, { ReactNode } from 'react';
import { Camera } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col text-gray-900 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm backdrop-blur-md bg-opacity-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-md">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-wide text-gray-800 hidden sm:block">ZenFocus</span>
          </div>
          <nav>
            <span className="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-500 rounded-full border border-gray-200">
              v1.0.0
            </span>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col relative overflow-hidden">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} ZenFocus. Construit avec React & Tailwind.</p>
        </div>
      </footer>

    </div>
  );
};