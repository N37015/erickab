'use client'

import { useRef, useState, useEffect } from 'react';
import { addProduct, updateProduct, deleteProduct, Product } from '../actions';

export default function AdminClient({ initialProducts }: { initialProducts: Product[] }) {
  const formRef = useRef<HTMLFormElement>(null);


  
  
  // Estados para el CRUD
  const [products, setProducts] = useState<Product[]>(initialProducts);
const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Estados para la imagen
  const [uploadType, setUploadType] = useState<'file' | 'url'>('file');
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Cargar datos en el formulario cuando se hace clic en "Editar"
  useEffect(() => {
    if (editingProduct) {
      setPreview(editingProduct.image_url);
      setUploadType('url');
    } else {
      clearForm();
    }
  }, [editingProduct]);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  // --- Funciones de Drag & Drop ---
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
  };

  const handleFile = (file: File) => {
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const clearForm = () => {
    setFile(null);
    setPreview(null);
    setEditingProduct(null);
    formRef.current?.reset();
    setUploadType('file');
  };

const handleAction = async (formData: FormData) => {
    setIsSubmitting(true);
    
    try {
      if (editingProduct) {
        formData.append('id', editingProduct.id!);
        formData.append('old_image_url', editingProduct.image_url);
        
        if (uploadType === 'file') {
          if (file) {
            formData.set('image_file', file);
          } else if (preview) {
            formData.set('image_url', editingProduct.image_url);
          } else {
            throw new Error('Borraste la imagen. Por favor selecciona una nueva imagen o URL antes de guardar.');
          }
        } else {
          if (!formData.get('image_url')) throw new Error('Ingresa una URL válida');
        }

        await updateProduct(formData);
        alert('Producto actualizado con éxito');
      } else {
        if (uploadType === 'file') {
          if (!file) throw new Error('Debes subir una imagen');
          formData.set('image_file', file);
        } else {
          if (!formData.get('image_url')) throw new Error('Ingresa una URL válida');
        }
        await addProduct(formData);
        alert('Producto creado con éxito');
      }
      
      // En lugar de recargar la página, solo limpiamos el formulario.
      // Next.js (gracias a revalidatePath) actualizará la tabla automáticamente.
      clearForm(); 
      
   } catch (error: any) {
      console.error("Error detallado:", error); // <-- Añade esto para ver el error exacto en F12
      alert(error.message || 'Error al guardar');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('¿Estás seguro de eliminar este postre? Esta acción no se puede deshacer.')) return;
    
    setIsDeleting(id);
    try {
      await deleteProduct(id, imageUrl);
      setProducts(products.filter(p => p.id !== id));
    } catch (error: any) {
      alert(error.message || 'Error al eliminar');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      
      {/* COLUMNA IZQUIERDA: FORMULARIO */}
      <div className="w-full lg:w-1/3 bg-white p-6 rounded-xl shadow-md border border-gray-200 sticky top-24">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-[#1A2530]">
            {editingProduct ? 'Editar Postre' : 'Añadir Nuevo'}
          </h3>
          {editingProduct && (
            <button onClick={clearForm} type="button" className="text-sm text-red-500 font-bold hover:underline">
              Cancelar
            </button>
          )}
        </div>
        
        {/* Aquí está el form corregido con onSubmit */}
        <form ref={formRef} action={handleAction} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nombre <span className="text-red-500">*</span></label>
            <input required type="text" name="name" defaultValue={editingProduct?.name} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#D4AF37] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Precio</label>
            <input type="text" name="price" defaultValue={editingProduct?.price || ''} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#D4AF37] outline-none" placeholder="Ej. $150 MXN" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Ingredientes</label>
            <textarea name="ingredients" rows={2} defaultValue={editingProduct?.ingredients || ''} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#D4AF37] outline-none resize-none" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Descripción</label>
            <textarea name="composition" rows={2} defaultValue={editingProduct?.composition || ''} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#D4AF37] outline-none resize-none" />
          </div>

          <div className="pt-2">
            <div className="flex gap-4 mb-3 border-b pb-2">
              <button type="button" onClick={() => setUploadType('file')} className={`text-sm font-bold pb-1 ${uploadType === 'file' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-gray-400'}`}>Subir Archivo</button>
              <button type="button" onClick={() => setUploadType('url')} className={`text-sm font-bold pb-1 ${uploadType === 'url' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-gray-400'}`}>Usar URL</button>
            </div>

            {uploadType === 'url' ? (
              <input type="url" name="image_url" defaultValue={editingProduct?.image_url} className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-[#D4AF37]" placeholder="https://..." />
            ) : (
              <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center transition-colors ${dragActive ? 'border-[#D4AF37] bg-yellow-50' : 'border-gray-300 bg-gray-50'}`}>
                {preview ? (
                  <div className="relative w-full">
                    <img src={preview} alt="Vista previa" className="h-32 mx-auto object-contain rounded-md" />
                    <button type="button" onClick={() => { setFile(null); setPreview(null); }} className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transform translate-x-2 -translate-y-2">✕</button>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-gray-600 mb-2">Arrastra tu imagen o</p>
                    <label className="bg-[#1A2530] text-white px-3 py-1 rounded cursor-pointer text-xs font-medium hover:bg-gray-800">
                      Explorar
                      <input type="file" accept="image/*" className="hidden" onChange={handleChange} />
                    </label>
                  </>
                )}
              </div>
            )}
          </div>

          <button disabled={isSubmitting} type="submit" className={`w-full text-[#FFFDF7] font-bold py-3 rounded-lg transition-all shadow-md mt-4 ${isSubmitting ? 'bg-gray-400' : (editingProduct ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#1A2530] hover:bg-gray-800')}`}>
            {isSubmitting ? 'Guardando...' : (editingProduct ? 'Actualizar Postre' : 'Guardar Postre')}
          </button>
        </form>
      </div>

      {/* COLUMNA DERECHA: LISTA DE PRODUCTOS */}
      <div className="w-full lg:w-2/3">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {products.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No hay productos registrados aún.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 font-bold text-gray-700">Foto</th>
                    <th className="p-4 font-bold text-gray-700">Nombre</th>
                    <th className="p-4 font-bold text-gray-700">Precio</th>
                    <th className="p-4 font-bold text-gray-700 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded-lg shadow-sm" />
                      </td>
                      <td className="p-4 font-semibold text-[#1A2530]">{product.name}</td>
                      <td className="p-4 text-[#D4AF37] font-bold">{product.price || '-'}</td>
                      <td className="p-4 text-right space-x-3">
                        <button 
                          onClick={() => setEditingProduct(product)}
                          type="button"
                          className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100 font-medium transition-colors"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id!, product.image_url)}
                          type="button"
                          disabled={isDeleting === product.id}
                          className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100 font-medium transition-colors disabled:opacity-50"
                        >
                          {isDeleting === product.id ? '...' : 'Eliminar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}