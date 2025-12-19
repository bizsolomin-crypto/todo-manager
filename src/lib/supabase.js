import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Using localStorage fallback.')
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    })
  : null

// Проверка подключения
if (supabase) {
  supabase.from('todos').select('count').limit(1)
    .then(() => console.log('✅ Supabase подключен'))
    .catch((err) => console.warn('⚠️ Ошибка подключения к Supabase:', err.message))
}

