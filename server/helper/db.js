import pg from 'pg'
import 'dotenv/config'

const environment = process.env.NODE_ENV || 'development'

const { Pool } = pg

const openDb = () => {
    const pool = new Pool({
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_HOST,
        database: environment === 'development' ? process.env.POSTGRES_DB : process.env.TEST_DB_NAME,
        password: process.env.POSTGRES_PASSWORD,
        port: process.env.POSTGRES_PORT
    })
    return pool
}

const pool = openDb()
export { pool }