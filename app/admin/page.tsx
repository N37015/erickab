import { getProducts } from '../actions';
import AdminClient from './AdminClient';

export const revalidate = 0;

export default async function AdminPage() {
  const products = (await getProducts()) || [];

  return (
    <div className="max-w-6xl mx-auto mt-4">
      <div className="flex justify-between items-center mb-8 border-b-2 border-[#D4AF37] pb-4">
        <h2 className="text-3xl font-extrabold text-[#1A2530]">Panel de Control</h2>
      </div>
      
      {/* Pasamos los productos al componente interactivo */}
      <AdminClient initialProducts={products} />
    </div>
  );
}