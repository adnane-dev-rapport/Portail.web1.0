import { Pool, QueryResult } from 'pg';

// Get DATABASE_URL from environment
// Netlify provides NETLIFY_DATABASE_URL for Neon
const databaseUrl = process.env.NETLIFY_DATABASE_URL || 
                   process.env.DATABASE_URL || 
                   process.env.SUPABASE_URL; // Fallback for local dev

if (!databaseUrl) {
  throw new Error(
    'No database URL found. Set NETLIFY_DATABASE_URL, DATABASE_URL, or SUPABASE_URL'
  );
}

// Create a connection pool
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false, // Required for Neon on Netlify
  },
});

// Query function with error handling
export async function query<T = any>(
  text: string,
  params?: (string | number | boolean | null)[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const result = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Get a single row
export async function queryOne<T = any>(
  text: string,
  params?: (string | number | boolean | null)[]
): Promise<T | null> {
  const result = await query<T>(text, params);
  return result.rows[0] || null;
}

// Get multiple rows
export async function queryMany<T = any>(
  text: string,
  params?: (string | number | boolean | null)[]
): Promise<T[]> {
  const result = await query<T>(text, params);
  return result.rows;
}

export default pool;
