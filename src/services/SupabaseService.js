import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Buckets
const BUCKET_USUARIO = "usuario";
const BUCKET_ESPACIO = "espacio";



// --- Funciones Generales de Tabla ---
export async function fetchFromTable(table, filters = {}) {
  let query = supabase.from(table).select('*');
  Object.entries(filters).forEach(([key, value]) => {
    query = query.eq(key, value);
  });
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function insertIntoTable(table, values) {
  const { data, error } = await supabase.from(table).insert(values).select();
  if (error) throw error;
  return data;
}

export async function updateTable(table, id, values) {
  const { data, error } = await supabase.from(table).update(values).eq('id', id).select();
  if (error) throw error;
  return data;
}

// --- Funciones de Imagenes Usuario ---
export async function uploadUserImage(path, file) {
  const { data, error } = await supabase.storage.from(BUCKET_USUARIO).upload(path, file);
  if (error) throw error;

  const { data: urlData, error: urlError } = supabase
    .storage
    .from(BUCKET_USUARIO)
    .getPublicUrl(path);
  if (urlError) throw urlError;

  return { path: data.path, publicUrl: urlData.publicUrl };
}

export function getUserImageUrl(path) {
  const { data, error } = supabase.storage.from(BUCKET_USUARIO).getPublicUrl(path);
  if (error) throw error;
  return data.publicUrl;
}

// --- Funciones de Imagenes Espacio ---
export async function uploadEspacioImage(path, file) {
  const { data, error } = await supabase.storage.from(BUCKET_ESPACIO).upload(path, file);
  if (error) throw error;

  const { data: urlData, error: urlError } = supabase
    .storage
    .from(BUCKET_ESPACIO)
    .getPublicUrl(path);
  if (urlError) throw urlError;

  return { path: data.path, publicUrl: urlData.publicUrl };
}

export function getEspacioImageUrl(path) {
  return supabase.storage.from(BUCKET_ESPACIO).getPublicUrl(path).data.publicUrl;
}