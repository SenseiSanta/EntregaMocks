import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

export const configMaria = {
    db: {
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            user: 'santiago',
            password: 'santiago',
            database: 'entrega7mensajes'
        }
    }
}

export const configSQLite = {
    db: {
        client: 'better-sqlite3',
        connection: {
            filename: path.join(__dirname, '../../DB/products.db3')
        },
        useNullAsDefault: true
    }
}