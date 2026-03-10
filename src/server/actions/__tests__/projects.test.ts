import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProjects, getProjectById, createProject, updateProject, updateProjectStatus, deleteProject } from '../projects';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

vi.mock('@/lib/db', () => ({
  db: {
    query: {
      projects: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
      },
    },
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockProjects = [
  { id: '1', name: 'Project A', status: 'in_progress', totalPrice: '1000' },
  { id: '2', name: 'Project B', status: 'completed', totalPrice: '2000' },
];

describe('Projects Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProjects', () => {
    it('should return all projects', async () => {
      (db.query.projects.findMany as any).mockResolvedValue(mockProjects);

      const result = await getProjects();
      
      expect(result).toEqual(mockProjects);
      expect(db.query.projects.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return projects by status', async () => {
      (db.query.projects.findMany as any).mockResolvedValue([mockProjects[0]]);

      const result = await getProjects('in_progress');
      
      expect(result).toEqual([mockProjects[0]]);
      expect(db.query.projects.findMany).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if fetching fails', async () => {
      (db.query.projects.findMany as any).mockRejectedValue(new Error('DB Error'));

      await expect(getProjects()).rejects.toThrow('Failed to fetch projects');
    });
  });

  describe('getProjectById', () => {
    it('should return a single project', async () => {
      (db.query.projects.findFirst as any).mockResolvedValue(mockProjects[0]);

      const result = await getProjectById('1');
      
      expect(result).toEqual(mockProjects[0]);
      expect(db.query.projects.findFirst).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if fetching fails', async () => {
      (db.query.projects.findFirst as any).mockRejectedValue(new Error('DB Error'));

      await expect(getProjectById('1')).rejects.toThrow('Failed to fetch project details');
    });
  });

  describe('createProject', () => {
    const newProjectData = { name: 'New Project', clientId: 'c1', status: 'not_started' as const, paymentType: 'one_time' as const };
    
    it('should create a project and revalidate paths', async () => {
      const mockInsert = vi.fn().mockReturnThis();
      const mockValues = vi.fn().mockReturnThis();
      const mockReturning = vi.fn().mockResolvedValue([{ id: '3', ...newProjectData }]);

      (db.insert as any).mockImplementation(() => ({ values: mockValues }));
      mockValues.mockImplementation(() => ({ returning: mockReturning }));

      const result = await createProject(newProjectData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ id: '3', ...newProjectData });
      expect(revalidatePath).toHaveBeenCalledWith('/projects');
      expect(revalidatePath).toHaveBeenCalledWith('/');
    });

    it('should return error if creation fails', async () => {
      (db.insert as any).mockImplementation(() => { throw new Error('DB Error') });

      const result = await createProject(newProjectData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to create project');
    });
  });

  describe('updateProject', () => {
    const updateData = { name: 'Updated Name', status: 'completed' as const };
    
    it('should update a project and revalidate paths', async () => {
      const mockUpdate = vi.fn().mockReturnThis();
      const mockSet = vi.fn().mockReturnThis();
      const mockWhere = vi.fn().mockReturnThis();
      const mockReturning = vi.fn().mockResolvedValue([{ id: '1', ...updateData }]);

      (db.update as any).mockImplementation(() => ({ set: mockSet }));
      mockSet.mockImplementation(() => ({ where: mockWhere }));
      mockWhere.mockImplementation(() => ({ returning: mockReturning }));

      const result = await updateProject('1', updateData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ id: '1', ...updateData });
      expect(revalidatePath).toHaveBeenCalledWith('/projects/1');
      expect(revalidatePath).toHaveBeenCalledWith('/projects');
      expect(revalidatePath).toHaveBeenCalledWith('/');
    });

    it('should return error if update fails', async () => {
      (db.update as any).mockImplementation(() => { throw new Error('DB Error') });

      const result = await updateProject('1', updateData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to update project');
    });
  });

  describe('updateProjectStatus', () => {
    it('should update project status', async () => {
      const mockUpdate = vi.fn().mockReturnThis();
      const mockSet = vi.fn().mockReturnThis();
      const mockWhere = vi.fn().mockReturnThis();
      const mockReturning = vi.fn().mockResolvedValue([{ id: '1', status: 'completed' }]);

      (db.update as any).mockImplementation(() => ({ set: mockSet }));
      mockSet.mockImplementation(() => ({ where: mockWhere }));
      mockWhere.mockImplementation(() => ({ returning: mockReturning }));

      const result = await updateProjectStatus('1', 'completed');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ id: '1', status: 'completed' });
    });
  });

  describe('deleteProject', () => {
    it('should delete a project and revalidate paths', async () => {
      const mockDelete = vi.fn().mockReturnThis();
      const mockWhere = vi.fn().mockResolvedValue([]);

      (db.delete as any).mockImplementation(() => ({ where: mockWhere }));

      const result = await deleteProject('1');

      expect(result.success).toBe(true);
      expect(revalidatePath).toHaveBeenCalledWith('/projects');
      expect(revalidatePath).toHaveBeenCalledWith('/');
    });

    it('should return error if deletion fails', async () => {
      (db.delete as any).mockImplementation(() => { throw new Error('DB Error') });

      const result = await deleteProject('1');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to delete project');
    });
  });
});
