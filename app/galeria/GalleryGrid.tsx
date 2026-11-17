'use client';

import { useCallback, useEffect, useState } from 'react';

type Item = {
  id: string | number;
  name: string;
  price: string | number | null;
  image_url: string;
};

const WHATSAPP = '529681176558';

export default function GalleryGrid({ items }: { items: Item[] }) {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % items.length)),
    [items.length]
  );
  const prev = useCallback(
    () => setActive((i) => (i === null ? i : (i - 1 + items.length) % items.length)),
    [items.length]
  );

  // Teclado + bloqueo de scroll cuando el visor está abierto
  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = original;
    };
  }, [active, close, next, prev]);

  const current = active !== null ? items[active] : null;

  return (
    <>
      {/* Masonry */}
      <div className="columns-2 gap-3 sm:columns-3 sm:gap-5 lg:columns-4">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Ver ${item.name} en grande`}
            className="group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-black/5 bg-gray-100 text-left shadow-sm outline-none transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl focus-visible:ring-4 focus-visible:ring-[#D4AF37]/60 sm:mb-5"
          >
            <img
              src={item.image_url}
              alt={item.name}
              loading="lazy"
              className="block h-auto w-full transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Degradado + info */}
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/75 via-black/10 to-transparent p-3 opacity-100 transition-opacity duration-300 sm:p-4 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
              <span className="text-xs font-bold leading-tight text-white drop-shadow sm:text-sm">
                {item.name}
              </span>
              {item.price && (
                <span className="mt-1 inline-block w-fit rounded-full bg-[#D4AF37] px-2.5 py-0.5 text-[11px] font-black text-[#1A2530]">
                  {String(item.price).startsWith('$') ? item.price : `$${item.price}`}
                </span>
              )}
            </div>

            {/* Icono de ampliar */}
            <span className="absolute right-2 top-2 hidden h-8 w-8 items-center justify-center rounded-full bg-white/90 text-sm text-[#1A2530] opacity-0 shadow transition-opacity duration-300 group-hover:opacity-100 sm:flex">
              ⤢
            </span>
          </button>
        ))}
      </div>

      {/* Visor (lightbox) */}
      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.name}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Cerrar"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-xl text-white transition hover:bg-white/25"
          >
            ✕
          </button>

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Anterior"
                className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/25 sm:left-6"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Siguiente"
                className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/25 sm:right-6"
              >
                ›
              </button>
            </>
          )}

          <figure
            className="flex max-h-full max-w-3xl flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={current.image_url}
              alt={current.name}
              className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
            />
            <figcaption className="flex w-full flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
              <div>
                <p className="text-lg font-bold text-white">{current.name}</p>
                {current.price && (
                  <p className="text-base font-black text-[#D4AF37]">
                    {String(current.price).startsWith('$')
                      ? current.price
                      : `$${current.price}`}
                  </p>
                )}
              </div>
              <a
                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
                  `Hola Erika's Bake, quiero pedir: ${current.name}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:brightness-110"
              >
                Pedir por WhatsApp
              </a>
            </figcaption>
            <span className="text-xs text-white/50">
              {(active ?? 0) + 1} / {items.length}
            </span>
          </figure>
        </div>
      )}
    </>
  );
}