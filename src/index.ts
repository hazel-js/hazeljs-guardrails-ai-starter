import 'reflect-metadata';
import { HazelApp } from '@hazeljs/core';
import { AppModule } from './app.module';

const PORT = parseInt(process.env.PORT || '3000', 10);

async function bootstrap(): Promise<void> {
  const app = new HazelApp(AppModule);

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  await app.listen(PORT);
  console.log(`\n  Guardrails AI Starter running at http://localhost:${PORT}`);
  console.log(`  Chat API: POST http://localhost:${PORT}/api/chat`);
  console.log(`  Health:   GET  http://localhost:${PORT}/api/health\n`);
}

bootstrap().catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});
