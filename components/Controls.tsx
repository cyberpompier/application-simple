import React from 'react';
import { RefreshCw, Download, Share2 } from 'lucide-react';

interface ControlsProps {
  onRefresh: () => void;
  isLoading: boolean;
}

export const Controls: React.FC<ControlsProps> = ({ onRefresh, isLoading }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 w-full">
      
      <button
        onClick={onRefresh}
        disabled={isLoading}
        className={`
          group relative inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white transition-all duration-200 
          bg-indigo-600 border border-transparent rounded-full shadow-sm 
          hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
          disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
        `}
      >
        <RefreshCw className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
        <span>Nouvelle Image</span>
      </button>

      <div className="flex gap-2">
        <button 
          className="p-3 text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:text-indigo-600 transition-colors shadow-sm"
          title="Télécharger (Simulation)"
          onClick={() => alert("Fonction de téléchargement simulée")}
        >
          <Download className="w-5 h-5" />
        </button>
        <button 
          className="p-3 text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:text-indigo-600 transition-colors shadow-sm"
          title="Partager"
          onClick={() => alert("Lien copié dans le presse-papier !")}
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>
      
    </div>
  );
};