import Dexie, { Table } from 'dexie';
import { MedicalReport, ChatMessage } from '@/types/health';

export class HealthBrainDB extends Dexie {
  reports!: Table<MedicalReport>;
  chatMessages!: Table<ChatMessage>;

  constructor() {
    super('HealthBrainDB');
    this.version(1).stores({
      reports: '++id, uploadDate, status',
      chatMessages: '++id, timestamp, role',
    });
  }
}

export const db = new HealthBrainDB();
