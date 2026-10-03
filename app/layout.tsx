import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getStoreSettings } from './actions';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Erika's Bake",
  description: "Deliciosos postres artesanales.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Leemos la configuración global
  const settings = await getStoreSettings();

  return (
    <html lang="es">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        
        {/* BANNER DE PROMOCIÓN WEB (Se muestra solo si está activa) */}
        {settings?.promo_active && (
          <div className="bg-[#D4AF37] text-[#1A2530] text-center text-xs sm:text-sm font-black py-1.5 px-2 shadow-sm z-50 relative">
            {settings.promo_message || "🎉 PROMO WEB: ¡Menciona el código secreto al pedir y recibe una sorpresa especial! 🎁"}
          </div>
        )}

        <header className="w-full bg-[#1A2530] border-b-4 border-[#D4AF37] px-2 sm:px-4 py-3 sticky top-0 z-40 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-1 sm:gap-2">
            
            {/* Logo y Nombre alineados */}
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Erika's Bake" className="w-9 h-9 sm:w-12 sm:h-12 rounded-full object-cover border border-[#D4AF37]" />
              <div>
                <h1 className="text-white font-black text-sm sm:text-2xl tracking-wide leading-tight">Erika's Bake</h1>
                <p className="text-[#D4AF37] text-[9px] sm:text-xs font-medium">Postres Artesanales</p>
              </div>
            </div>

            {/* Contenedor de Botones (WhatsApp + Ubicación) */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              
              {/* Botón de WhatsApp Nuevo - Visible en celular y con "select-all" para copia rápida */}
              <a 
                href="https://wa.me/529681176558?text=¡Hola!%20Me%20gustaría%20más%20información." 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] sm:text-sm font-bold text-[#1A2530] hover:text-white bg-[#25D366] hover:bg-[#128C7E] transition-colors px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow-sm flex-shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16" className="sm:w-3.5 sm:h-3.5">
                  <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                </svg>
                <span className="select-all whitespace-nowrap">968 117 6558</span>
              </a>

              {/* Botón de Ubicación Original - Icono en celular, texto en PC */}
              <a 
                href="https://www.google.com/maps/place/16%C2%B045'08.3%22N+93%C2%B022'13.1%22W/@16.752294,-93.370291,675m/data=!3m2!1e3!4b1!4m4!3m3!8m2!3d16.752294!4d-93.370291!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[11px] sm:text-sm font-bold text-gray-200 hover:text-[#D4AF37] transition-colors bg-[#111822] px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-800 shadow-inner flex-shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="hidden md:inline">Ubicación</span>
              </a>

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
              <a href="https://wa.me/529681176558" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                Haz tu pedido por WhatsApp
              </a>
            </div>
          </div>
        </footer>

        {/* BURBUJA FLOTANTE DE WHATSAPP GLOBAL */}
        <a
          href="https://wa.me/529681176558?text=¡Hola!%20Vengo%20de%20su%20página%20web%20y%20me%20gustaría%20pedir%20información."
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-50 animate-bounce"
          aria-label="Contactar por WhatsApp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
            <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
          </svg>
        </a>

      </body>
    </html>
  );
}