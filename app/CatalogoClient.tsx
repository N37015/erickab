'use client'

import { useState, useEffect, useMemo } from 'react';
import { Product } from './actions';
import Link from 'next/link';

const PHONE_NUMBER = '529681176558'; // Tu número de WhatsApp

// Convierte "$1,200.50" -> 1200.5
const parsePrice = (value?: string | number | null) => {
  if (value === null || value === undefined) return 0;
  return parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0;
};

// Calcula el % de descuento si hay precio anterior
const getDiscount = (p: any) => {
  if (!p.es_promocion || !p.precio_anterior) return 0;
  const before = parsePrice(p.precio_anterior);
  const now = parsePrice(p.price);
  if (!before || !now || now >= before) return 0;
  return Math.round(((before - now) / before) * 100);
};

const WhatsAppIcon = ({ size = 18 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 16 16" aria-hidden>
    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
  </svg>
);

// Bloque de precio reutilizable (tarjeta y modal)
const PriceBlock = ({ p, large = false }: { p: any; large?: boolean }) => {
  if (!p.price && !p.precio_anterior) return null;
  const discount = getDiscount(p);
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      {p.es_promocion && p.precio_anterior && (
        <span className={`${large ? 'text-base' : 'text-xs sm:text-sm'} font-semibold text-gray-400 line-through`}>
          {p.precio_anterior}
        </span>
      )}
      <span className={`${large ? 'text-3xl' : 'text-lg sm:text-xl'} font-black text-[#B8962E]`}>{p.price}</span>
      {discount > 0 && (
        <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-extrabold text-red-600 sm:text-xs">
          -{discount}%
        </span>
      )}
    </div>
  );
};

export default function CatalogoClient({ products, settings }: { products: Product[]; settings?: any }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // --- ESTADOS PARA LOS FILTROS, BÚSQUEDA Y ORDENAMIENTO ---
  const [filterPromo, setFilterPromo] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'asc' | 'desc'>('default');
  const [query, setQuery] = useState('');

  // --- INTEGRACIÓN CON EL BOTÓN "ATRÁS" DEL CELULAR ---
  useEffect(() => {
    const handlePopState = () => {
      if (selectedProduct) setSelectedProduct(null);
    };

    if (selectedProduct) {
      window.history.pushState({ modalOpen: true }, '');
      window.addEventListener('popstate', handlePopState);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [selectedProduct]);

  // --- BLOQUEA EL SCROLL DE FONDO Y CIERRA CON ESC ---
  useEffect(() => {
    if (!selectedProduct) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModel();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProduct]);

  const closeModel = () => {
    if (selectedProduct) {
      window.history.back();
    }
    setSelectedProduct(null);
  };

  const handleWhatsApp = (product: Product) => {
    const p: any = product;
    let message = `¡Hola! Me interesa hacer un pedido de: *${p.name}*${p.price ? ` (${p.price})` : ''}.`;
    if (p.es_promocion && p.detalles_promocion) {
      message += `\nIncluye: ${p.detalles_promocion}`;
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

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = `whatsapp://send?phone=${PHONE_NUMBER}&text=${encodeURIComponent(message)}`;
    } else {
      window.open(`https://web.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  // --- LÓGICA DE FILTRADO, BÚSQUEDA Y ORDENAMIENTO ---
  const promoCount = useMemo(() => products.filter((p: any) => p.es_promocion).length, [products]);

  const sortedProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = products.filter((p: any) => {
      if (filterPromo && !p.es_promocion) return false;
      if (q && !String(p.name || '').toLowerCase().includes(q)) return false;
      return true;
    });

    return [...filtered].sort((a: any, b: any) => {
      if (sortBy === 'asc' || sortBy === 'desc') {
        const diff = parsePrice(a.price) - parsePrice(b.price);
        return sortBy === 'asc' ? diff : -diff;
      }
      return 0; // Orden por defecto (creación)
    });
  }, [products, filterPromo, sortBy, query]);

  const hasActiveFilters = filterPromo || query.trim() !== '' || sortBy !== 'default';
  const clearFilters = () => {
    setFilterPromo(false);
    setQuery('');
    setSortBy('default');
  };

  const sel: any = selectedProduct;

  return (
    <>
      {/* BARRA DE BÚSQUEDA, FILTROS Y ORDENAMIENTO */}
      <div className="mb-8 flex flex-col gap-3 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
        {/* Buscador */}
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden>
            🔍
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar postre..."
            aria-label="Buscar postre"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm font-medium text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/40"
          />
          
        </div>
        

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_1.2fr]">
          <button
            onClick={() => setFilterPromo(false)}
            className={`truncate rounded-xl px-3 py-3 text-center text-sm font-bold transition-all ${
              !filterPromo
                ? 'bg-[#1A2530] text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🍰 Todos <span className="ml-1 text-xs opacity-70">({products.length})</span>
          </button>

          <button
            onClick={() => setFilterPromo(true)}
            className={`flex items-center justify-center gap-1 truncate rounded-xl px-3 py-3 text-center text-sm font-bold transition-all ${
              filterPromo
                ? 'bg-[#D4AF37] text-white shadow-md'
                : 'border border-yellow-200 bg-yellow-50 text-[#B8962E] hover:bg-yellow-100'
            }`}
          >
            <span>🔥</span> <span>Promociones</span>
            <span className="ml-1 text-xs opacity-70">({promoCount})</span>
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            aria-label="Ordenar productos"
            className="w-full cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-[#D4AF37]"
          >
            <option value="default">Ordenar: Más recientes</option>
            <option value="asc">Menor precio ($)</option>
            <option value="desc">Mayor precio ($)</option>
          </select>
        </div>
        

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {sortedProducts.length} {sortedProducts.length === 1 ? 'postre' : 'postres'}
          </span>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="font-bold text-[#B8962E] hover:underline">
              Limpiar filtros
            </button>
          )}
        </div>
      </div>
      <Link
  href="/galeria"
  className="group mb-8 flex items-center justify-between gap-4 rounded-2xl border border-[#D4AF37]/40 bg-gradient-to-r from-[#1A2530] to-[#243444] p-4 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-xl sm:p-5"
>
  <div className="flex items-center gap-3 sm:gap-4">
    <span
    >
      
    </span>
    <div>
      <p className="text-sm font-black text-white sm:text-lg">Galería de Postres</p>
      <p className="text-xs text-gray-300 sm:text-sm">Mira todas nuestras creaciones en fotos</p>
    </div>
  </div>
  <span
    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-lg text-[#D4AF37] transition-transform group-hover:translate-x-1"
    aria-hidden
  >
    →
  </span>
</Link>

      {/* CUADRÍCULA DE PRODUCTOS */}
      {sortedProducts.length === 0 ? (
        <div className="rounded-3xl border border-gray-100 bg-white p-10 py-16 text-center shadow-sm">
          <span className="text-5xl">🧁</span>
          <h3 className="mt-3 text-lg font-bold text-[#1A2530]">No encontramos ese postre</h3>
          <p className="mt-1 text-sm text-gray-500">Prueba con otra palabra o cambia los filtros.</p>
          <button
            onClick={clearFilters}
            className="mt-5 rounded-xl bg-[#1A2530] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#243444]"
          >
            Ver todo el menú
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {sortedProducts.map((p: any) => (
            <article
              key={p.id}
              onClick={() => setSelectedProduct(p)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedProduct(p);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Ver detalles de ${p.name}`}
              className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm outline-none transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl focus-visible:ring-4 focus-visible:ring-[#D4AF37]/50"
            >
              {/* Etiqueta de Oferta */}
              {p.es_promocion && (
                <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-[#D4AF37] px-2.5 py-1 text-[10px] font-extrabold text-white shadow-md sm:text-xs">
                  🔥 Oferta
                </span>
              )}

              <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                <img
                  src={p.image_url}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>

              <div className="flex flex-grow flex-col p-3 sm:p-4">
                <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-snug text-[#1A2530] sm:min-h-[3.25rem] sm:text-lg">
                  {p.name}
                </h3>

                <div className="mt-1">
                  <PriceBlock p={p} />
                </div>

                {p.es_promocion && p.detalles_promocion && (
                  <p className="mt-2 line-clamp-1 rounded-md bg-yellow-50 px-2 py-1 text-xs text-gray-600">
                    🎁 {p.detalles_promocion}
                  </p>
                )}

                {/* BOTONES INFERIORES: Ver detalles + Pedir directo */}
                <div className="mt-auto flex gap-2 pt-3">
                  <span className="flex flex-1 items-center justify-center rounded-lg bg-gray-50 py-2.5 text-xs font-semibold text-gray-700 transition-colors group-hover:bg-[#1A2530] group-hover:text-white sm:text-sm">
                    Ver detalles
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Evita que se abra el modal
                      handleWhatsApp(p);
                    }}
                    className="flex flex-shrink-0 items-center justify-center rounded-lg bg-[#25D366] px-3 py-2.5 text-white shadow-sm transition hover:bg-[#128C7E] active:scale-95 sm:px-4"
                    aria-label={`Pedir ${p.name} por WhatsApp`}
                  >
                    <WhatsAppIcon />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* MODAL DE DETALLES (hoja inferior en móvil, tarjeta centrada en escritorio) */}
      {sel && (
        <div
          onClick={closeModel}
          role="dialog"
          aria-modal="true"
          aria-label={sel.name}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-[#FFFDF7] shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-300 sm:max-w-3xl sm:rounded-3xl md:flex-row"
          >
            <button
              onClick={closeModel}
              aria-label="Cerrar"
              className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white/95 font-bold text-gray-700 shadow-lg transition hover:bg-gray-100 hover:text-black"
            >
              ✕
            </button>

            {/* Imagen */}
            <div className="relative aspect-[4/3] w-full flex-shrink-0 bg-gray-100 md:aspect-auto md:w-1/2">
              <img src={sel.image_url} alt={sel.name} className="h-full w-full object-cover" />
              {sel.es_promocion && (
                <span className="absolute left-3 top-3 rounded-full bg-[#D4AF37] px-3 py-1 text-xs font-extrabold text-white shadow-md">
                  🔥 Oferta
                </span>
              )}
            </div>

            {/* Contenido */}
            <div className="flex flex-1 flex-col overflow-y-auto p-5 sm:p-7">
              <h2 className="pr-10 text-2xl font-black leading-tight text-[#1A2530] sm:text-3xl md:pr-0">{sel.name}</h2>

              <div className="mt-2">
                <PriceBlock p={sel} large />
              </div>

              <div className="mt-5 space-y-3">
                {sel.es_promocion && sel.detalles_promocion && (
                  <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 shadow-sm">
                    <h3 className="mb-1 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#1A2530]">
                      <span>🔥</span> Qué incluye esta promoción
                    </h3>
                    <p className="text-sm font-medium leading-relaxed text-gray-700 sm:text-base">{sel.detalles_promocion}</p>
                  </div>
                )}

                {sel.composition && (
                  <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-800">Descripción</h3>
                    <p className="text-sm leading-relaxed text-gray-600 sm:text-base">{sel.composition}</p>
                  </div>
                )}

                {sel.ingredients && (
                  <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-800">Ingredientes</h3>
                    <p className="text-sm leading-relaxed text-gray-600 sm:text-base">{sel.ingredients}</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleWhatsApp(sel)}
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-[#25D366] px-4 py-4 text-base font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-[#128C7E] active:scale-95 sm:text-lg"
              >
                <WhatsAppIcon size={22} />
                Hacer pedido por WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}