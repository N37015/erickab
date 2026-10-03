// app/admin/page.tsx
import { getProducts, getStoreSettings } from '../actions';
import AdminClient from './AdminClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const products = await getProducts();
  const settings = await getStoreSettings(); // <-- Leemos la BD

  return (
    <div className="p-8">
      {/* Pasamos ambas variables al cliente */}
      <AdminClient initialProducts={products} initialSettings={settings} />
    </div>
  );
}