'use client'

import { useState } from 'react';
import { Product } from './actions';
// Si usas Next/Image, descomenta la siguiente línea, de lo contrario usamos la etiqueta img normal
// import Image from 'next/image'; 

export default function CatalogoClient({ products }: { products: Product[] }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const phoneNumber = "529618570315"; // <-- Pon tu número aquí

  const handleWhatsApp = (product: Product) => {
    // 1. EL PRECIO EN WHATSAPP: Se añade al mensaje solo si existe
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
              
              {/* 2. EL PRECIO EN LA TARJETA: Se muestra en color dorado */}
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 sm:p-6 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#FFFDF7] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-black w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors">✕</button>
            
            <div className="relative w-full h-48 sm:h-64 mb-6 rounded-2xl overflow-hidden shadow-sm">
              <img src={selectedProduct.image_url} alt={selectedProduct.name} className="w-full h-full object-cover" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-[#1A2530] mb-1 leading-tight">{selectedProduct.name}</h2>
            
            {/* 3. EL PRECIO EN EL MODAL: Se muestra más grande debajo del título */}
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