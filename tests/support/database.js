import { Pool } from 'pg';

const DbConfig = {
    user: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'zombieplus',
    password: 'pwd123',
    port: 5432,
};

const pool = new Pool(DbConfig);

export async function executeSQL(sqlScript, params = []) {
  try {
    const result = await pool.query(sqlScript, params);
    return result.rows;
  } catch (error) {
    console.error('Erro ao executar SQL:', error.message);
    throw error;
  }
}
