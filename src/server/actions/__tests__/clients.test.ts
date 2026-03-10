import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getClients, createClient, updateClient, deleteClient } from '../clients';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

vi.mock('@/lib/db', () => ({
  db: {
    query: {
      clients: {
        findMany: vi.fn(),
      },
    },
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockClients = [
  { id: '1', name: 'Client A', company: 'Company A', email: 'a@example.com', phone: '123' },
  { id: '2', name: 'Client B', company: 'Company B', email: 'b@example.com', phone: '456' },
];

describe('Clients Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getClients', () => {
    it('should return a list of clients', async () => {
      (db.query.clients.findMany as any).mockResolvedValue(mockClients);

      const result = await getClients();
      
      expect(result).toEqual(mockClients);
      expect(db.query.clients.findMany).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if fetching fails', async () => {
      (db.query.clients.findMany as any).mockRejectedValue(new Error('DB Error'));

      await expect(getClients()).rejects.toThrow('Failed to fetch clients');
    });
  });

  describe('createClient', () => {
    const newClientData = { name: 'New Client', company: 'New Company', email: 'new@example.com' };
    
    it('should create a client and revalidate paths', async () => {
      const mockInsert = vi.fn().mockReturnThis();
      const mockValues = vi.fn().mockReturnThis();
      const mockReturning = vi.fn().mockResolvedValue([{ id: '3', ...newClientData }]);

      (db.insert as any).mockImplementation(() => ({ values: mockValues }));
      mockValues.mockImplementation(() => ({ returning: mockReturning }));

      const result = await createClient(newClientData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ id: '3', ...newClientData });
      expect(revalidatePath).toHaveBeenCalledWith('/clients');
      expect(revalidatePath).toHaveBeenCalledWith('/projects');
    });

    it('should return error if creation fails', async () => {
      (db.insert as any).mockImplementation(() => { throw new Error('DB Error') });

      const result = await createClient(newClientData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to create client');
    });
  });

  describe('updateClient', () => {
    const updateData = { name: 'Updated Name' };
    
    it('should update a client and revalidate paths', async () => {
      const mockUpdate = vi.fn().mockReturnThis();
      const mockSet = vi.fn().mockReturnThis();
      const mockWhere = vi.fn().mockReturnThis();
      const mockReturning = vi.fn().mockResolvedValue([{ id: '1', ...updateData }]);

      (db.update as any).mockImplementation(() => ({ set: mockSet }));
      mockSet.mockImplementation(() => ({ where: mockWhere }));
      mockWhere.mockImplementation(() => ({ returning: mockReturning }));

      const result = await updateClient('1', updateData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ id: '1', ...updateData });
      expect(revalidatePath).toHaveBeenCalledWith('/clients');
      expect(revalidatePath).toHaveBeenCalledWith('/projects');
    });

    it('should return error if update fails', async () => {
      (db.update as any).mockImplementation(() => { throw new Error('DB Error') });

      const result = await updateClient('1', updateData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to update client');
    });
  });

  describe('deleteClient', () => {
    it('should delete a client and revalidate paths', async () => {
      const mockDelete = vi.fn().mockReturnThis();
      const mockWhere = vi.fn().mockResolvedValue([]);

      (db.delete as any).mockImplementation(() => ({ where: mockWhere }));

      const result = await deleteClient('1');

      expect(result.success).toBe(true);
      expect(revalidatePath).toHaveBeenCalledWith('/clients');
      expect(revalidatePath).toHaveBeenCalledWith('/projects');
    });

    it('should return error if deletion fails', async () => {
      (db.delete as any).mockImplementation(() => { throw new Error('DB Error') });

      const result = await deleteClient('1');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to delete client (might be in use)');
    });
  });
});
