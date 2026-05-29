import { prisma } from './prisma';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'media.json');

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({ items: [] }, null, 2));
}

export const mediaRepository = {
  // Try DB first; fallback to local JSON store when Prisma client doesn't have Media model
  async create(data: { fileName: string; url: string; mimeType?: string; size?: number; uploadedBy?: string }) {
    try {
      if ((prisma as any).media) {
        return (prisma as any).media.create({ data });
      }
    } catch (e) {
      // ignore and fallback
    }

    ensureDataFile();
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const json = JSON.parse(raw);
    const id = 'local_' + Date.now().toString(36);
    const record = { id, ...data, createdAt: new Date().toISOString() };
    json.items.unshift(record);
    fs.writeFileSync(DATA_FILE, JSON.stringify(json, null, 2));
    return record;
  },

  async findAll(options: { skip?: number; take?: number } = {}) {
    const { skip = 0, take = 100 } = options;
    try {
      if ((prisma as any).media) {
        const [items, total] = await Promise.all([
          (prisma as any).media.findMany({ skip, take, orderBy: { createdAt: 'desc' } }),
          (prisma as any).media.count(),
        ]);
        return { items, total };
      }
    } catch (e) {
      // fallback
    }

    ensureDataFile();
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const json = JSON.parse(raw);
    const items = json.items.slice(skip, skip + take);
    return { items, total: json.items.length };
  },

  async findById(id: string) {
    try {
      if ((prisma as any).media) return (prisma as any).media.findUnique({ where: { id } });
    } catch (e) {}
    ensureDataFile();
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const json = JSON.parse(raw);
    return json.items.find((i: any) => i.id === id) || null;
  },

  async delete(id: string) {
    try {
      if ((prisma as any).media) return (prisma as any).media.delete({ where: { id } });
    } catch (e) {}
    ensureDataFile();
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const json = JSON.parse(raw);
    json.items = json.items.filter((i: any) => i.id !== id);
    fs.writeFileSync(DATA_FILE, JSON.stringify(json, null, 2));
    return { success: true };
  },
};
