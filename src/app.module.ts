import { HazelModule } from '@hazeljs/core';
import { ConfigModule } from '@hazeljs/config';
import { AIModule } from '@hazeljs/ai';
import { GuardrailsModule } from '@hazeljs/guardrails';
import { ChatController } from './chat/chat.controller';
import { HealthController } from './health/health.controller';
import { GuardrailErrorInterceptor } from './interceptors/guardrail-error.interceptor';

@HazelModule({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env', '.env.local'] }),
    GuardrailsModule.forRoot({
      redactPIIByDefault: true,
      blockInjectionByDefault: true,
      blockToxicityByDefault: true,
      piiEntities: ['email', 'phone', 'ssn', 'credit_card'],
      toxicityBlocklist: ['competitor-name', 'internal-system'],
    }),
    AIModule.register({}),
  ],
  controllers: [ChatController, HealthController],
  providers: [GuardrailErrorInterceptor],
})
export class AppModule {}
