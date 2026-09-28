'use client'

import { useState } from 'react';
import { Product } from './actions';

export default function CatalogoClient({ products }: { products: Product[] }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const phoneNumber = "529618570315"; // <-- Tu número de WhatsApp

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

      {/* MODAL MÁS COMPACTO Y ELEGANTE */}
      {selectedProduct && (
        <div 
          onClick={() => setSelectedProduct(null)} 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-[#FFFDF7] rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative my-auto max-h-[85vh] flex flex-col overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
          >
            {/* BOTÓN CERRAR ("X") FLOTANTE */}
            <button 
              onClick={() => setSelectedProduct(null)} 
              className="absolute -top-3 -right-3 sm:top-3 sm:right-3 bg-white text-gray-700 hover:bg-gray-100 hover:text-black w-9 h-9 rounded-full flex items-center justify-center font-bold shadow-lg border border-gray-200 transition-colors z-10"
            >
              ✕
            </button>
            
            {/* Imagen más compacta */}
            <div className="relative w-full h-40 sm:h-48 mb-4 rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
              <img src={selectedProduct.image_url} alt={selectedProduct.name} className="w-full h-full object-cover" />
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-[#1A2530] mb-0.5 leading-tight">{selectedProduct.name}</h2>
            
            {selectedProduct.price && <p className="text-[#D4AF37] font-black text-xl mb-3">{selectedProduct.price}</p>}
            
            <div className="space-y-3 mb-6 mt-1 text-sm">
              {selectedProduct.ingredients && (
                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-0.5">Ingredientes:</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedProduct.ingredients}</p>
                </div>
              )}
              
              {selectedProduct.composition && (
                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-0.5">Descripción:</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedProduct.composition}</p>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => handleWhatsApp(selectedProduct)}
              className="w-full bg-[#25D366] text-white font-bold py-3 px-4 rounded-xl hover:bg-[#128C7E] transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg flex justify-center items-center gap-2 mt-auto"
            >
              Hacer pedido por WhatsApp
            </button>
          </div>
        </div>
      )}
    </>
  );
}