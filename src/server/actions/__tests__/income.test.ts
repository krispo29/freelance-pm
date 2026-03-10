import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getIncomeByProject, getAllIncome, getIncomeStats, createIncomeEntry, markIncomeReceived, deleteIncomeEntry } from '../income';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

vi.mock('@/lib/db', () => ({
  db: {
    query: {
      incomeEntries: {
        findMany: vi.fn(),
      },
    },
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockIncome = [
  { id: '1', projectId: 'p1', amount: '1000', status: 'received', dueDate: new Date('2023-01-01') },
  { id: '2', projectId: 'p1', amount: '500', status: 'pending', dueDate: new Date('2030-01-01') },
  { id: '3', projectId: 'p2', amount: '200', status: 'overdue', dueDate: new Date('2023-01-01') },
  { id: '4', projectId: 'p2', amount: '300', status: 'pending', dueDate: new Date('2023-01-01') }, // also overdue technically based on date
];

describe('Income Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getIncomeByProject', () => {
    it('should return income entries for a project', async () => {
      const projectIncome = mockIncome.filter(i => i.projectId === 'p1');
      (db.query.incomeEntries.findMany as any).mockResolvedValue(projectIncome);

      const result = await getIncomeByProject('p1');
      
      expect(result).toEqual(projectIncome);
      expect(db.query.incomeEntries.findMany).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if fetching fails', async () => {
      (db.query.incomeEntries.findMany as any).mockRejectedValue(new Error('DB Error'));

      await expect(getIncomeByProject('p1')).rejects.toThrow('Failed to fetch income entries');
    });
  });

  describe('getAllIncome', () => {
    it('should return all income entries', async () => {
      (db.query.incomeEntries.findMany as any).mockResolvedValue(mockIncome);

      const result = await getAllIncome();
      
      expect(result).toEqual(mockIncome);
      expect(db.query.incomeEntries.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('getIncomeStats', () => {
    it('should calculate correct stats', async () => {
      (db.query.incomeEntries.findMany as any).mockResolvedValue(mockIncome);

      const result = await getIncomeStats();
      
      expect(result.totalReceived).toBe(1000);
      expect(result.totalPending).toBe(500); // Only id 2 is strictly pending (future date)
      expect(result.totalOverdue).toBe(500); // id 3 (overdue) 200 + id 4 (pending but past due) 300 = 500
      expect(result.totalExpected).toBe(2000);
    });
  });

  describe('createIncomeEntry', () => {
    const newEntryData = { projectId: 'p1', amount: 100, label: 'Payment 1', status: 'pending' as const };
    
    it('should create an entry and revalidate paths', async () => {
      const mockInsert = vi.fn().mockReturnThis();
      const mockValues = vi.fn().mockReturnThis();
      const mockReturning = vi.fn().mockResolvedValue([{ id: '5', ...newEntryData, amount: '100' }]);

      (db.insert as any).mockImplementation(() => ({ values: mockValues }));
      mockValues.mockImplementation(() => ({ returning: mockReturning }));

      const result = await createIncomeEntry(newEntryData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ id: '5', ...newEntryData, amount: '100' });
      expect(revalidatePath).toHaveBeenCalledWith('/projects/p1');
      expect(revalidatePath).toHaveBeenCalledWith('/income');
    });

    it('should return error if creation fails', async () => {
      (db.insert as any).mockImplementation(() => { throw new Error('DB Error') });

      const result = await createIncomeEntry(newEntryData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to create income entry');
    });
  });

  describe('markIncomeReceived', () => {
    it('should mark as received and revalidate paths', async () => {
      const mockUpdate = vi.fn().mockReturnThis();
      const mockSet = vi.fn().mockReturnThis();
      const mockWhere = vi.fn().mockReturnThis();
      const mockReturning = vi.fn().mockResolvedValue([{ id: '2', status: 'received' }]);

      (db.update as any).mockImplementation(() => ({ set: mockSet }));
      mockSet.mockImplementation(() => ({ where: mockWhere }));
      mockWhere.mockImplementation(() => ({ returning: mockReturning }));

      const result = await markIncomeReceived('2', 'p1');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ id: '2', status: 'received' });
      expect(revalidatePath).toHaveBeenCalledWith('/projects/p1');
      expect(revalidatePath).toHaveBeenCalledWith('/income');
    });
  });

  describe('deleteIncomeEntry', () => {
    it('should delete an entry and revalidate paths', async () => {
      const mockDelete = vi.fn().mockReturnThis();
      const mockWhere = vi.fn().mockResolvedValue([]);

      (db.delete as any).mockImplementation(() => ({ where: mockWhere }));

      const result = await deleteIncomeEntry('1', 'p1');

      expect(result.success).toBe(true);
      expect(revalidatePath).toHaveBeenCalledWith('/projects/p1');
      expect(revalidatePath).toHaveBeenCalledWith('/income');
    });
  });
});
