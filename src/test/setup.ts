import { vi } from 'vitest';

// Mock Next.js cache revalidatePath
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

// Mock react's cache
vi.mock('react', async () => {
  const actual = await vi.importActual('react') as any;
  return {
    ...actual,
    cache: vi.fn((fn) => fn),
  };
});
