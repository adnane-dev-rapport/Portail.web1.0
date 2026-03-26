import { Pool, QueryResult } from 'pg';

// Get DATABASE_URL from environment
// Netlify provides NETLIFY_DATABASE_URL for Neon
// Falls back to Supabase for backward compatibility during dev
const databaseUrl = process.env.NETLIFY_DATABASE_URL || 
                   process.env.DATABASE_URL || 
                   process.env.SUPABASE_URL;

// Log what we're using
if (databaseUrl) {
  console.log('✓ Database configured:', databaseUrl.substring(0, 30) + '...');
} else {
  console.warn('⚠️  No database URL found - queries will fail');
}

// Create a connection pool (lazy-loaded on first query)
let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    if (!databaseUrl) {
      throw new Error(
        'No database URL found. Set NETLIFY_DATABASE_URL, DATABASE_URL, or SUPABASE_URL'
      );
    }

    pool = new Pool({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false, // Required for Neon on Netlify
      },
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }

  return pool;
}

// Query function with error handling
export async function query<T = any>(
  text: string,
  params?: (string | number | boolean | null)[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const result = await getPool().query<T>(text, params);
    const duration = Date.now() - start;
    console.log('✓ Query executed', { duration: `${duration}ms`, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('❌ Database query error:', error);
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

export default getPool();
