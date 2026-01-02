import React, { useState, useCallback } from 'react';
import { Layout } from './components/Layout';
import { ImageDisplay } from './components/ImageDisplay';
import { Controls } from './components/Controls';

const App: React.FC = () => {
  // State to manage the "seed" for the random image, ensuring we can refresh it.
  const [imageSeed, setImageSeed] = useState<number>(Date.now());
  const [loading, setLoading] = useState<boolean>(true);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setImageSeed(Date.now());
  }, []);

  const handleImageLoad = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto px-4 py-8 md:py-12 gap-8">
        
        <div className="text-center space-y-2 mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Vision du Moment
          </h1>
          <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto">
            Une expérience visuelle minimaliste. Chaque image est une fenêtre unique, générée aléatoirement pour votre inspiration.
          </p>
        </div>

        <ImageDisplay 
          seed={imageSeed} 
          isLoading={loading} 
          onLoad={handleImageLoad} 
        />

        <Controls 
          onRefresh={handleRefresh} 
          isLoading={loading} 
        />
        
      </div>
    </Layout>
  );
};

export default App;