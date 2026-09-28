'use client'

import { useRef, useState, useEffect } from 'react';
import { addProduct, updateProduct, deleteProduct, Product } from '../actions';

export default function AdminClient({ initialProducts }: { initialProducts: Product[] }) {
  const formRef = useRef<HTMLFormElement>(null);

  // Estados para notificaciones y modales
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [productToDelete, setProductToDelete] = useState<{ id: string; imageUrl: string; name: string } | null>(null);

  // Estados de los campos de texto
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [composition, setComposition] = useState('');
  
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

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name || '');
      setPrice(editingProduct.price || '');
      setIngredients(editingProduct.ingredients || '');
      setComposition(editingProduct.composition || '');
      setPreview(editingProduct.image_url);
      setUploadType('url');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      clearForm();
    }
  }, [editingProduct]);

  const clearForm = () => {
    setFile(null);
    setPreview(null);
    setEditingProduct(null);
    setName('');
    setPrice('');
    setIngredients('');
    setComposition('');
    formRef.current?.reset();
    setUploadType('file');
  };

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

  const showAlert = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleAction = async (formData: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Formatear automáticamente el precio para que incluya '$' si no lo tiene
      let formattedPrice = price.trim();
      if (formattedPrice && !formattedPrice.startsWith('$')) {
        formattedPrice = `$${formattedPrice}`;
        formData.set('price', formattedPrice);
      }

      if (editingProduct) {
        formData.append('id', editingProduct.id!);
        formData.append('old_image_url', editingProduct.image_url);
        
        if (uploadType === 'file') {
          if (file) {
            formData.set('image_file', file);
          } else if (preview) {
            formData.set('image_url', editingProduct.image_url);
          } else {
            throw new Error('Borraste la imagen. Selecciona una nueva imagen o URL.');
          }
        } else {
          if (!formData.get('image_url')) throw new Error('Ingresa una URL válida');
        }

        await updateProduct(formData);
        showAlert('¡Producto actualizado con éxito!', 'success');
      } else {
        if (uploadType === 'file') {
          if (!file) throw new Error('Debes subir una imagen');
          formData.set('image_file', file);
        } else {
          if (!formData.get('image_url')) throw new Error('Ingresa una URL válida');
        }
        await addProduct(formData);
        showAlert('¡Producto creado con éxito!', 'success');
      }
      
      clearForm(); 
      
    } catch (error: any) {
      console.error("Error detallado:", error);
      showAlert(error.message || 'Error al guardar', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (id: string, imageUrl: string, name: string) => {
    setProductToDelete({ id, imageUrl, name });
  };

  const executeDelete = async () => {
    if (!productToDelete) return;
    
    const { id, imageUrl } = productToDelete;
    setProductToDelete(null);
    setIsDeleting(id);

    try {
      await deleteProduct(id, imageUrl);
      setProducts(products.filter(p => p.id !== id));
      showAlert('Producto eliminado correctamente', 'success');
    } catch (error: any) {
      showAlert(error.message || 'Error al eliminar', 'error');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start relative pb-12">
      
      {/* NOTIFICACIÓN FLOTANTE */}
      {notification && (
        <div className={`fixed top-4 right-4 left-4 sm:left-auto z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 text-white font-medium transition-all transform animate-in fade-in slide-in-from-top-5 duration-300 ${
          notification.type === 'success' ? 'bg-[#1A2530] border-l-4 border-[#D4AF37]' : 'bg-red-600 border-l-4 border-red-800'
        }`}>
          <span>{notification.type === 'success' ? '✨' : '⚠️'}</span>
          <p className="flex-1">{notification.message}</p>
          <button onClick={() => setNotification(null)} className="text-xs opacity-75 hover:opacity-100">✕</button>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN */}
      {productToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border-t-4 border-[#D4AF37]">
            <h3 className="text-xl font-bold text-[#1A2530] mb-2">¿Estás seguro?</h3>
            <p className="text-gray-600 text-sm mb-6">
              Estás a punto de eliminar <span className="font-bold text-[#1A2530]">"{productToDelete.name}"</span>. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={executeDelete}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 shadow-md"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* COLUMNA IZQUIERDA: FORMULARIO */}
      <div className="w-full lg:w-1/3 bg-white p-6 rounded-xl shadow-md border border-gray-200 lg:sticky lg:top-24">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-[#1A2530]">
            {editingProduct ? 'Editar Postre' : 'Añadir Nuevo'}
          </h3>
          {editingProduct && (
            <button onClick={clearForm} type="button" className="text-sm text-red-500 font-bold hover:underline">
              Cancelar edición
            </button>
          )}
        </div>
        
        <form ref={formRef} action={handleAction} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nombre <span className="text-red-500">*</span></label>
            <input 
              required 
              type="text" 
              name="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#D4AF37] outline-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Precio</label>
            <input 
              type="text" 
              name="price" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#D4AF37] outline-none" 
              placeholder="Ej. 150 (se guardará como $150)" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Ingredientes</label>
            <textarea 
              name="ingredients" 
              rows={2} 
              value={ingredients} 
              onChange={(e) => setIngredients(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#D4AF37] outline-none resize-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Descripción</label>
            <textarea 
              name="composition" 
              rows={2} 
              value={composition} 
              onChange={(e) => setComposition(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#D4AF37] outline-none resize-none" 
            />
          </div>

          <div className="pt-2">
            <div className="flex gap-4 mb-3 border-b pb-2">
              <button type="button" onClick={() => setUploadType('file')} className={`text-sm font-bold pb-1 ${uploadType === 'file' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-gray-400'}`}>Subir Archivo</button>
              <button type="button" onClick={() => setUploadType('url')} className={`text-sm font-bold pb-1 ${uploadType === 'url' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-gray-400'}`}>Usar URL</button>
            </div>

            {uploadType === 'url' ? (
              <input type="url" name="image_url" defaultValue={editingProduct?.image_url} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-[#D4AF37]" placeholder="https://..." />
            ) : (
              <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center transition-colors ${dragActive ? 'border-[#D4AF37] bg-yellow-50' : 'border-gray-300 bg-gray-50'}`}>
                {preview ? (
                  <div className="relative w-full">
                    <img src={preview} alt="Vista previa" className="h-32 mx-auto object-contain rounded-md" />
                    <button type="button" onClick={() => { setFile(null); setPreview(null); }} className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">✕</button>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-gray-600 mb-2">Arrastra tu imagen o</p>
                    <label className="bg-[#1A2530] text-white px-4 py-2 rounded-lg cursor-pointer text-xs font-medium hover:bg-gray-800">
                      Explorar archivos
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
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-bold text-[#1A2530] mb-4">Postres Registrados ({products.length})</h3>
          
          {products.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No hay productos registrados aún.</div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-200 gap-3 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img src={product.image_url} alt={product.name} className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg shadow-sm flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-bold text-[#1A2530] truncate text-sm sm:text-base">{product.name}</h4>
                      <p className="text-xs sm:text-sm text-[#D4AF37] font-bold">{product.price || 'Sin precio'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button 
                      onClick={() => setEditingProduct(product)}
                      type="button"
                      className="text-xs sm:text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-medium transition-colors"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => confirmDelete(product.id!, product.image_url, product.name)}
                      type="button"
                      disabled={isDeleting === product.id}
                      className="text-xs sm:text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 font-medium transition-colors disabled:opacity-50"
                    >
                      {isDeleting === product.id ? '...' : 'Eliminar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}