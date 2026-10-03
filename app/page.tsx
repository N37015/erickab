import { getProducts, getStoreSettings } from './actions';
import CatalogClient from './CatalogoClient';

export const dynamic = 'force-dynamic';

export const revalidate = 0;

export default async function HomePage() {
  const products = (await getProducts()) || [];
  const settings = await getStoreSettings(); 

  return (
    <div>
      {/* SECCIÓN DEL MENÚ */}
      <h2 className="text-2xl font-bold text-[#1A2530] mb-8 border-b-2 border-[#D4AF37] inline-block pb-2">
        Nuestro Menú
      </h2>
      
      {products.length === 0 ? (
        <p className="text-gray-500">Aún no hay postres en el catálogo.</p>
      ) : (
        <CatalogClient products={products} settings={settings} />
      )}
    </div>
  );
}