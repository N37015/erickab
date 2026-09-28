import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Erika's Bake",
  description: "Deliciosos postres artesanales.",
  
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        
        <header className="w-full bg-[#1A2530] border-b-4 border-[#D4AF37] px-4 py-3 sticky top-0 z-40 shadow-md">
  <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
    
    {/* Logo y Nombre alineados */}
    <div className="flex items-center gap-3">
      <img src="/logo.png" alt="Erika's Bake" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-[#D4AF37]" />
      <div>
        <h1 className="text-white font-black text-lg sm:text-2xl tracking-wide leading-tight">Erika's Bake</h1>
        <p className="text-[#D4AF37] text-xs font-medium">Postres Artesanales</p>
      </div>
    </div>

    {/* Botón de Ubicación */}
    <a 
      href="https://maps.app.goo.gl/TU_ENLACE_DE_MAPS" 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-200 hover:text-[#D4AF37] transition-colors bg-[#111822] px-3 py-2 rounded-xl border border-gray-800 shadow-inner flex-shrink-0"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth= {2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <span>Ubicación</span>
    </a>

  </div>
</header>
        
        <main className="flex-grow w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        <footer className="w-full bg-[#1A2530] border-t-4 border-[#D4AF37] text-[#FFFDF7] mt-12 py-10">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="flex flex-col items-center sm:items-start">
              <h3 className="text-xl font-black text-[#D4AF37] mb-2">Erika's Bake</h3>
              <p className="text-sm text-gray-300 max-w-xs">Endulzando tus momentos especiales con postres hechos en casa.</p>
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <h4 className="text-lg font-bold mb-2">Ubicación</h4>
              <p className="text-sm text-gray-300">Ocozocoautla de Espinosa, Chiapas</p>
              <p className="text-sm text-gray-300">México</p>
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <h4 className="text-lg font-bold mb-2">Contacto</h4>
              <a href="#" className="text-sm text-gray-300 hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                Haz tu pedido por WhatsApp
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}