import { join } from 'path';
import { homedir } from 'os';

export const GOLLAMA_DIR = join(homedir(), '.gollama');
export const DB_PATH = join(GOLLAMA_DIR, 'gollama.db');
