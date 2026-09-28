'use client'

import { useState, useEffect } from 'react';
import { Product } from './actions';

export default function CatalogoClient({ products }: { products: Product[] }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const phoneNumber = "529618570315"; // <-- Tu número de WhatsApp

  // --- INTEGRACIÓN CON EL BOTÓN "ATRÁS" DEL CELULAR ---
  useEffect(() => {
    const handlePopState = () => {
      // Si el modal está abierto y presionan "atrás", solo cerramos el modal
      if (selectedProduct) {
        setSelectedProduct(null);
      }
    };

    if (selectedProduct) {
      // Agregamos una entrada falsa al historial cuando se abre el modal
      window.history.pushState({ modalOpen: true }, '');
      window.addEventListener('popstate', handlePopState);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [selectedProduct]);

  const closeModel = () => {
    // Si cerramos manualmente (con la X o clic afuera), regresamos el historial si es necesario
    if (selectedProduct) {
      window.history.back();
    }
    setSelectedProduct(null);
  };

  const handleWhatsApp = (product: Product) => {
    const message = `¡Hola! Me interesa hacer un pedido de: *${product.name}*${product.price ? ` (${product.price})` : ''}.\n\nMe gustaría recibir más información.`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 flex flex-col overflow-hidden group" onClick={() => setSelectedProduct(p)}>
            <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-gray-50">
              <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-4 sm:p-5 flex flex-col flex-grow">
              <h3 className="text-lg font-bold text-[#1A2530] line-clamp-2">{p.name}</h3>
              
              {p.price && <p className="text-[#D4AF37] font-black text-lg mt-1">{p.price}</p>}
              
              <div className="mt-auto pt-4">
                <span className="inline-block w-full text-center bg-gray-50 text-gray-700 font-semibold text-sm py-2 rounded-lg group-hover:bg-[#1A2530] group-hover:text-white transition-colors">
                  Ver detalles
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedProduct && (
        <div 
          onClick={closeModel} 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-[#FFFDF7] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200"
          >
            {/* BOTÓN CERRAR ("X") FLOTANTE */}
            <button 
              onClick={closeModel} 
              className="absolute -top-3 -right-3 sm:top-4 sm:right-4 bg-white text-gray-700 hover:bg-gray-100 hover:text-black w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg border border-gray-200 transition-colors z-10"
            >
              ✕
            </button>
            
            <div className="relative w-full h-48 sm:h-64 mb-6 rounded-2xl overflow-hidden shadow-sm">
              <img src={selectedProduct.image_url} alt={selectedProduct.name} className="w-full h-full object-cover" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-[#1A2530] mb-1 leading-tight">{selectedProduct.name}</h2>
            
            {selectedProduct.price && <p className="text-[#D4AF37] font-black text-2xl mb-4">{selectedProduct.price}</p>}
            
            <div className="space-y-4 mb-8 mt-4">
              {selectedProduct.ingredients && (
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-800 text-xs sm:text-sm uppercase tracking-wider mb-1">Ingredientes:</h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{selectedProduct.ingredients}</p>
                </div>
              )}
              
              {selectedProduct.composition && (
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-800 text-xs sm:text-sm uppercase tracking-wider mb-1">Descripción:</h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{selectedProduct.composition}</p>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => handleWhatsApp(selectedProduct)}
              className="w-full bg-[#25D366] text-white font-bold text-lg py-4 px-4 rounded-xl hover:bg-[#128C7E] transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg flex justify-center items-center gap-3"
            >
              Hacer pedido por WhatsApp
            </button>
          </div>
        </div>
      )}
    </>
  );
}