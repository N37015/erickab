'use client'

import { useState, useEffect } from 'react';
import { Product } from './actions';

export default function CatalogoClient({ products, settings }: { products: Product[], settings?: any }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const phoneNumber = "529681176558"; // Tu número de WhatsApp

  // --- ESTADOS PARA LOS FILTROS Y ORDENAMIENTO ---
  const [filterPromo, setFilterPromo] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'asc' | 'desc'>('default');

  // --- INTEGRACIÓN CON EL BOTÓN "ATRÁS" DEL CELULAR ---
  useEffect(() => {
    const handlePopState = () => {
      if (selectedProduct) {
        setSelectedProduct(null);
      }
    };

    if (selectedProduct) {
      window.history.pushState({ modalOpen: true }, '');
      window.addEventListener('popstate', handlePopState);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [selectedProduct]);

  const closeModel = () => {
    if (selectedProduct) {
      window.history.back();
    }
    setSelectedProduct(null);
  };

  const handleWhatsApp = (product: Product) => {
    // Armamos el mensaje principal
    let message = `¡Hola! Me interesa hacer un pedido de: *${product.name}*${product.price ? ` (${product.price})` : ''}.`;
    if (product.es_promocion && product.detalles_promocion) {
      message += `\nIncluye: ${product.detalles_promocion}`;
    }
    
    // VERIFICAMOS SI LA PROMO GLOBAL ESTÁ ACTIVA ANTES DE DAR EL CÓDIGO
    if (settings?.promo_active) {
      const now = new Date();
      const timeString = `${now.getDate().toString().padStart(2, '0')}${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
      const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
      const secretCode = `WEB-${timeString}-${randomStr}`;

      message += `\n\n🎁 *Código de Promo Web:* ${secretCode}`;
      message += `\n_(Válido únicamente por 15 minutos)_`;
    }

    message += `\n\nMe gustaría recibir más información.`;

    // Lógica de envío (celular vs PC)
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    } else {
      window.open(`https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  // --- LÓGICA DE FILTRADO Y ORDENAMIENTO ---
  const filteredProducts = products.filter(p => {
    if (filterPromo && !p.es_promocion) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'asc' || sortBy === 'desc') {
      const priceA = parseFloat((a.price || '0').replace(/[^0-9.]/g, '')) || 0;
      const priceB = parseFloat((b.price || '0').replace(/[^0-9.]/g, '')) || 0;
      return sortBy === 'asc' ? priceA - priceB : priceB - priceA;
    }
    return 0; // Orden por defecto (creación)
  });

  return (
    <>
      {/* BARRA DE FILTROS Y ORDENAMIENTO OPTIMIZADA PARA MÓVIL */}
      <div className="flex flex-col gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8">
        
        {/* Botones de categoría / filtro en una sola fila adaptable */}
        <div className="grid grid-cols-2 gap-2 w-full">
          <button 
            onClick={() => setFilterPromo(false)}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center truncate ${
              !filterPromo 
                ? 'bg-[#1A2530] text-white shadow-sm' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🍰 Todos
          </button>
          
          <button 
            onClick={() => setFilterPromo(true)}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1 text-center truncate ${
              filterPromo 
                ? 'bg-[#D4AF37] text-white shadow-md' 
                : 'bg-yellow-50 text-[#D4AF37] border border-yellow-200 hover:bg-yellow-100'
            }`}
          >
            <span>🔥</span> <span>Promociones</span>
          </button>
        </div>

        {/* Menú desplegable para ordenar */}
        <div className="w-full">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-xs sm:text-sm font-semibold rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#D4AF37] cursor-pointer"
          >
            <option value="default">Ordenar: Más recientes</option>
            <option value="asc">Menor precio ($)</option>
            <option value="desc">Mayor precio ($)</option>
          </select>
        </div>
      </div>

      {/* CUADRÍCULA DE PRODUCTOS */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <span className="text-4xl">🔍</span>
          <h3 className="text-lg font-bold text-[#1A2530] mt-3">No se encontraron productos</h3>
          <p className="text-gray-500 text-sm mt-1">Intenta cambiar los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {sortedProducts.map((p: any) => (
            <div 
              key={p.id} 
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 flex flex-col overflow-hidden group relative" 
              onClick={() => setSelectedProduct(p)}
            >
              {/* Etiqueta de Oferta */}
              {p.es_promocion && (
                <span className="absolute top-3 left-3 bg-[#D4AF37] text-white text-[10px] sm:text-xs font-extrabold px-2.5 py-0.5 rounded-full shadow-md z-10 animate-pulse">
                  🔥 Oferta
                </span>
              )}

              <div className="relative w-full h-40 sm:h-56 overflow-hidden bg-gray-50">
                <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              
              <div className="p-3 sm:p-4 flex flex-col flex-grow">
                <h3 className="text-sm sm:text-lg font-bold text-[#1A2530] line-clamp-2">{p.name}</h3>
                
                {/* Visualización de Precios (Normal o Promoción con tachado) */}
                {p.es_promocion && p.precio_anterior ? (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-400 text-xs sm:text-sm line-through font-semibold">{p.precio_anterior}</span>
                    <span className="text-[#D4AF37] font-black text-base sm:text-lg">{p.price}</span>
                  </div>
                ) : (
                  p.price && <p className="text-[#D4AF37] font-black text-base sm:text-lg mt-1">{p.price}</p>
                )}

                {/* Detalles breves de la promo en la tarjeta si existen */}
                {p.es_promocion && p.detalles_promocion && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1 bg-yellow-50/60 p-1 rounded">
                    🎁 {p.detalles_promocion}
                  </p>
                )}
                
                {/* BOTONES INFERIORES: Ver detalles + Pedir directo */}
                <div className="mt-auto pt-3 flex gap-2">
                  <span className="flex-1 flex items-center justify-center bg-gray-50 text-gray-700 font-semibold text-xs sm:text-sm py-2 rounded-lg group-hover:bg-[#1A2530] group-hover:text-white transition-colors">
                    Ver detalles
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Evita que se abra el modal
                      handleWhatsApp(p);
                    }}
                    className="flex-shrink-0 bg-[#25D366] text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-[#128C7E] transition-colors shadow-sm flex items-center justify-center"
                    aria-label="Pedir por WhatsApp"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL DE DETALLES */}
      {selectedProduct && (
        <div 
          onClick={closeModel} 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-[#FFFDF7] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200"
          >
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
            
            {/* Precios en el Modal */}
            {selectedProduct.es_promocion && selectedProduct.precio_anterior ? (
              <div className="flex items-center gap-3 mb-4">
                <span className="text-gray-400 text-base line-through font-semibold">{selectedProduct.precio_anterior}</span>
                <span className="text-[#D4AF37] font-black text-2xl">{selectedProduct.price}</span>
              </div>
            ) : (
              selectedProduct.price && <p className="text-[#D4AF37] font-black text-2xl mb-4">{selectedProduct.price}</p>
            )}
            
            <div className="space-y-4 mb-8 mt-4">
              {/* Si es promoción y tiene detalles, los destacamos */}
              {selectedProduct.es_promocion && selectedProduct.detalles_promocion && (
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 shadow-sm">
                  <h3 className="font-bold text-[#1A2530] text-xs sm:text-sm uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span>🔥</span> Qué incluye esta promoción:
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed font-medium">{selectedProduct.detalles_promocion}</p>
                </div>
              )}

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