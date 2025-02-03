import { execSync } from 'child_process';
import { join } from 'path';

export async function runMigration(dbPath: string) {
  const SCHEMA_PATH = join(process.cwd(), 'database/sql/migration.sql');

  try {
    execSync(`sqlite3def "${dbPath}" -f "${SCHEMA_PATH}"`, {
      stdio: 'inherit',
    });
    console.log('✅ Migration completed successfully');
  } catch (error) {
    console.error('Failed to run migration:', error);
    throw error;
  }
}
