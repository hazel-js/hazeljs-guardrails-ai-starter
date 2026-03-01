import { Controller, Get } from '@hazeljs/core';

@Controller({ path: '/api/health' })
export class HealthController {
  @Get()
  health(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
