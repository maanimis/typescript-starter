import config from 'config';
import { z } from 'zod';

const configSchema = z.object({
  name: z.string(),
  logger: z.object({
    level: z.enum(['error', 'warn', 'info', 'debug', 'trace']),
    dir: z.string(),
    appLogFile: z.string(),
    error: z.string(),
    syncMode: z.boolean(),
  }),
});

export type AppConfig = z.infer<typeof configSchema>;

const result = configSchema.safeParse(config);

if (!result.success) {
  console.error(result.error);
  throw new Error('Invalid application configuration');
}

export const appConfig: AppConfig = result.data;
