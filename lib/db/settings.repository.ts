import fs from 'fs';
import path from 'path';

type SettingsData = {
  mpesaConsumerKey?: string;
  mpesaConsumerSecret?: string;
  mpesaShortcode?: string;
  mpesaPasskey?: string;
  mpesaCallbackUrl?: string;
  cybersourceMerchantKeyId?: string;
  cybersourceMerchantSecretKey?: string;
  cybersourceWebhookSecret?: string;
};

const SETTINGS_PATH = path.join(process.cwd(), 'data', 'settings.json');

function ensureSettingsFile() {
  const dir = path.dirname(SETTINGS_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(SETTINGS_PATH)) {
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify({}, null, 2));
  }
}

function readSettingsFile(): SettingsData {
  ensureSettingsFile();
  const raw = fs.readFileSync(SETTINGS_PATH, 'utf-8');
  try {
    return JSON.parse(raw) as SettingsData;
  } catch {
    return {};
  }
}

function writeSettingsFile(data: SettingsData) {
  ensureSettingsFile();
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(data, null, 2));
}

export const settingsRepository = {
  getSettings(): SettingsData {
    return readSettingsFile();
  },

  updateSettings(data: Partial<SettingsData>) {
    const current = readSettingsFile();
    const next = { ...current, ...data };
    writeSettingsFile(next);
    return next;
  },
};
