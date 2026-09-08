import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { seed, transition } from './demo-domain.mjs';
let client: SupabaseClient | null = null;
let connection: Promise<SupabaseClient> | null = null;
export function getClient() {
  const url = import.meta.env.PUBLIC_SUPABASE_URL,
    key = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return (client ??= createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
  }));
}
export async function connect() {
  if (connection) return connection;
  connection = (async () => {
    const db = getClient();
    if (!db)
      throw new Error(
        'La conexión a la nube todavía no está configurada. Puedes continuar en modo local.',
      );
    const { data, error } = await db.auth.getSession();
    if (error) throw error;
    if (!data.session)
      throw new Error(
        'El guardado en la nube requiere una sesión privada autorizada. Las demos públicas funcionan en modo local.',
      );
    return db;
  })();
  try {
    return await connection;
  } finally {
    connection = null;
  }
}
export async function currentSession() {
  const db = getClient();
  if (!db) return false;
  const { data } = await db.auth.getSession();
  return Boolean(data.session);
}
export type DemoState = ReturnType<typeof seed>;
export async function loadCloud(module: string) {
  const db = await connect();
  const { data, error } = await db
    .from('demo_workspaces')
    .select('payload,version')
    .eq('module', module)
    .maybeSingle();
  if (error) throw new Error('No se pudo cargar tu espacio. Reintenta la conexión.');
  if (data) return { data: data.payload, version: data.version };
  const session = await db.auth.getSession();
  const { data: created, error: insertError } = await db
    .from('demo_workspaces')
    .insert({ user_id: session.data.session?.user.id, module, payload: seed(module) })
    .select('payload,version')
    .single();
  if (insertError)
    throw new Error('No se pudo preparar el espacio de prueba. Intenta conectar nuevamente.');
  return { data: created.payload, version: created.version };
}
export async function saveCloud(module: string, data: unknown, version: number) {
  const db = await connect();
  const result = await db
    .from('demo_workspaces')
    .update({ payload: data, version: version + 1, updated_at: new Date().toISOString() })
    .eq('module', module)
    .eq('version', version)
    .select('version')
    .maybeSingle();
  if (result.error)
    throw new Error('No se guardó el cambio en la nube. Revisa la conexión e inténtalo otra vez.');
  if (!result.data)
    throw new Error(
      'Tu demo cambió en otra pestaña. Recarga para recuperar la versión actual antes de continuar.',
    );
  return result.data.version;
}
export { seed, transition };
