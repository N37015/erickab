import { getProducts } from './actions';
import CatalogClient from './CatalogoClient';
import Image from "next/image";

export const revalidate = 0;

export default async function HomePage() {
  const products = (await getProducts()) || [];

  return (
    <div>
      {/* SECCIÓN DEL LOGO CENTRADO */}
      <div className="flex justify-center mb-12 mt-4">
        <Image
          src="/logo.png" /* IMPORTANTE: Tu imagen debe llamarse logo.png y estar en la carpeta "public" */
          alt="Erika's Bake Logo"
          width={220}
          height={220}
          priority
          className="object-contain rounded-full shadow-xl border-4 border-[#D4AF37]" 
        />
      </div>

      {/* SECCIÓN DEL MENÚ */}
      <h2 className="text-2xl font-bold text-[#1A2530] mb-8 border-b-2 border-[#D4AF37] inline-block pb-2">
        Nuestro Menú
      </h2>
      
      {products.length === 0 ? (
        <p className="text-gray-500">Aún no hay postres en el catálogo.</p>
      ) : (
        <CatalogClient products={products} />
      )}
    </div>
  );
}