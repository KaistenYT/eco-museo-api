import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey);
console.log('Supabase Anon Key:', supabaseAnonKey);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createActorTable() {
  const { error } = await supabase
    .from('actor')
    .insert([])
    //.single();  Removed .single()

  if (error) {
    console.error('Error al interactuar con la tabla "actor":', error);
    console.error('Detalles del error:', error);
  } else {
    console.log('Tabla "actor" creada.');
  }
}

async function createTableAuthor() {
  const { error } = await supabase
    .from('author')
    .insert([]);
    //.single(); Removed .single()

  if (error) {
    console.error('Error al interactuar con la tabla "author":', error);
    console.error('Detalles del error:', error);
  } else {
    console.log('Tabla "author" creada.');
  }
}
    

async function createHistoryTable() {
  const { data, error } = await supabase //added data
    .from('history')
    .insert([]);
    //.single(); Removed .single()

  if (error) {
    console.error('Error al interactuar con la tabla "history":', error);
    console.error('Detalles del error:', error);
  } else {
    console.log('Tabla "history" creada.');
  }
}



async function createInitialTables() {
  await createActorTable();
  await createTableAuthor();
  await createHistoryTable();

}

createInitialTables();

export default supabase;
