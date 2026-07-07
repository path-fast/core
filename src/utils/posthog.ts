import { PostHog } from 'posthog-node';
import { homedir } from 'os';
import { join } from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';

const CONFIG_DIR = join(homedir(), '.path-fast');
const DISTINCT_ID_FILE = join(CONFIG_DIR, 'analytics-id.json');

function loadOrCreateDistinctId(): string {
  try {
    if (fs.existsSync(DISTINCT_ID_FILE)) {
      const raw = fs.readFileSync(DISTINCT_ID_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (typeof parsed.id === 'string' && parsed.id.length > 0) {
        return parsed.id;
      }
    }
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
    const id = randomUUID();
    fs.writeFileSync(DISTINCT_ID_FILE, JSON.stringify({ id }), 'utf-8');
    return id;
  } catch {
    return 'anonymous';
  }
}

const apiKey = process.env.POSTHOG_API_KEY ?? '';
const host = process.env.POSTHOG_HOST ?? 'https://us.i.posthog.com';

export const posthog = new PostHog(apiKey, {
  host,
  flushAt: 1,
  flushInterval: 0,
  enableExceptionAutocapture: true,
  isServer: false,
});

export const distinctId = loadOrCreateDistinctId();

export async function shutdownPosthog(): Promise<void> {
  await posthog.shutdown();
}
