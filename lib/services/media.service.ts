import { mediaRepository } from '@/lib/db/media.repository';

export const mediaService = {
  async uploadLocal(fileName: string, url: string, mimeType?: string, size?: number, uploadedBy?: string) {
    return mediaRepository.create({ fileName, url, mimeType, size, uploadedBy });
  },

  async list(options: { skip?: number; take?: number } = {}) {
    return mediaRepository.findAll(options);
  },

  async get(id: string) {
    return mediaRepository.findById(id);
  },
};
