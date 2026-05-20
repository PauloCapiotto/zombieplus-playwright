import { Pool } from 'pg';

const DbConfig = {
    user: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'zombieplus',
    password: 'pwd123',
    port: 5432,
};

export async function executeSQL(sqlScript) {

  const pool = new Pool(DbConfig);
  const client = await pool.connect();

  try {

    const result = await client.query(sqlScript);

    console.log(result.rows);

    return result.rows;

  } catch (error) {

    console.error('Erro ao executar SQL:', error.message);

  } finally {

    client.release();

  }
}

