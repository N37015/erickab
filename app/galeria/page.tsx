import { getProducts } from '../actions';
import Link from 'next/link';
import GalleryGrid from './GalleryGrid';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function GaleriaPage() {
  const products = (await getProducts()) || [];
  const items = products
    .filter((p: any) => p.image_url)
    .map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.price ?? null,
      image_url: p.image_url,
    }));

  return (
    <div className="pb-16">
      {/* Encabezado */}
      <header className="relative mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#8a6d0b]">
            Erika&apos;s Bake
          </span>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-[#1A2530] sm:text-5xl">
            Galería de Postres
          </h1>
          <div className="mt-3 h-1 w-20 rounded-full bg-[#D4AF37]" />
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base">
            Cada postre es hecho a mano, con ingredientes de calidad y mucho
            cariño. Toca cualquier foto para verla en grande.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {items.length > 0 && (
            <span className="hidden text-sm font-semibold text-gray-500 sm:inline">
              {items.length} {items.length === 1 ? 'postre' : 'postres'}
            </span>
          )}
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1A2530] px-5 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#243444] hover:shadow-lg"
          >
            <span aria-hidden>←</span> Volver al Menú
          </Link>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-gray-100 bg-white p-12 text-center shadow-sm">
          <p className="text-4xl">🍰</p>
          <p className="mt-3 font-semibold text-[#1A2530]">
            Aún no hay fotos en la galería
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Vuelve pronto, estamos horneando cosas nuevas.
          </p>
        </div>
      ) : (
        <GalleryGrid items={items} />
      )}

      {/* Llamado a la acción */}
      <section className="mt-16 overflow-hidden rounded-3xl bg-[#1A2530] px-6 py-10 text-center shadow-xl sm:px-12">
        <h2 className="text-2xl font-black text-white sm:text-3xl">
          ¿Se te antojó algo?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-gray-300">
          Pide ahora y recibe una rebanada de flan completamente gratis.
        </p>
        <a
          href="https://wa.me/529681176558?text=Hola%20Erika's%20Bake%2C%20quiero%20hacer%20un%20pedido"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:brightness-110"
        >
          Pedir por WhatsApp
        </a>
      </section>
    </div>
  );
}