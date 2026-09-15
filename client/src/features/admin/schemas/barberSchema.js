import { z } from 'zod';
export const editBarberSchema = z.object({
 displayName: z.string().trim().min(2).max(50),
 phone: z.string().regex(/^[0-9]{10}$/, 'Use exactly 10 digits').or(z.literal('')),
 chairNumber: z.coerce.number().int().min(1), experience: z.coerce.number().int().min(0),
 specialization: z.string().trim().max(100), isActive: z.boolean().optional(),
});
export const barberSchema = editBarberSchema.extend({
 name: z.string().trim().min(2).max(50), email: z.email(),
 password: z.string().min(8).refine(v => new TextEncoder().encode(v).length <= 72, 'Use at most 72 bytes'),
});
