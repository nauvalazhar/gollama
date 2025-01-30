import Database from 'better-sqlite3';
import { DB_PATH } from '@/lib/constant';

const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');

export { db };
