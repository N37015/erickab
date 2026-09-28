import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Erika's Bake | Postres y Pays",
  description: "Deliciosos postres artesanales.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        
        <header className="w-full bg-[#1A2530] border-b-4 border-[#D4AF37] px-4 py-3 sm:px-8 shadow-md sticky top-0 z-40">
          <div className="max-w-6xl mx-auto flex items-center gap-4">
            {/* LOGO A LA IZQUIERDA */}
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
              <Image
              src="/logo.png"
              alt="Erika's Bake Logo"
              fill
              priority
              sizes="(max-width: 768px) 48px, 64px" /* <-- Esto le dice a Next.js los tamaños exactos según la pantalla */
              className="rounded-full object-cover border-2 border-[#D4AF37]"
            />
            </div>
            
            {/* NOMBRE DE LA MARCA */}
            <div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-[#FFFDF7] tracking-wider">
                Erika's Bake
              </h1>
              <span className="text-[#D4AF37] text-xs sm:text-sm font-medium">
                Postres Artesanales
              </span>
            </div>
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