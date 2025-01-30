import { mkdir, access } from 'fs/promises';
import { runMigration } from '../database/migration';
import { DB_PATH, GOLLAMA_DIR } from '@/lib/constant';

async function setupDatabase() {
  try {
    console.log('🔍 Checking for .gollama directory...');
    try {
      await access(GOLLAMA_DIR);
    } catch {
      await mkdir(GOLLAMA_DIR, { recursive: true });
    }

    await runMigration(DB_PATH);

    console.log('✅ Database setup completed successfully');
  } catch (error) {
    console.error('Failed to setup database:', error);
    throw error;
  }
}

setupDatabase();
