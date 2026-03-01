import { Injectable } from '@hazeljs/core';
import type { Interceptor } from '@hazeljs/core';
import type { RequestContext } from '@hazeljs/core';
import { BadRequestError } from '@hazeljs/core';
import { GuardrailViolationError } from '@hazeljs/guardrails';

/**
 * Converts GuardrailViolationError to BadRequestError (400) so the router
 * returns a proper client error instead of 500.
 */
@Injectable()
export class GuardrailErrorInterceptor implements Interceptor {
  async intercept(context: RequestContext, next: () => Promise<unknown>): Promise<unknown> {
    try {
      return await next();
    } catch (error) {
      if (error instanceof GuardrailViolationError) {
        throw new BadRequestError(
          error.blockedReason ?? error.message,
          error.violations
        );
      }
      throw error;
    }
  }
}
