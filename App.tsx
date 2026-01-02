
import React, { useState, useCallback, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ImageDisplay } from './components/ImageDisplay';
import { Controls } from './components/Controls';
import { GoogleGenAI } from "@google/genai";

// Declaration for the injected window object - Adjusted to match the required AIStudio type
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

const PROMPTS = [
  "A peaceful zen garden with raked sand and stones, soft morning light, photorealistic, 8k",
  "A majestic mountain peak reflecting in a calm lake at sunrise, cinematic lighting, 8k",
  "A minimalist modern interior with large windows overlooking a forest, soft shadows, photorealistic",
  "Close up macro shot of dew drops on a fresh green leaf, bokeh background, highly detailed",
  "A cozy cabin in snowy woods at twilight with warm window light, atmospheric, 8k",
  "A vast desert landscape under a starry night sky, ethereal and calm, photorealistic",
  "A quiet ocean horizon at sunset with pastel colors, minimalist composition, 8k",
  "A bamboo forest path with filtered sunlight, serene atmosphere, photorealistic"
];

const App: React.FC = () => {
  const [imageData, setImageData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [isCheckingKey, setIsCheckingKey] = useState<boolean>(true);

  // Check if an API key is already selected
  const checkApiKey = useCallback(async () => {
    if (window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setHasApiKey(hasKey);
    } else {
      // Fallback for local dev or if not in the specific environment
      setHasApiKey(true);
    }
    setIsCheckingKey(false);
  }, []);

  useEffect(() => {
    checkApiKey();
  }, [checkApiKey]);

  const generateImage = useCallback(async () => {
    setLoading(true);
    try {
      // Re-check key or ensure client is created with current key
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          setHasApiKey(false);
          setLoading(false);
          return;
        }
      }

      // Always create a new GoogleGenAI instance right before the call to ensure current API key is used
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const randomPrompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: randomPrompt }],
        },
      });

      let foundImage = false;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64String = part.inlineData.data;
            const mimeType = part.inlineData.mimeType || 'image/png';
            setImageData(`data:${mimeType};base64,${base64String}`);
            foundImage = true;
            break;
          }
        }
      }
      
      if (!foundImage) {
        console.error("No image found in response");
      }

    } catch (error) {
      console.error("Error generating image:", error);
      // Reset key selection if entity not found or 403 as per guidelines
      if (error instanceof Error) {
         if (error.message.includes("Requested entity was not found") || error.message.includes("403")) {
            setHasApiKey(false);
         }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial generation
  useEffect(() => {
    if (hasApiKey && !imageData && !loading) {
      generateImage();
    }
  }, [hasApiKey, imageData, loading, generateImage]);

  const handleConnect = async () => {
    if (window.aistudio) {
      // Trigger the selection dialog
      await window.aistudio.openSelectKey();
      // Assume successful selection and proceed to avoid the race condition in hasSelectedApiKey()
      setHasApiKey(true);
    }
  };

  if (isCheckingKey) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400">Initialisation...</div>;
  }

  if (!hasApiKey) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
          <h1 className="text-3xl font-bold text-gray-900">Bienvenue sur ZenFocus</h1>
          <p className="text-gray-600 max-w-md">
            Pour générer des images uniques avec l'IA, veuillez connecter votre clé API Gemini (un projet GCP avec facturation active est nécessaire).
          </p>
          <button 
            onClick={handleConnect}
            className="px-6 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors shadow-lg"
          >
            Connecter Gemini API
          </button>
          <div className="text-xs text-gray-400 mt-4">
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Informations sur la facturation
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto px-4 py-8 md:py-12 gap-8">
        
        <div className="text-center space-y-2 mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Vision du Moment
          </h1>
          <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto">
            Une expérience visuelle minimaliste. Chaque image est une fenêtre unique, générée par Gemini AI pour votre inspiration.
          </p>
        </div>

        <ImageDisplay 
          imageSrc={imageData}
          isLoading={loading} 
        />

        <Controls 
          onRefresh={generateImage} 
          isLoading={loading} 
        />
        
      </div>
    </Layout>
  );
};

export default App;
