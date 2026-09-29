import React from 'react';

export default function AfterMovie() {
  return (
    <div className="min-h-screen bg-green-950 py-12 px-4 sm:px-6 lg:px-8 text-white flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-4xl font-extrabold sm:text-5xl tracking-wide mb-12 uppercase text-green-100">
          After Movie PROXIMITI
        </h1>
        
        {/* Kontainer Video */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl border-4 border-green-800 bg-black flex items-center justify-center">
          <iframe 
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/Y-x0efG1seA" 
            title="After Movie PROXIMITI" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" 
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}
