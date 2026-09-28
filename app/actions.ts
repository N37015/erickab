'use server'

import { createClient } from './utils/supabase/server';
import { revalidatePath } from 'next/cache';

export interface Product {
  id?: string;
  name: string;
  ingredients?: string | null;
  composition?: string | null;
  price?: string | null;
  image_url: string;
  es_promocion?: boolean;
}

export async function addProduct(formData: FormData) {
  const supabase = await createClient();
  
  let imageUrl = formData.get('image_url') as string;
  const imageFile = formData.get('image_file') as File;

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage.from('postres').upload(fileName, imageFile);
    if (uploadError) throw new Error(`Error al subir la imagen: ${uploadError.message}`);

    const { data } = supabase.storage.from('postres').getPublicUrl(fileName);
    imageUrl = data.publicUrl;
  }

  // Agregamos es_promocion leyendo si el checkbox está activo ('true')
  const newProduct = {
    name: formData.get('name') as string,
    ingredients: (formData.get('ingredients') as string) || null,
    composition: (formData.get('composition') as string) || null,
    price: (formData.get('price') as string) || null,
    image_url: imageUrl,
    es_promocion: formData.get('is_promo') === 'true', // <-- ¡Añadido aquí!
  };

  const { error } = await supabase.from('products').insert([newProduct]);
  if (error) throw new Error(`Error al guardar: ${error.message}`);

  revalidatePath('/');
  revalidatePath('/admin');
}

export async function getProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  
  if (error) {
    console.error("Detalle del error al obtener:", error);
    throw new Error(`Error al obtener los postres: ${error.message}`);
  }
  
  return (data || []) as Product[];
}

export async function updateProduct(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get('id') as string;
  const oldImageUrl = formData.get('old_image_url') as string;
  
  let imageUrl = formData.get('image_url') as string;
  const imageFile = formData.get('image_file') as File;

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('postres').upload(fileName, imageFile);
    
    if (uploadError) throw new Error(`Error al subir nueva imagen: ${uploadError.message}`);
    
    const { data } = supabase.storage.from('postres').getPublicUrl(fileName);
    imageUrl = data.publicUrl;

    if (oldImageUrl && oldImageUrl.includes('supabase.co/storage')) {
      try {
        const urlParts = oldImageUrl.split('/');
        const oldFileName = urlParts[urlParts.length - 1];
        await supabase.storage.from('postres').remove([oldFileName]);
      } catch (err) {
        console.warn("No se pudo borrar la imagen anterior del storage, pero continuamos:", err);
      }
    }
  }

  if (!imageUrl) {
    throw new Error('La imagen del producto es obligatoria.');
  }

  // Agregamos es_promocion también en la actualización
  const updatedProduct = {
    name: formData.get('name') as string,
    ingredients: (formData.get('ingredients') as string) || null,
    composition: (formData.get('composition') as string) || null,
    price: (formData.get('price') as string) || null,
    image_url: imageUrl,
    es_promocion: formData.get('is_promo') === 'true', // <-- ¡Añadido aquí!
  };

  const { error } = await supabase.from('products').update(updatedProduct).eq('id', id);
  if (error) throw new Error(`Error al actualizar en BD: ${error.message}`);

  revalidatePath('/');
  revalidatePath('/admin');
}

export async function deleteProduct(id: string, imageUrl: string) {
  const supabase = await createClient();

  if (imageUrl && imageUrl.includes('supabase.co')) {
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    await supabase.storage.from('postres').remove([fileName]);
  }

  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw new Error(`Error al eliminar: ${error.message}`);

  revalidatePath('/');
  revalidatePath('/admin');
}