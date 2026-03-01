import type { Interceptor } from '@hazeljs/core';
import type { RequestContext } from '@hazeljs/core';
/**
 * Converts GuardrailViolationError to BadRequestError (400) so the router
 * returns a proper client error instead of 500.
 */
export declare class GuardrailErrorInterceptor implements Interceptor {
    intercept(context: RequestContext, next: () => Promise<unknown>): Promise<unknown>;
}
