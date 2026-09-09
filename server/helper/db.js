<<<<<<< HEAD
import pkg from 'pg'
import 'dotenv/config'

const { Pool } = pkg

const openDb = () => {
  const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT
  })
  return pool
}

const pool = openDb()

=======
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
>>>>>>> origin/main
export { pool }