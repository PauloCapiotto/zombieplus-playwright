import { Pool } from 'pg';

/**
 * Configuração da conexão com o banco de dados PostgreSQL
 * Usa variáveis de ambiente com fallback para desenvolvimento local
 */
const pool = new Pool({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  database: process.env.DB_NAME ?? 'zombieplus',
  user: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'pwd123',
});

/**
 * Executa uma query SQL com parâmetros opcionais
 *
 * IMPORTANTE: Sempre use parâmetros ($1, $2...) para evitar SQL injection.
 *
 * @example
 * // ✅ Correto - parametrizado
 * await executeSQL('DELETE FROM movies WHERE title = $1', [movie.title])
 *
 * // ❌ Errado - vulnerável a SQL injection
 * await executeSQL(`DELETE FROM movies WHERE title = '${movie.title}'`)
 *
 * @param {string} sql - Query SQL com placeholders ($1, $2, ...)
 * @param {any[]} [params=[]] - Valores dos parâmetros
 * @returns {Promise<any[]>} Linhas retornadas pela query
 */
export async function executeSQL(sql, params = []) {
  try {
    const result = await pool.query(sql, params);
    return result.rows;
  } catch (error) {
    console.error('Erro ao executar SQL:', error.message);
    console.error('Query:', sql);
    console.error('Params:', params);
    throw error;
  }
}

// ─── Helpers de limpeza ────────────────────────────────────────────────────────

/**
 * Remove um filme do banco pelo título (usado no beforeEach dos testes)
 * @param {string} title
 */
export async function deleteMovieByTitle(title) {
  return executeSQL('DELETE FROM movies WHERE title = $1', [title]);
}

/**
 * Remove múltiplos filmes do banco pelos títulos
 * @param {string[]} titles
 */
export async function deleteMoviesByTitle(titles) {
  return Promise.all(titles.map(deleteMovieByTitle));
}

/**
 * Remove um lead do banco pelo email
 * @param {string} email
 */
export async function deleteLeadByEmail(email) {
  return executeSQL('DELETE FROM leads WHERE email = $1', [email]);
}
