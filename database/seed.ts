import { execSync } from 'child_process';
import { join } from 'path';

export function seedDatabase(dbPath: string) {
  const SEED_PATH = join(process.cwd(), 'database/sql/seed.sql');
  execSync(`sqlite3 "${dbPath}" ".read ${SEED_PATH}"`, {
    stdio: 'inherit',
  });
}
