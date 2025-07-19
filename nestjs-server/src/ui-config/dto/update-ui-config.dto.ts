import { z } from 'zod';

export const updateUIConfigSchema = z
  .object({
    theme: z.enum(['light', 'dark']),
  })
  .required();

export type UpdateUIConfigDto = z.infer<typeof updateUIConfigSchema>;
